# CLAUDE.md — scaffold-nextjs-app

## What this repo is

**Dual-nature codebase.** Two things at once:

1. **CLI tool** (`bin/create-scaffold-app.js`) — published to npm as `create-scaffold-nextjs-app`.
   Generates new Next.js projects via `npx create-scaffold-nextjs-app@latest`.
2. **Reference implementation** (`src/`) — a working Next.js app demonstrating the exact
   architecture and patterns that get scaffolded.

`template/` contains files that **override** the reference app during scaffolding (they have
`{{PACKAGE_NAME}}` / `{{PROJECT_DESCRIPTION}}` placeholders). `src/` is the live example.

---

## Essential commands

```bash
yarn dev          # Start dev server (runs build:dictionary first, uses Turbopack)
yarn build        # Production build (runs build:dictionary first)
yarn lint         # ESLint + Stylelint
yarn lint:fix     # Auto-fix lint issues
yarn test         # Jest
yarn test:watch   # Jest watch mode
yarn typecheck    # tsc --noEmit
yarn test:cli     # Automated CLI smoke test (creates a project and validates it)
yarn check:drift  # Detect dependency drift between package.json and template/package.json
yarn build:dictionary  # Compile Style Dictionary tokens → CSS vars / SCSS
yarn release:dry  # Dry-run semantic release (no git push, no npm publish)
```

---

## Repo structure

```
bin/                    CLI entry point (published)
template/               Placeholder-injected files copied into generated projects
  config.ts             → lands at src/config.ts in generated project
  package.json          → project's package.json (with {{PACKAGE_NAME}} etc.)
  .env.template         → becomes .env.local
  README.md             → project README
  commitlint.config.js  → commit linting config
  .github/              → dependabot config
src/                    Reference implementation of the generated app
  app/                  Next.js App Router (locale-wrapped: app/[locale]/...)
  modules/              Feature modules (Clean Architecture)
  components/           Shared UI components
  ui/                   Design system components
  core/                 React Query / Zustand wrappers, lib utilities
  hooks/                Global shared hooks
  i18n/                 next-intl config
  navigation/           Typed navigation helpers
  shared/               Shared types, API client, endpoints
  styles/               Style Dictionary source + build output
  types/                Global TypeScript types
  actions/              Next.js Server Actions
  api/                  API routes config
docs/                   14 pattern/convention docs
scripts/                validate-branch-name.js, other utilities
tasks/                  Project planning artifacts
gitignore-template      Renamed to .gitignore in generated project (npm strips .gitignore)
.releaserc.json         Semantic release config
```

---

## How the CLI works

**Entry:** `bin/create-scaffold-app.js` — plain Node.js (no build step needed).

**Mode detection:** `isLocalDevelopment()` checks if `src/` exists alongside `bin/`.

- Local mode: `copyLocalTemplate()` — copies from repo root, excludes CLI-specific files
- Published mode: `downloadTemplate()` — downloads `https://github.com/pavp/create-scaffold-nextjs-app/archive/main.zip`

**Two-pass copy:**

1. Main copy: entire repo (minus `node_modules`, `.git`, `scripts`, `bin`, `template/`, `docs/contributing.md`, `devops`, `.github/workflows`)
2. Template override: files in `template/` are copied on top (they win)

**Template overlay mapping** (`template/` file → destination in generated project):

| Source                            | Destination              | Notes                                                                                                           |
| --------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `template/config.ts`              | `src/config.ts`          | Contains `{{PROJECT_NAME}}` placeholder. Keep in sync with `src/config.ts`.                                     |
| `template/package.json`           | `package.json`           | Canonical deps for generated projects. Keep in sync with root `package.json`. Run `yarn check:drift` to verify. |
| `template/README.md`              | `README.md`              | Project docs with placeholders.                                                                                 |
| `template/CLAUDE.md`              | `CLAUDE.md`              | AI agent guide shipped with every generated project.                                                            |
| `template/commitlint.config.js`   | `commitlint.config.js`   | Conventional Commits config.                                                                                    |
| `template/.env.template`          | `.env.local`             | Renamed during copy.                                                                                            |
| `template/.github/dependabot.yml` | `.github/dependabot.yml` | Dependabot config.                                                                                              |

**Placeholder replacement** (applied to `.ts/.js/.json/.md` files):

```
{{PACKAGE_NAME}}          → user-entered package name
{{PROJECT_NAME}}          → same as package name
{{PROJECT_DESCRIPTION}}   → user-entered description
scaffold-nextjs-app       → project name
0\.1\.0                   → 1.0.0
```

**gitignore workaround:** npm strips `.gitignore` from packages. File is stored as `gitignore-template` and renamed during copy.

---

## Architecture of the generated app

**3-layer Clean Architecture:**

```
Views Layer         Components + Business Hooks + Controller Hooks
Application Layer   Selectors + Repositories + Stores (Zustand)
Infrastructure      API (Axios+Zod) + Gateways (http/localStorage/mock) + Helpers
```

**Data flow (always top-down):**

