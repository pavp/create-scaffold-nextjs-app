-# GitHub Copilot Instructions

This is the **create-scaffold-app** CLI tool and its companion template for bootstrapping modern Next.js frontend applications at Scaffold. Follow these instructions when generating or editing code in this project.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript (strict mode)
- **State**: Zustand (local/global) + React Query / TanStack Query v5 (server state)
- **UI**: MUI v7 + Emotion + SCSS Modules + Style Dictionary (design tokens)
- **Forms**: React Hook Form + Zod
- **i18n**: next-intl
- **Testing**: Jest (V8 coverage) + React Testing Library + Faker.js
- **HTTP**: Axios via a shared `httpClient` wrapper


---

## Architecture: Clean Architecture

```
Views Layer        → Components, Business Hooks, Controller Hooks
Application Layer  → Selectors, Repositories, Stores
Infrastructure     → API, Gateways, Helpers
```

### Key Rules

1. **Views** never access gateways or the HTTP client directly — always go through repositories.
2. **Business hooks** own data fetching, business rules, and transformations. They are UI-agnostic.
3. **Controller hooks** own UI state and interaction handlers only. They receive business logic functions as parameters.
4. **Repositories** abstract React Query + gateway calls behind a consistent interface.
5. **Gateways** abstract the underlying data source (`http | localStorage | mock`). Always implement `BaseGateway`.
6. **Selectors** compute derived state from repository queries using `useMemo`.

---

## File Naming Conventions

| Type      | Pattern                  |
| --------- | ------------------------ |
| Component | `name.component.tsx`     |
| View      | `name.view.tsx`          |
| Hook      | `use-name.hook.ts`       |
| Helper    | `name.helper.ts`         |
| Store     | `name.store.ts`          |
| Types     | `name.types.ts`          |
| Test      | `name.<type>.test.ts(x)` |

- All file and directory names: **kebab-case**
- Code: variables/functions → `camelCase`, components/types/interfaces → `PascalCase`, constants → `SCREAMING_SNAKE_CASE`

---

## Module Structure

Every feature module lives under `src/modules/[module-name]/` and follows this layout:

```
src/modules/[module-name]/
├── api/                        # HTTP client integration + Zod validation
├── components/                 # Module-specific UI components
├── hooks/                      # Shared module hooks
├── repositories/
│   └── [entity]/
│       ├── gateways/
│       │   ├── http-gateway/
│       │   ├── local-storage-gateway/
│       │   └── mock-gateway/
│       ├── helpers/
│       ├── [entity].query-options.ts
│       ├── [entity].repository.keys.ts
│       ├── [entity].repository.queries.ts
│       ├── [entity].repository.mutations.ts
│       └── [entity].repository.types.ts
├── selectors/
├── stores/
├── views/
│   └── [view-name]/
│       ├── [view-name].view.tsx
│       ├── hooks/
│       │   ├── use-[view-name]-business/
│       │   └── use-[view-name]-controller/
│       └── helpers/
├── index.ts                    # Public API — only export from here
└── [module-name].types.ts
```

Each directory must have an `index.ts` re-exporting its public surface.

---

## Gateway Pattern

```typescript
// Always implement BaseGateway
export interface EntityGateway extends BaseGateway {
  findAll(filters?: EntityFilters, options?: GatewayOptions): Promise<Entity[]>;
  findById(id: string | number, options?: GatewayOptions): Promise<Entity>;
  create(entity: CreateEntityRequest, options?: GatewayOptions): Promise<Entity>;
  update(id: string | number, entity: UpdateEntityRequest, options?: GatewayOptions): Promise<Entity>;
  delete(id: string | number, options?: GatewayOptions): Promise<void>;
}

// Use a factory to select the data source
export const createEntityGateway = (dataSource: DataSource): EntityGateway => {
  switch (dataSource) {
    case 'http':
      return createHttpEntityGateway();
    case 'localStorage':
      return createLocalStorageEntityGateway();
    case 'mock':
      return createMockEntityGateway();
  }
};
```

---

## Repository Pattern

```typescript
// ✅ Use repository hooks in business hooks
const entitiesQuery = entityRepository.queries.useEntities(filters, dataSource);
const createMutation = entityRepository.mutations.useCreateEntity(dataSource);

// ❌ Never call useQuery/useMutation directly in components or views
```

---

## Hook Separation

