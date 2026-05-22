# Rules and Conventions

This document outlines the code style, architectural patterns, and conventions that ensure consistent, maintainable, and scalable development across the project.

## TypeScript

This project uses **TypeScript** to provide type safety, better developer experience, and avoid common runtime bugs. The configuration includes:

- **Strict mode enabled** for maximum type safety
- **Absolute imports** with path mapping (@/ aliases)
- **Interface-first approach** for all contracts between layers
- **Zod integration** for runtime type validation at API boundaries

### TypeScript Best Practices

#### ✅ Interface Definitions

```typescript
// Define clear interfaces for all layer boundaries
export interface TodoRepository {
  queries: TodoQueriesRepository;
  mutations: TodoMutationsRepository;
}

// Use descriptive names and proper generics
export interface GatewayOptions {
  signal?: AbortSignal;
}
```

#### ✅ Type Safety

```typescript
// Use union types for controlled values
export type DataSource = 'http' | 'localStorage' | 'mock';

// Leverage utility types
export type UpdateTodoRequest = Partial<Pick<Todo, 'title' | 'completed' | 'priority'>>;
```

## File and Code Naming Conventions

### Files and Directories

We use **kebab-case** for all file and directory names for consistency and readability:

```bash
# ✅ Correct
todo-management.view.tsx
use-todo-business.hook.ts
create-entity-gateway.helper.ts
entity-stats.selector.ts

# ❌ Incorrect
TodoManagement.tsx
useTodoBusiness.ts
createEntityGateway.ts
EntityStats.ts
```

### Code Elements

- **Variables & Functions**: `camelCase`
- **Components**: `PascalCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Types & Interfaces**: `PascalCase`

```typescript
// ✅ Correct naming
const userName = 'john';
const MAX_RETRY_ATTEMPTS = 3;

interface UserRepository {
  findById: (id: string) => Promise<User>;
}

export const TodoManagementView = () => {
  const handleSubmit = useCallback(() => {}, []);
  return <div>{/* ... */}</div>;
};
```

## Architectural Conventions

### Module Structure

Every module must follow the established Clean Architecture pattern:

```bash
src/modules/[module-name]/
├── api/                    # HTTP integration
├── repositories/           # Data access layer
│   └── [entity]/
│       ├── gateways/      # Data source abstraction
│       ├── helpers/       # Business logic utilities
│       └── *.repository.* # Repository implementation
├── selectors/             # State selection hooks
├── stores/               # Local state management
├── views/                # Complete page views
├── components/           # Module-specific components
├── hooks/               # Shared module hooks
├── index.ts             # Public API exports
└── [module].types.ts    # Type definitions
```

### Hook Separation Pattern

**REQUIRED**: Separate business logic from UI control logic:

```typescript
// ✅ Correct - Business hook (data, logic, transformations)
export const useEntityBusiness = (dataSource: DataSource) => {
  const entitiesQuery = entityRepository.queries.useEntities(filters, dataSource);
  const createMutation = entityRepository.mutations.useCreateEntity(dataSource);

  const createEntity = useCallback(
    async (data: CreateEntityRequest) => {
      if (!data.name?.trim()) throw new Error('Name required');
      return createMutation.mutate({ ...data, name: data.name.trim() });
    },
    [createMutation],
  );

  return { entities: entitiesQuery.data, createEntity, isLoading: entitiesQuery.isLoading };
};

// ✅ Correct - Controller hook (UI state, interactions)
export const useEntityController = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateSubmit = useCallback(
    (createEntityFn: (data: CreateEntityRequest) => Promise<void>) => async (data: CreateEntityRequest) => {
      await createEntityFn(data);
      setShowForm(false);
    },
    [],
  );

  return { showForm, handleCreateSubmit, handleCreateClick: () => setShowForm(true) };
};
```

### Repository Pattern Requirements

**REQUIRED**: All data access must go through repositories:

```typescript
// ✅ Correct - Use repository in business hooks
const entitiesQuery = entityRepository.queries.useEntities(filters, dataSource);

// ❌ Incorrect - Direct hook usage bypasses abstraction
const entitiesQuery = useQuery(['entities'], () => entityApi.getAll());
```

### Gateway Pattern Requirements

**REQUIRED**: Support multiple data sources through gateway abstraction:

```typescript
// ✅ Correct - Gateway factory pattern
export const createEntityGateway = (dataSource: DataSource) => {
  switch (dataSource) {
    case 'http':
      return createHttpEntityGateway();
    case 'localStorage':
      return createLocalStorageEntityGateway();
    case 'mock':
      return createMockEntityGateway();
  }
};