```
User interaction
  → Controller Hook (UI state, event wiring)
  → Business Hook (domain logic, data transforms)
  → Repository (React Query integration)
  → Gateway (data source abstraction)
  → API / localStorage / mock
```

**Module structure** (every feature module follows this exactly):

```
src/modules/[name]/
  api/                          HTTP client + Zod validation
  repositories/[name]/
    gateways/
      http-gateway/
      local-storage-gateway/
      mock-gateway/
      index.ts                  Gateway factory: createEntityGateway(dataSource)
    [name].gateway.types.ts     Interface contract
    [name].query-options.ts     React Query queryFn factories
    [name].repository.keys.ts   Query key hierarchy
    [name].repository.queries.ts
    [name].repository.mutations.ts
    [name].repository.types.ts
  selectors/                    Derived state hooks (useMemo over query results)
  stores/                       Zustand store (with immer middleware)
  views/[view]/
    hooks/
      use-[view]-business/      Data + domain logic
      use-[view]-controller/    UI state + event handlers
    [view].view.tsx
  components/                   Module-local components
  hooks/                        Module-local shared hooks
  index.ts                      Public API (only thing other modules import)
  [name].types.ts               All TypeScript types + Zod schemas
```

**Reference module:** `src/modules/todo/` — most complete example, all patterns implemented.

---

## Core patterns

### Gateway pattern

- All data sources implement the same typed interface (`EntityGateway extends BaseGateway`)
- `createEntityGateway(dataSource: 'http' | 'localStorage' | 'mock')` factory selects implementation
- Gateway returns `getSourceInfo()` with capabilities (`offline`, `realtime`, `persistence`)
- Tests use mock gateway. Dev can switch at runtime via `DataSource` state.

### Repository pattern

- Wraps React Query hooks in typed objects: `entityRepository.queries.useEntities()`
- **Never** call `useQuery` directly in business hooks — always go through repository
- Includes `.prefetch` and `.cancel` helpers for prefetching and query cancellation
- Mutations invalidate/update React Query cache on success

### Hook separation (REQUIRED)

- **Business hook** (`use-[view]-business.hook.ts`): queries, mutations, domain validation,
  data transforms, computed flags (`isEmpty`, `isLoading`, `hasError`)
- **Controller hook** (`use-[view]-controller.hook.ts`): `useState`, event handlers,
  dialog triggers, form open/close state
- View component wires them: `const handleCreate = controller.handleCreateSubmit(business.createEntity)`

### Selectors

- Pure derived state: filter/transform data from existing queries (no new API calls)
- Pattern: `useQuery` result → `useMemo` → return shaped data + loading/error passthrough

### Zustand stores

- Created via `createStoreWithMiddleware` (wraps immer + persist middleware)
- Actions always nested under `state.actions` to separate from data
- Persist excludes `actions` key

### API layer

- `httpClient` wraps Axios with Zod validation on request and response
- Pass `requestSchema` and `responseSchema` options to auto-validate at boundaries
- `AbortSignal` passed through for React Query cancellation support

---

## Conventions enforced by tooling

### File naming

- All files: **kebab-case** enforced by ESLint (`eslint-plugin-check-file`)
- Suffixes encode type: `.component.tsx`, `.hook.ts`, `.view.tsx`, `.repository.ts`, `.gateway.ts`, `.selector.ts`, `.helper.ts`, `.types.ts`

### Import order (ESLint auto-fix)

```typescript
// 1. External libraries
import { useQuery } from '@tanstack/react-query';
// 2. Internal absolute (@/ prefix)
import { entityRepository } from '@/modules/entity';
// 3. Relative (only when necessary)
import { helper } from './helpers/helper';
```

### TypeScript

- Strict mode on
- No `any` — use `unknown` + narrowing
- Interfaces for all layer boundaries
- Zod schemas co-located with types in `[module].types.ts`

### Commits (Conventional Commits — enforced by commitlint + Husky)

```
feat(scope): description    → bumps MINOR
fix(scope): description     → bumps PATCH
feat!: breaking change      → bumps MAJOR
docs/chore/refactor/test/perf/style → PATCH or no release
```

Valid scopes: `cli`, `template`, `nextjs`, `react`, `styles`, `scripts`, `config`, `dependencies`, `husky`, `lint`

### Branch naming (validated pre-push + in CI)

Pattern: `type/kebab-description`
Valid types: `feat`, `fix`, `hotfix`, `chore`, `docs`, `refactor`, `test`, `perf`
Examples: `feat/add-user-auth`, `fix/resolve-login-bug`
`main` is exempt from validation.

### Pre-commit (Husky → lint-staged)

- ESLint auto-fix on `.js/.ts/.tsx`
- Prettier + Stylelint auto-fix on `.css/.scss`
- TypeScript check

### Pre-push (Husky)

- Jest full suite
- Production build

**Never use `--no-verify`** except documented emergencies.

---

## Testing

