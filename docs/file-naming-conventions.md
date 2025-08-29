# File Naming Conventions

This document outlines the file naming conventions used throughout the project to ensure consistency, clarity, and maintainability.

## Overview

We use **descriptive suffixes** to clearly identify the purpose of each file type. This makes it easier to:

- Understand file purpose at a glance
- Navigate large codebases efficiently
- Maintain consistency across the team
- Enable better IDE/editor support

## Naming Patterns

### Components

**Pattern**: `component-name.component.tsx`

```
src/components/
├── button/button.component.tsx
├── modal/modal.component.tsx
└── form-input/form-input.component.tsx
```

**Example**:

```typescript
// ✅ Good
export const Button = () => {
  /* ... */
};

// File: button/button.component.tsx
```

### Views

**Pattern**: `view-name.view.tsx`

```
src/views/
├── todo-management/todo-management.view.tsx
├── user-profile/user-profile.view.tsx
└── dashboard/dashboard.view.tsx
```

**Purpose**: Full page views or major application screens

### Hooks

**Pattern**: `hook-name.hook.ts`

```
src/hooks/
├── use-data-source.hook.ts
├── use-api-client.hook.ts
└── use-todo-management-business.hook.ts
```

**Includes**:

- Custom React hooks (`use*`)
- Selector hooks
- Business logic hooks
- UI controller hooks

### Helpers/Utils

**Pattern**: `helper-name.helper.ts`

```
src/helpers/
├── date-format.helper.ts
├── validation.helper.ts
└── query-params.helper.ts
```

**Purpose**: Pure utility functions without React dependencies

### Stores

**Pattern**: `store-name.store.ts`

```
src/stores/
├── todo.store.ts
├── user.store.ts
└── settings.store.ts
```

**Purpose**: State management files (Zustand stores and actions)

### Types

**Pattern**: `types-name.types.ts`

```
src/types/
├── api.types.ts
├── user.types.ts
└── todo.types.ts
```

**Purpose**: TypeScript type definitions and interfaces

## Directory Structure Example

```
src/modules/todo/
├── components/
│   ├── todo-form/todo-form.component.tsx
│   ├── todo-list/todo-list.component.tsx
│   └── todo-item/todo-item.component.tsx
├── views/
│   └── todo-management/todo-management.view.tsx
├── hooks/
│   ├── use-data-source.hook.ts
│   └── use-todo-business.hook.ts
├── helpers/
│   ├── validation.helper.ts
│   ├── date-format.helper.ts
│   └── filter-todos.helper.ts
├── stores/
│   └── todo.store.ts
├── types/
│   └── todo.types.ts
└── selectors/
    ├── use-completed-todos-selector.hook.ts
    └── use-filters-selector.hook.ts
```

## Benefits

### 1. **Immediate Recognition**

- `*.component.tsx` = React component
- `*.view.tsx` = Page/screen view
- `*.hook.ts` = React hook
- `*.helper.ts` = Pure utility function
- `*.store.ts` = State management

### 2. **Better IDE Support**

- File type filtering in search
- Quick navigation by file type
- Better autocomplete suggestions

### 3. **Consistency**

- Team members instantly understand file purposes
- New developers can navigate codebase easily
- Reduces cognitive load when working with files

### 4. **Scalability**

- Works well with large codebases
- Clear separation of concerns
- Easy to refactor and reorganize

## Import Examples

```typescript
// Components
import { TodoForm } from './components/todo-form/todo-form.component';
import { TodoList } from './components/todo-list/todo-list.component';

// Views
import { TodoManagement } from './views/todo-management/todo-management.view';

// Hooks
import { useDataSource } from './hooks/use-data-source.hook';
import { useTodoBusinessLogic } from './hooks/use-todo-business.hook';

// Helpers
import { validateTodoData } from './helpers/validation.helper';
import { formatRelativeDate } from './helpers/date-format.helper';

// Stores
import { useTodoStore } from './stores/todo.store';

// Types
import type { Todo, TodoFilters } from './types/todo.types';
```

## Index Files

Each directory should have an `index.ts` file that exports the main items:

```typescript
// components/index.ts
export { TodoForm } from './todo-form/todo-form.component';
export { TodoList } from './todo-list/todo-list.component';

// hooks/index.ts
export { useDataSource } from './use-data-source.hook';

// helpers/index.ts
export { validateTodoData } from './validation.helper';
export { formatDate } from './date-format.helper';
```

This allows for clean imports:

```typescript
import { TodoForm, TodoList } from '@/components';
import { useDataSource } from '@/hooks';
import { validateTodoData } from '@/helpers';
```

## Rules and Guidelines

### ✅ Do's

- Always use the appropriate suffix
- Use kebab-case for file names
- Keep names descriptive but concise
- Group related files in directories
- Include index.ts files for clean exports

### ❌ Don'ts

- Don't mix naming conventions
- Don't use generic names like `utils.ts`
- Don't skip the suffix (e.g., `button.tsx` instead of `button.component.tsx`)
- Don't create deep nested structures without purpose

## Migration Guide

When renaming existing files:

1. **Rename the file** with proper suffix
2. **Update imports** in index files
3. **Search and replace** any direct imports
4. **Test** that all imports still work
5. **Update** any related documentation

## Exceptions

The only files that don't follow this pattern are:

- `index.ts` - Entry point files
- `package.json` - Node.js configuration
- Framework-specific files (e.g., `layout.tsx`, `page.tsx` in Next.js)
- Configuration files (e.g., `tailwind.config.js`)

---

**Note**: This convention helps maintain a clean, scalable, and easily navigable codebase. Consistency is key to its success.
