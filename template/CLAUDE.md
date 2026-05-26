# CLAUDE.md — {{PROJECT_NAME}}

Generated from [scaffold-nextjs-app](https://github.com/pavp/create-scaffold-nextjs-app).

---

## Architecture overview

**3-layer Clean Architecture:**

```
Views Layer         Components + Business Hooks + Controller Hooks
Application Layer   Selectors + Repositories + Stores (Zustand)
Infrastructure      API (Axios+Zod) + Gateways (http/localStorage/mock) + Helpers
```

**Data flow (always top-down, never skip layers):**

```
User interaction
  → Controller Hook (UI state, event wiring)
  → Business Hook (domain logic, data transforms)
  → Repository (React Query wrapper)
  → Gateway (data source abstraction)
  → API / localStorage / mock
```

---

## Available scripts

```bash
yarn dev              # Dev server (builds tokens first, uses Turbopack)
yarn build            # Production build (builds tokens first)
yarn lint             # ESLint + Stylelint
yarn lint:fix         # Auto-fix
yarn test             # Jest
yarn test:watch       # Jest watch
yarn typecheck        # tsc --noEmit
yarn build:dictionary # Compile design tokens (Style Dictionary)
yarn commit           # Interactive conventional commit (commitizen)
yarn validate:branch  # Validate current branch name
```

---

## How to add a new module

Full guide: `docs/developer-guide.md`. Summary of all 11 steps:

**1. Create directory structure**

```
src/modules/[name]/
  api/
  repositories/[name]/gateways/{http-gateway,local-storage-gateway,mock-gateway}/
  selectors/
  stores/
  views/[view]/hooks/{use-[view]-business,use-[view]-controller}/
  components/
  hooks/
  index.ts
  [name].types.ts
```

**2. Define types in `[name].types.ts`**

- TypeScript interfaces for entity, request/response, filters
- Co-located Zod schemas for all interfaces
- `DataSource`, `ErrorType` union types

**3. Create API layer (`api/[name]-api.ts`)**

- Define `EntityApiContract` interface
- Implement with `httpClient.get/post/put/delete`
- Pass `requestSchema` + `responseSchema` to every call (Zod validation)
- Export singleton: `export const entityApi = createEntityApiService()`

**4. Define gateway interface (`repositories/[name]/gateways/[name].gateway.types.ts`)**

- Extend `BaseGateway` with entity-specific methods
- All methods accept `GatewayOptions` (includes `signal?: AbortSignal`)

**5. Implement gateways**

- `http-gateway/` — delegates to API service
- `local-storage-gateway/` — reads/writes from `localStorage`
- `mock-gateway/` — returns fixture data (for tests)
- `index.ts` — factory: `createEntityGateway(dataSource: DataSource)`

**6. Create repository layer**

- `[name].repository.keys.ts` — hierarchical query keys
- `[name].query-options.ts` — `queryFn` factories + `createPrefetchableQuery` wrappers
- `[name].repository.queries.ts` — React Query hooks via `useQuery`
- `[name].repository.mutations.ts` — `useMutation` + cache invalidation
- `index.ts` — export single `entityRepository` object

**7. Create selectors** (`selectors/use-[name]-selector/`)

- `useMemo` over repository query results
- No new API calls — derive from existing cached data
- Return `{ data, isLoading, error, refetch }`

**8. Create Zustand store** (`stores/[name].store.ts`)

- Use `createStoreWithMiddleware` (immer + optional persist)
- Separate `actions` key from state keys
- Export `use[Name]Store` and `use[Name]Actions`

**9. Create business hook** (`views/[view]/hooks/use-[view]-business/`)

- Calls repository queries and mutations
- Domain validation (throw descriptive errors)
- Data transforms with `useMemo`
- Returns: `{ entities, createEntity, isLoading, hasError, isEmpty, ... }`

**10. Create controller hook** (`views/[view]/hooks/use-[view]-controller/`)

- All `useState` lives here
- Event handlers that wire business actions to UI events
- Pattern: `handleCreateSubmit(createEntityFn) => async (data) => { await createEntityFn(data); setShowForm(false); }`

**11. Create view + update index**

- View connects business + controller, never accesses repository directly
- `index.ts` exports only the public API (types, repository, selectors, store, views)

---

## Layer responsibilities

### Business hook — owns domain logic

```typescript
// ✅ Domain validation, transforms, computed state
export const useEntityBusiness = (dataSource: DataSource) => {
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);
  const createMutation = entityRepository.mutations.useCreateEntity(dataSource);

  const createEntity = useCallback(
    async (data: CreateEntityRequest) => {
      if (!data.name?.trim()) throw new Error('Name is required');
      return createMutation.mutate({ ...data, name: data.name.trim() });
    },
    [createMutation],
  );

  return { entities: entitiesQuery.data, createEntity, isLoading: entitiesQuery.isLoading };
};
```

### Controller hook — owns UI state

```typescript
// ✅ useState, event handlers, dialog triggers
export const useEntityController = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateSubmit = useCallback(
    (createFn: (data: CreateEntityRequest) => Promise<void>) => async (data: CreateEntityRequest) => {
      await createFn(data);
      setShowForm(false);
    },
    [],
  );

  return { showForm, handleCreateSubmit, handleCreateClick: () => setShowForm(true) };
};
```

---

## Gateway pattern

```typescript
// Factory selects implementation
export const createEntityGateway = (dataSource: DataSource = 'http') => {
  switch (dataSource) {
    case 'http':
      return createHttpEntityGateway();
    case 'localStorage':
      return createLocalStorageEntityGateway();
    case 'mock':
      return createMockEntityGateway();
    default:
      throw new Error(`Unsupported: ${dataSource}`);
  }
};

// All implementations satisfy the same interface
export interface EntityGateway extends BaseGateway {
  findAll(filters?: EntityFilters, options?: GatewayOptions): Promise<Entity[]>;
  findById(id: string | number, options?: GatewayOptions): Promise<Entity>;
  create(entity: CreateEntityRequest, options?: GatewayOptions): Promise<Entity>;
  update(id: string | number, entity: UpdateEntityRequest, options?: GatewayOptions): Promise<Entity>;
  delete(id: string | number, options?: GatewayOptions): Promise<void>;
  getSourceInfo(): {
    type: string;
    name: string;
    capabilities: { offline: boolean; realtime: boolean; persistence: boolean };
  };
}
```

**Adding a new gateway:** implement the interface, add case to factory.

---

## Repository pattern

```typescript
// ✅ Always use repository hooks
const entitiesQuery = entityRepository.queries.useEntities(filters, dataSource);
const createMutation = entityRepository.mutations.useCreateEntity(dataSource);

// ❌ Never call useQuery directly
const q = useQuery(['entities'], () => entityApi.getAll());
```

Mutations automatically invalidate React Query cache on success.
Use `entityRepository.queryKeys` for manual cache operations.

---

## Selector pattern

```typescript
export const useCompletedEntitiesSelector = (dataSource: DataSource = 'http') => {
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);

  const completed = useMemo(() => entitiesQuery.data?.filter((e) => e.status === 'completed'), [entitiesQuery.data]);

  return { data: completed, isLoading: entitiesQuery.isLoading, error: entitiesQuery.error };
};
```

---

## Design tokens (Style Dictionary)

- Token source: `src/styles/style-dictionary/`
- Build outputs CSS custom properties and SCSS variables
- Run automatically before `dev` and `build`
- To add a token: edit source JSON → `yarn build:dictionary`

---

## Internationalization (next-intl)

- Locales configured in `src/config.ts`: `['en', 'es', 'fr', 'pt', 'de', 'nl', 'sv']`
- Default locale: `en`
- All pages live under `app/[locale]/`
- Translation files in `src/i18n/`
- After adding a new locale: update `config.ts` AND `LocalizationProvider`

---

## Config

`src/config.ts` (generated from template):

```typescript
export const config = {
  env,
  isDev,
  isTst,
  isPrd,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  appName: '{{PROJECT_NAME}}',
  muiLicense: process.env.NEXT_PUBLIC_MUI_PRO || '', // Required for MUI X Pro components
  translation: { revalidate, locales, defaultLocale },
};
```

**Required env vars** (`.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_MUI_PRO=<your-mui-x-pro-license-key>  # Get from mui.com/store
```

---

## Testing

Framework: Jest + Testing Library (`jsdom`)
Utilities: `@test/utils` (import all test helpers from here)

### Mock level by test type

| Test target      | Mock at                                     |
| ---------------- | ------------------------------------------- |
| Component / View | Repository (mock entire `entityRepository`) |
| Business hook    | Repository query/mutation mocks             |
| Repository       | Gateway (use mock gateway)                  |
| Gateway          | API client / fetch                          |
| Selector         | Real data fixtures via `useMemo`            |

### Required structure (AAA)

```typescript
describe('EntityForm', () => {
  it('should call onSubmit with trimmed name', () => {
    // Arrange
    const mockData = createMockEntity({ name: '  Test  ' });
    const mockHandler = jest.fn();

    // Act
    renderWithProviders(<EntityForm entity={mockData} onSubmit={mockHandler} />);
    fireEvent.click(screen.getByText('Submit'));

    // Assert
    expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test' }));
  });
});
```

### File naming

```
*.component.test.tsx
*.hook.test.ts
*.gateway.test.ts
*.repository.test.ts
*.helper.test.ts
```

---

## File naming and import conventions

### Files — kebab-case (ESLint enforced)

```
todo-management.view.tsx       ✅
use-todo-business.hook.ts      ✅
TodoManagement.tsx             ❌
useTodoBusiness.ts             ❌
```

### Code elements

- Variables / functions: `camelCase`
- Components / Types / Interfaces: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`

### Import order (auto-sorted by ESLint)

```typescript
// 1. External
import { useQuery } from '@tanstack/react-query';
// 2. Internal absolute
import { entityRepository } from '@/modules/entity';
// 3. Relative (minimize)
import { helper } from './helpers/helper';
```

---

## Git conventions

### Commits (Conventional Commits — enforced by commitlint)

```
feat(scope): description    → MINOR version bump
fix(scope): description     → PATCH version bump
feat!: breaking change      → MAJOR version bump
chore/docs/refactor/test/perf/style → no release or PATCH
```

### Branch naming (validated pre-push)

Pattern: `type/kebab-description`
Valid types: `feat`, `fix`, `hotfix`, `chore`, `docs`, `refactor`, `test`, `perf`

```
feat/add-user-auth     ✅
fix/login-redirect     ✅
MyFeature              ❌
feat/Add_User_Auth     ❌
```

### Pre-commit (Husky → lint-staged)

ESLint auto-fix + Stylelint auto-fix + Prettier — runs on staged files only.

### Pre-push

Full Jest suite + production build must pass.

**Never use `--no-verify`** unless documenting the reason.

---

## Anti-patterns

```typescript
// ❌ Raw useQuery in business hooks
const q = useQuery(['entities'], () => entityApi.getAll());
// ✅ Repository pattern
const q = entityRepository.queries.useEntities(filters, dataSource);

// ❌ UI state in business hook
const [showForm, setShowForm] = useState(false); // in business hook
// ✅ UI state in controller hook only

// ❌ Direct API import in component/hook
import { entityApi } from '@/modules/entity/api/entity-api';
// ✅ Access through module public API
import { entityRepository } from '@/modules/entity';

// ❌ Calling gateway directly from business hook
const gateway = createEntityGateway('http');
const data = await gateway.findAll();
// ✅ Gateway called only from repository layer

// ❌ Skipping hook separation for "simple" features
// ✅ Always separate business from controller — simplicity is not a reason to skip

// ❌ Mixing business logic into view component
export const MyView = () => {
  if (!data.name?.trim()) throw new Error('...'); // belongs in business hook
};
```