// All gateways implement the same interface
export interface EntityGateway extends BaseGateway {
  findAll(filters?: EntityFilters, options?: GatewayOptions): Promise<Entity[]>;
  findById(id: string | number, options?: GatewayOptions): Promise<Entity>;
}
```

## Import Organization

Organize imports in the following order with ESLint enforcement:

```typescript
// 1. External libraries
import React, { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';

// 2. Internal absolute imports (alphabetical by @/ prefix)
import { Button, Typography } from '@/ui';
import { Header } from '@/components';
import { entityRepository } from '@/modules/entity';
import { httpClient } from '@/shared/api/http-client';

// 3. Relative imports (if unavoidable)
import { validateEntityData } from './helpers/validation.helper';
import type { EntityGateway } from '../entity.gateway.types';
```

## Testing Conventions

### Test File Naming

```bash
# Unit tests
component-name.component.test.tsx
hook-name.hook.test.ts
helper-name.helper.test.ts

# Integration tests
gateway-name.gateway.test.ts
repository-name.repository.test.ts
```

### Test Structure

**REQUIRED**: Use the Arrange-Act-Assert (AAA) pattern:

```typescript
describe('ComponentName', () => {
  it('should handle specific behavior', () => {
    // 1. Arrange - Setup data and mocks
    const mockData = createMockEntity({ name: 'Test Entity' });
    const mockHandler = jest.fn();

    // 2. Act - Render/execute the code under test
    renderWithProviders(<EntityForm entity={mockData} onSubmit={mockHandler} />);
    fireEvent.click(screen.getByText('Submit'));

    // 3. Assert - Verify expected behavior
    expect(mockHandler).toHaveBeenCalledWith(mockData);
  });
});
```

### Mock Requirements

- **Use faker factories** for consistent test data
- **Import from `@test/utils`** for all testing utilities
- **Mock at the repository level** for component tests
- **Use gateway mocks** for integration tests

## Error Handling Conventions

### Business Logic Errors

```typescript
// ✅ Correct - Throw descriptive errors in business hooks
export const useEntityBusiness = () => {
  const createEntity = useCallback(
    async (data: CreateEntityRequest) => {
      if (!data.name?.trim()) {
        throw new Error('Entity name is required and cannot be empty');
      }

      if (data.name.length > 100) {
        throw new Error('Entity name must be less than 100 characters');
      }

      return createMutation.mutate(data);
    },
    [createMutation],
  );
};
```

### UI Error Handling

```typescript
// ✅ Correct - Handle errors in controller hooks
export const useEntityController = () => {
  const handleSubmit = useCallback(
    (createEntityFn: (data: CreateEntityRequest) => Promise<void>) => async (data: CreateEntityRequest) => {
      try {
        await createEntityFn(data);
        showToast('Entity created successfully', 'success');
      } catch (error) {
        showToast(`Failed to create entity: ${error.message}`, 'error');
      }
    },
    [],
  );
};
```

## Performance Conventions

### Memoization

```typescript
// ✅ Correct - Memoize expensive calculations
const formattedEntities = useMemo(() => {
  if (!entities) return [];
  return entities.map((entity) => ({
    ...entity,
    displayName: formatEntityName(entity.name),
    priorityColor: getPriorityColor(entity.priority),
  }));
}, [entities]);

// ✅ Correct - Memoize callback functions
const handleSubmit = useCallback(
  async (data: FormData) => {
    await onSubmit(data);
  },
  [onSubmit],
);
```

### React Query Optimization

```typescript
// ✅ Correct - Proper staleTime and gcTime configuration
const entityQuery = entityRepository.queries.useEntity(id, dataSource, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  enabled: !!id, // Conditional execution
});
```

## Code Quality Tools

### ESLint Configuration (JavaScript/TypeScript)

We use **ESLint v9** with flat configuration (`eslint.config.mjs`) and comprehensive rules:

#### Core Rules

- **File naming conventions** - Enforces kebab-case for all files and directories
- **Import organization** - Automatic sorting: external → internal → relative imports
- **React hooks dependencies** - Exhaustive dependency checking for useEffect, useCallback, useMemo
- **TypeScript strict rules** - Prevents `any` usage, enforces explicit return types
- **Architecture patterns** - Prevents direct API imports in components, enforces repository pattern

#### Configuration Structure

```javascript
// eslint.config.mjs - Flat configuration format
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Custom rules for project architecture
  {
    plugins: {
      'check-file': checkFilePlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'check-file/filename-naming-convention': ['error', { '**/*.{ts,tsx,js,jsx}': 'KEBAB_CASE' }],
    },
  },
];
```

### Stylelint Configuration (CSS/SCSS)

We use **Stylelint v16** with professional CSS quality rules (`stylelint.config.js`):

#### Extends and Plugins

- **stylelint-config-standard-scss** - Standard SCSS rules and syntax support
- **stylelint-config-recess-order** - Automatic CSS property ordering (Bootstrap methodology)
- **stylelint-scss** - Advanced SCSS-specific rules and syntax checking
- **stylelint-order** - Property ordering and organization rules

#### Key Quality Rules

```javascript
module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  rules: {
    // CSS quality enforcement
    'no-descending-specificity': true, // Prevent specificity conflicts
    'no-duplicate-selectors': true, // Prevent duplicate CSS selectors

    // Spacing and organization
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],

    // CSS Modules compatibility
    'selector-class-pattern': null, // Allow camelCase class names
  },
};
```

#### File Processing

- **CSS and SCSS files** - Full linting and formatting
- **CSS Modules** (`.module.scss`) - Special handling for camelCase classes
- **Auto-generated files** - Excluded from linting (style-dictionary outputs)

### Prettier Integration

**Prettier** handles general code formatting while **ESLint** and **Stylelint** handle language-specific quality rules:

#### File Type Assignment

- **JavaScript/TypeScript** - ESLint handles both linting and formatting
- **CSS/SCSS** - Prettier formats, Stylelint enforces quality rules
- **JSON/Markdown** - Prettier handles formatting exclusively

#### Configuration Strategy

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": "always"
    }
  }
}
```