- Framework: Jest + Testing Library (`jsdom` environment)
- Test utilities and factories: `@test/utils` (path alias → `test/`)
- Path aliases in tests: `@/` → `src/`, `@test/` → `test/`, `@ui/` → `src/ui/`

### Mock strategy (layer-appropriate)

| What to test       | Mock level                        |
| ------------------ | --------------------------------- |
| Components / Views | Mock entire repository object     |
| Business hooks     | Mock repository queries/mutations |
| Repository         | Mock gateway                      |
| Gateway            | Mock API client or fetch          |
| Selectors          | Use real data fixtures            |

### Test structure (AAA — required)

```typescript
describe('FeatureName', () => {
  it('should do X when Y', () => {
    // Arrange
    const mock = createMockEntity({ name: 'Test' });
    // Act
    renderWithProviders(<Component entity={mock} />);
    fireEvent.click(screen.getByText('Submit'));
    // Assert
    expect(mockHandler).toHaveBeenCalledWith(mock);
  });
});
```

### File naming

- `*.component.test.tsx`, `*.hook.test.ts`, `*.gateway.test.ts`, `*.repository.test.ts`

---

## CI/CD

### PR validation (`.github/workflows/pr-validation.yml`)

Runs on every PR to `main`:

1. ESLint + Stylelint
2. TypeScript check
3. Jest tests
4. Next.js build
5. Branch name validation
6. Commit message validation

All must pass → `ready-to-merge` summary job.

### Release (`.github/workflows/release.yml`)

Runs on push to `main`:

1. Same validation as PR
2. `semantic-release` analyzes commits since last tag
3. Generates CHANGELOG, creates git tag + GitHub release
4. Publishes to npm (`GITHUB_TOKEN` + `NPM_TOKEN` secrets required)
5. Skips npm publish if version already exists (idempotent)

**Note:** `.releaserc.json` sets `"npmPublish": false` in the npm plugin — actual publish
happens via the GitHub Actions workflow step directly (not via semantic-release npm plugin).

---

## Known risks and tech debt

| Item                                                      | File                                        | Severity |
| --------------------------------------------------------- | ------------------------------------------- | -------- |
| MUI X Pro license key required — undocumented             | `template/config.ts`, `NEXT_PUBLIC_MUI_PRO` | HIGH     |
| `src/` and `template/` can drift — no automated check     | —                                           | HIGH     |
| Auth module (`src/modules/auth/`) is a stub, undocumented | `src/modules/auth/`                         | MEDIUM   |
| CLI requires `unzip` or `tar` system binary               | `bin/create-scaffold-app.js:115-123`        | MEDIUM   |
| No E2E tests for CLI in CI (manual scripts only)          | `test-cli-automated.js`                     | MEDIUM   |
| `next-intl` pinned at 4.3.4 (not `^`)                     | `template/package.json`                     | LOW      |
| `react-hook-form` pinned at 7.60.0                        | `template/package.json`                     | LOW      |

---

## Anti-patterns

```typescript
// ❌ Direct useQuery in business hooks
const q = useQuery(['entities'], () => entityApi.getAll());

// ✅ Repository pattern
const q = entityRepository.queries.useEntities(filters, dataSource);

// ❌ UI state in business hook
const [showForm, setShowForm] = useState(false); // in business hook

// ✅ Separate controller hook owns all UI state

// ❌ Mixed file naming
TodoManagement.tsx
useTodoBusiness.ts

// ✅ Kebab-case with type suffix
todo-management.view.tsx
use-todo-business.hook.ts

// ❌ Direct API import in component
import { entityApi } from '@/modules/entity/api/entity-api';

// ✅ Access through repository only
import { entityRepository } from '@/modules/entity';

// ❌ Skipping git hooks
git commit --no-verify

// ✅ Fix the lint/test failure
```

---

## AI agent instructions

**Adding a new feature to the CLI:**

- Edit `bin/create-scaffold-app.js` only
- Test with `yarn test:cli` — runs `test-cli-automated.js`
- No TypeScript, no build step for the CLI itself

**Adding a new feature module to `src/`:**

- Follow the 11-step guide in `docs/developer-guide.md`
- Use `src/modules/todo/` as the reference implementation
- All layers required: api → gateway → repository → selectors → store → hooks → view
- Export only through `index.ts` (other modules must not import internal paths)

**Modifying template files:**

- Edit files in `template/` (not `src/`)
- Test: `yarn test:cli` creates a real project and validates it
- Ensure placeholder strings are not accidentally introduced or removed

**Triggering a release:**

- Merge to `main` with correct Conventional Commits → automated release
- Use `yarn release:dry` to preview what version would be published

**Finding pattern implementations:**

- Gateway pattern: `src/modules/todo/repositories/todo/gateways/`
- Repository pattern: `src/modules/todo/repositories/todo/`
- Hook separation: `src/modules/todo/views/todo-management/hooks/`
- Selectors: `src/modules/todo/selectors/`
- Zustand store: `src/modules/todo/stores/`
- HTTP client: `src/shared/api/http-client.ts` (inferred from doc references)
- Design tokens: `src/styles/style-dictionary/`