```typescript
// Business hook — data, logic, transformations
export const useEntityBusiness = (dataSource: DataSource = 'http') => {
  const entitiesQuery = entityRepository.queries.useEntities(filters, dataSource);
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

// Controller hook — UI state and interaction handlers only
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

## Selector Pattern

```typescript
// Selectors filter/compute derived data from repository queries
export const useCompletedEntitiesSelector = (dataSource: DataSource = 'http') => {
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);

  const completedEntities = useMemo(
    () => entitiesQuery.data?.filter((e) => e.status === 'completed'),
    [entitiesQuery.data],
  );

  return { data: completedEntities, isLoading: entitiesQuery.isLoading, error: entitiesQuery.error };
};
```

---

## TypeScript

- **Strict mode** is always on.
- Use **Zod schemas** for all API request/response validation at HTTP boundaries.
- Define clear interfaces for all layer boundaries.
- Prefer `type DataSource = 'http' | 'localStorage' | 'mock'` union types over enums.
- Use utility types (`Partial`, `Pick`, `Omit`) instead of duplicating interfaces.

---

## Design Tokens

Always use design tokens — never hard-code colors, spacing, or typography values.

```typescript
// TypeScript (inline styles / sx prop)
import tokens from '@/styles/tokens';
<Box sx={{ backgroundColor: tokens.colors.semanticBrandPrimary, padding: tokens.spacing.scale4 }} />

// CSS / SCSS (preferred for stylesheets)
.my-component {
  background-color: var(--color-semantic-brand-primary);
  padding: var(--spacing-scale4);
}
```

---

## Imports

Order: **external libraries → internal `@/` aliases (alphabetical) → relative imports**

```typescript
import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/ui';
import { entityRepository } from '@/modules/entity';
import { httpClient } from '@/shared/api/http-client';

import { validateData } from './helpers/validation.helper';
```

Use absolute path aliases (`@/`) for all cross-module imports. Relative imports are acceptable only within the same module directory.

---

## Internationalization

- All user-visible text must use `next-intl` — never hard-code strings.
- Translation keys live in locale JSON files under `public/locales/`.

```typescript
import { useTranslations } from 'next-intl';

export const MyComponent = () => {
  const t = useTranslations('moduleName');
  return <h1>{t('title')}</h1>;
};
```

---

## Testing

- **Coverage threshold**: 85% for branches, functions, lines, and statements.
- Always import test utilities from `@test/utils` — **never** directly from `@testing-library/react`.
- Use **Arrange-Act-Assert (AAA)** pattern in all tests.
- Use Faker-based factories (`test/entities/`) for mock data.
- Mock at the **repository level** for component tests; use gateway mocks for integration tests.

```typescript
// ✅ Correct
import { renderWithProviders, screen, fireEvent } from '@test/utils';

describe('EntityForm', () => {
  it('should call onSubmit with trimmed name', () => {
    // Arrange
    const mockSubmit = jest.fn();
    renderWithProviders(<EntityForm onSubmit={mockSubmit} />);

    // Act
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '  Test  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Assert
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test' }));
  });
});
```

---

## Analytics & Feedback

Both systems activate only when their environment variables are set — safe to omit.

```typescript
// In root layout
```

---

## Git & Commit Conventions

- **Trunk-based development**: short-lived branches (≤ 3 days), frequent merges to `main`.
- **Branch format**: `type/description` (e.g., `feat/add-user-profile`, `fix/auth-redirect`).
  - Valid types: `feat`, `fix`, `hotfix`, `chore`, `docs`, `refactor`, `test`, `perf`
- **Commit format** (Conventional Commits, enforced by Husky):
  ```
  feat: add user profile page
  fix(auth): resolve redirect loop
  feat!: redesign navigation  ← breaking change
  ```
- Commits automatically trigger semantic releases: `feat` → minor, `fix`/`perf` → patch, `feat!` → major.

---

## Key Commands

```bash
yarn dev              # Build style-dictionary then start dev server
yarn build            # Production build
yarn test             # Run Jest tests
yarn test:watch       # Tests in watch mode
yarn lint             # ESLint + Stylelint
yarn lint:fix         # Auto-fix all linting issues
yarn typecheck        # TypeScript type-check only
yarn build:dictionary # Regenerate design token files
yarn validate:branch  # Validate current branch name
yarn commit           # Interactive conventional commit helper
yarn release:dry      # Dry-run semantic release
```