### Development Setup

#### Required VSCode Extensions

**Essential for Code Quality:**

- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** - JavaScript/TypeScript linting and formatting
- **[Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)** - CSS/SCSS quality enforcement
- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** - General code formatting

**Development Productivity:**

- **[TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)** - Auto imports with `@/` alias support
- **[Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)** - Inline test execution
- **[SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss)** - Enhanced SCSS support

#### Lint Commands

```bash
# Run all linters (ESLint + Stylelint)
yarn lint

# Auto-fix all issues
yarn lint:fix

# CSS/SCSS only
yarn lint:styles
yarn lint:styles:fix
```

### Branch Naming Validation

Branch names are **automatically validated** to ensure consistency:

```bash
# ✅ Valid branch names (type/description format)
feat/add-user-authentication
fix/resolve-login-bug
docs/update-api-guide
chore/update-dependencies

# ❌ Invalid branch names (will be rejected)
MyFeature                    # Missing type/
feat/Add_User_Auth          # Uppercase/underscores
fix-login-bug               # Missing type/
feat/add user auth          # Spaces not allowed
```

**Validation occurs at:**

- **Pre-push**: Local validation prevents push with invalid names
- **GitHub Actions**: PR validation ensures branch name compliance
- **Manual check**: Run `yarn validate:branch` anytime

### Pre-commit Hooks (Husky)

**NEVER use `--no-verify`** unless explicitly justified. The pre-commit workflow ensures code quality:

```bash
# ✅ Correct - Let Husky validate all changes
git commit -m "feat: add new entity management feature"

# ⚠️ Use only in emergencies with explicit justification
git commit -m "hotfix: critical security patch" --no-verify
```

#### Automated Quality Checks

**Pre-commit hooks** (`lint-staged`) automatically run:

- **ESLint** - Linting and auto-fix for JS/TS files
- **Stylelint** - CSS/SCSS quality enforcement and auto-fix
- **Prettier** - Code formatting for all supported files
- **TypeScript** - Type checking across the project

**Pre-push hooks** ensure build integrity:

- **Jest tests** - All tests must pass
- **Production build** - Verify build succeeds without errors

#### Lint-staged Configuration

```javascript
// lint-staged.config.js
module.exports = {
  '**/*.(js|jsx|ts|tsx)': (filenames) => [`npx eslint --fix ${filenames.join(' ')}`],
  '**/*.(css|scss)': (filenames) => [
    `npx prettier --write ${filenames.join(' ')}`,
    `npx stylelint --fix ${filenames.join(' ')}`,
  ],
};
```

This ensures only modified files are processed, making commits fast while maintaining quality.

## Documentation Requirements

### Code Comments

```typescript
// ✅ Correct - Document complex business logic
/**
 * Calculates entity completion rate considering priority weights
 * High priority todos contribute more to the overall completion rate
 */
const calculateWeightedCompletionRate = (entities: Entity[]) => {
  const weights = { high: 3, medium: 2, low: 1 };
  // Implementation...
};

// ✅ Correct - Document non-obvious decisions
// Using localStorage as fallback when HTTP fails to maintain offline capability
const gateway = httpFailed ? createLocalStorageGateway() : createHttpGateway();
```

### README Updates

When adding new modules or patterns, update:

- **Module exports** in `index.ts`
- **Type definitions** for public APIs
- **Architecture documentation** if patterns change
- **Developer guide** with implementation examples

## Commit Message Convention

Follow **Conventional Commits** specification:

```bash
# Format: type(scope): description
feat(auth): add OAuth2 integration
fix(api): handle timeout errors properly
docs(architecture): update repository pattern guide
test(selectors): add comprehensive selector tests
refactor(gateways): simplify gateway factory pattern
chore(deps): update React Query to v5
```

## Related Documentation

- **[File Naming Conventions](./file-naming-conventions.md)** - Detailed file naming patterns
- **[Module Architecture](./module-architecture.md)** - Architectural principles and patterns
- **[Developer Guide](./developer-guide.md)** - Implementation guidelines and examples
- **[Testing Guide](./testing.md)** - Testing strategies and best practices
