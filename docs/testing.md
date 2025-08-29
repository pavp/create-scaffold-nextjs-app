# Testing Guide

This project uses **Jest** with **V8 coverage** and **React Testing Library** for comprehensive testing.

## Quick Start

### Running Tests

```bash
# Run all tests
npm test
# or
yarn test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test src/components/button/button.test.tsx
```

### Writing Tests

Create test files alongside your components with `.test.ts` or `.test.tsx` extension:

```typescript
// src/components/Hello.test.tsx
import React from 'react';
import { renderWithProviders, screen } from '@test/utils';
import Hello from './Hello';

it('should render Hello component', () => {
  // 1. Arrange - Setup
  const expectedText = 'Hello, World!';

  // 2. Act - Render with all providers
  renderWithProviders(<Hello />);

  // 3. Assert - Verify
  expect(screen.getByText(expectedText)).toBeInTheDocument();
});
```

### Import Rules

**IMPORTANT**: Always import testing utilities from the centralized location:

```typescript
// ✅ Correct - Use centralized test utils
import { renderWithProviders, screen, fireEvent, waitFor } from '@test/utils';

// ❌ Incorrect - Direct imports are restricted by ESLint
import { render, screen } from '@testing-library/react';
```

The project has ESLint rules that restrict direct imports from `@testing-library/react`. All testing utilities should be imported from `@test/utils` to ensure consistency and proper provider setup.

## Configuration

The project uses Jest with V8 coverage provider for better performance:

```typescript
// jest.config.ts
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

## Test Structure Best Practices

Follow the **Arrange-Act-Assert** (AAA) pattern:

```typescript
import { renderWithProviders, screen, fireEvent } from '@test/utils';

describe('ComponentName', () => {
  it('should handle user interaction', () => {
    // 1. Arrange - Variables and constants
    const mockHandler = jest.fn();
    const buttonText = 'Click me';

    // 2. Act - Render with providers and interact
    renderWithProviders(<Button onClick={mockHandler}>{buttonText}</Button>);
    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);

    // 3. Assert - Verify behavior
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

## Coverage Reports

### HTML Report

- **Location**: `coverage/lcov-report/index.html`
- **Access**: Open the file in your browser to see interactive coverage details

### Console Output

The console shows a summary with coverage percentages for statements, branches, functions, and lines.

## Coverage Ignore Patterns

### In Code Comments

Use `c8` comments to ignore specific lines or blocks:

```javascript
// Ignore next line
/* c8 ignore next */
const unreachableCode = () => {};

// Ignore block
/* c8 ignore start */
function debugOnly() {
  console.log('Debug mode');
}
/* c8 ignore stop */
```

### In Configuration

Ignore entire files or directories from coverage:

```typescript
// jest.config.ts
const config: Config = {
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/src/types/', // Ignore type definition files
    '*.d.ts', // Ignore TypeScript declaration files
    '/src/constants/', // Ignore constants files
  ],
};
```

## Advanced Configuration

### Module Name Mapping

Configure path aliases for testing:

```typescript
moduleNameMapper: {
  '^@/(.*)': '<rootDir>/src/$1',
  '^@/components/(.*)$': '<rootDir>/components/$1',
  '@next/font/(.*)': '<rootDir>/test/__mocks__/nextFontMock.js',
  'server-only': '<rootDir>/test/__mocks__/empty.js',
},
```

## Troubleshooting

### Common Issues

1. **"Coverage threshold not met"**
   - Add more tests to reach the required coverage
   - Use `/* c8 ignore */` for legitimate uncoverable code
   - Review `coverageThreshold` settings

2. **Slow test execution**
   - V8 coverage is faster than Babel
   - Consider using `--maxWorkers=50%` for parallel execution
   - Use `--testPathIgnorePatterns` to exclude unnecessary files

3. **Module resolution errors**
   - Check `moduleNameMapper` in jest.config.ts
   - Ensure all aliases are properly configured
   - Verify mock files exist in `test/__mocks__/`

### Performance Tips

- Use `--coverage=false` during development
- Run specific test suites with `--testPathPattern`
- Utilize `--changedSince` for testing only modified files
- Consider `--watchAll=false` in automated environments

This ensures consistent test execution while maintaining high code quality standards.

# Testing Utilities

The project uses a modular testing utilities system that supports **Zustand** for state management, **React Query** for data fetching, **MUI** for theming, and **Next-Intl** for internationalization. This system provides a convenient way to render components and hooks with all necessary providers, ensuring tests run in an environment that closely mimics the actual application setup.

## Architecture Overview

The testing utilities are organized in a modular structure:

```
test/utils/
├── index.ts              # Main entry point
├── providers/           # React providers (Theme, Query, Localization)
├── zustand/            # Zustand testing utilities and store factories
├── render/             # Render functions and React Query utilities
└── test-utils.types.ts # TypeScript type definitions
```

## Key Functions

### 1. Render Functions

#### `renderWithProviders(component, options)`

Renders a React component with all necessary providers (QueryClient, Theme, Localization):

```typescript
import { renderWithProviders, screen } from '@test/utils';
import MyComponent from './MyComponent';

test('should render component with providers', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

#### `renderHookWithProviders(hook, options)`

Renders a React hook with all necessary providers:

```typescript
import { renderHookWithProviders } from '@test/utils';
import { useMyHook } from './useMyHook';

test('should render hook with providers', () => {
  const { result } = renderHookWithProviders(() => useMyHook());
  expect(result.current.value).toBe('initial');
});
```

### 2. React Query Utilities

#### `createTestQueryClient(options)`

Creates an isolated QueryClient for testing:

```typescript
const queryClient = createTestQueryClient({
  retry: false,
  gcTime: 0,
  staleTime: 0,
});
```

#### `setupMockQueryData(queryClient, queryKey, data)`

Sets up mock data in the QueryClient cache:

```typescript
const { queryClient } = renderWithProviders(<UserProfile userId="1" />);
setupMockQueryData(queryClient, ['user', '1'], mockUserData);
```

### 3. Zustand Utilities

#### `mockZustandStore(store, state)`

Configures mock state in a specific Zustand store:

```typescript
import { mockZustandStore, setupTodoStoreState } from '@test/utils';

beforeEach(() => {
  mockZustandStore(
    useTodoStore,
    setupTodoStoreState({
      selectedTodo: { id: '1', title: 'Test Todo' },
    }),
  );
});
```

#### Store Factory Functions

- `setupTodoStoreState(overrides)` - Creates initial state for todo store
- `setupToastStoreState(overrides)` - Creates initial state for toast store

## Usage Examples

### 1. Basic Component Testing with React Query

```typescript
import { renderWithProviders, setupMockQueryData, screen } from '@test/utils';
import UserProfile from './UserProfile';

test('should display user data from React Query', async () => {
  const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };

  const { queryClient } = renderWithProviders(<UserProfile userId="1" />, {
    queryClientOptions: {
      retry: false,
      staleTime: 0
    }
  });

  setupMockQueryData(queryClient, ['user', '1'], mockUser);

  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});
```

### 2. Testing with Initial Zustand Store State

```typescript
import { renderWithProviders, setupTodoStoreState, screen } from '@test/utils';
import TodoList from './TodoList';

test('should show filtered todos based on store state', () => {
  renderWithProviders(<TodoList />, {
    initialStoreStates: {
      todo: setupTodoStoreState({
        filters: { completed: false, priority: 'high' },
        selectedTodo: { id: '1', title: 'Important Task', completed: false }
      })
    }
  });

  expect(screen.getByText('Important Task')).toBeInTheDocument();
});
```

### 3. Testing with Both Zustand and React Query

```typescript
import {
  renderWithProviders,
  setupTodoStoreState,
  setupMockQueryData,
  screen
} from '@test/utils';
import TodoManagement from './TodoManagement';

test('should handle todo management with both stores and queries', async () => {
  const mockTodos = [
    { id: '1', title: 'Buy groceries', completed: false },
    { id: '2', title: 'Walk the dog', completed: true }
  ];

  const { queryClient } = renderWithProviders(<TodoManagement />, {
    queryClientOptions: { retry: false },
    initialStoreStates: {
      todo: setupTodoStoreState({
        filters: { completed: false }
      })
    }
  });

  setupMockQueryData(queryClient, ['todos'], mockTodos);

  expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  expect(screen.queryByText('Walk the dog')).not.toBeInTheDocument();
});
```

### 4. Hook Testing with Providers

```typescript
import { renderHookWithProviders, setupTodoStoreState, act } from '@test/utils';
import { useTodoManagement } from './useTodoManagement';

test('should handle todo business logic', async () => {
  const { result } = renderHookWithProviders(() => useTodoManagement('http'), {
    queryClientOptions: { retry: false },
    initialStoreStates: {
      todo: setupTodoStoreState({
        filters: { priority: 'high' },
      }),
    },
  });

  expect(result.current.filters).toEqual({ priority: 'high' });

  act(() => {
    result.current.applyFilters({ completed: true });
  });

  expect(result.current.filters).toEqual({
    priority: 'high',
    completed: true,
  });
});
```

### 5. Testing React Query Mutations

```typescript
import { renderHookWithProviders, waitFor, act } from '@test/utils';
import { useCreateTodoMutation } from './useCreateTodoMutation';

// Mock the API
jest.mock('../api/todoApi');

test('should create todo via mutation', async () => {
  const mockCreatedTodo = { id: '3', title: 'New Task', completed: false };

  jest.mocked(todoApi.createTodo).mockResolvedValue(mockCreatedTodo);

  const { result } = renderHookWithProviders(() => useCreateTodoMutation(), {
    queryClientOptions: { retry: false },
  });

  act(() => {
    result.current.mutate({ title: 'New Task' });
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual(mockCreatedTodo);
});
```

### 6. Testing Toast Notifications

```typescript
import { renderWithProviders, setupToastStoreState, screen } from '@test/utils';
import AppLayout from './AppLayout';

test('should display toast notification', () => {
  renderWithProviders(<AppLayout />, {
    initialStoreStates: {
      toast: setupToastStoreState({
        snackbarOpen: true,
        snackbarMessage: 'Operation completed successfully',
        severity: 'SUCCESS'
      })
    }
  });

  expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
});
```

### 7. Testing Complex Interactions

```typescript
import {
  renderWithProviders,
  setupTodoStoreState,
  screen,
  fireEvent,
  waitFor
} from '@test/utils';
import TodoForm from './TodoForm';

test('should create todo and update store state', async () => {
  renderWithProviders(<TodoForm />, {
    queryClientOptions: { retry: false },
    initialStoreStates: {
      todo: setupTodoStoreState({
        isCreating: false
      })
    }
  });

  const titleInput = screen.getByLabelText('Todo Title');
  fireEvent.change(titleInput, { target: { value: 'New Important Task' } });

  const submitButton = screen.getByText('Create Todo');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText('Creating...')).toBeInTheDocument();
  });
});
```

## Configuration Options

### Extended Render Options

```typescript
interface ExtendedRenderOptions {
  // React Query options
  queryClient?: QueryClient;
  queryClientOptions?: {
    retry?: boolean;
    gcTime?: number;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  };

  // Initial Zustand store states
  initialStoreStates?: {
    todo?: Partial<TodoStoreState>;
    toast?: Partial<ToastStoreState>;
  };

  // All normal React Testing Library options
  ...RenderOptions
}
```

## Available Utilities

### Render Functions

- `renderWithProviders(component, options)` - Renders component with all providers
- `renderHookWithProviders(hook, options)` - Renders hook with all providers

### React Query Utilities

- `createTestQueryClient(options)` - Creates a QueryClient for testing
- `setupMockQueryData(queryClient, queryKey, data)` - Sets up mock data in cache
- `clearAllQueries(queryClient)` - Clears all queries from cache
- `waitForQueriesToSettle(queryClient)` - Waits for all queries to settle

### Zustand Utilities

- `mockZustandStore(store, state)` - Sets up mock state in specific store
- `resetZustandStores()` - Resets all stores (done automatically)
- `setupTodoStoreState(overrides)` - Factory for todo store initial state
- `setupToastStoreState(overrides)` - Factory for toast store initial state

## Best Practices

1. **Always use `queryClientOptions: { retry: false }`** in tests to avoid timeouts
2. **Store resets are automatic** between tests, but can be done manually if needed
3. **Mock APIs** before rendering components that use them
4. **Use factory functions** (`setupTodoStoreState`, etc.) for consistency
5. **Test both state and UI** - verify store state and what gets rendered
6. **Use `waitFor`** when expecting asynchronous changes
7. **Clear mocks** between tests with `jest.clearAllMocks()` or similar
8. **Import from `@test/utils`** - this provides all utilities from the modular structure

## Setup

The Zustand mock is automatically configured in `test/__mocks__/zustand.ts`. Store resets happen automatically after each test. No additional setup is required beyond importing from `@test/utils`.

This modular testing utilities system allows you to write more robust and maintainable tests for applications using Zustand and React Query.

# Mock Entities with Faker

The project uses **faker-based mock factories** for generating consistent, realistic test data. This centralized approach eliminates duplication and improves test maintainability.

## Overview

Mock entities are located in `test/entities/` and provide factories for generating test data with `@faker-js/faker`. Each entity type has specialized factories for common testing scenarios.

### Benefits

✅ **Consistency** - All tests use the same data structure  
✅ **Maintainability** - Single source of truth for mock data  
✅ **Variety** - Dynamic data improves test coverage  
✅ **Type Safety** - Factories ensure compliance with type changes  
✅ **Reusability** - Specialized factories for common scenarios

## Todo Mock Factories

### Basic Usage

```typescript
import { createMockTodo, createMockTodos, createMockTodosForStats } from '@test/entities/todo.mock';

// Create a single todo with faker-generated data
const todo = createMockTodo();

// Create a todo with specific overrides
const highPriorityTodo = createMockTodo({
  priority: 'high',
  completed: false,
});

// Create multiple todos
const todos = createMockTodos(5); // 5 todos with sequential IDs

// Use specialized factories for specific test scenarios
const statsData = createMockTodosForStats(); // Pre-configured for statistics testing
```

### Available Factories

#### Core Factories

- `createMockTodo(overrides?)` - Creates a single todo with faker data
- `createMockTodos(count, baseOverrides?)` - Creates multiple todos with sequential IDs

#### Specialized Factories

- `createCompletedTodo(overrides?)` - Always completed todo
- `createPendingTodo(overrides?)` - Always incomplete todo
- `createHighPriorityTodo(overrides?)` - High priority todo
- `createLowPriorityTodo(overrides?)` - Low priority todo
- `createOverdueTodo(overrides?)` - Todo with past due date
- `createMinimalTodo(overrides?)` - Todo without description or due date

#### Request Factories

- `createMockCreateTodoRequest(overrides?)` - For create API calls
- `createMockUpdateTodoRequest(overrides?)` - For update API calls
- `createMockTodoFilters(overrides?)` - For filtering operations
- `createEmptyFilters()` - Empty filter object
- `createCompletedFilters(overrides?)` - Filters for completed todos only
- `createPendingFilters(overrides?)` - Filters for pending todos only

#### Scenario Factories

- `createMockTodosForStats()` - 2 completed, 3 pending, mixed priorities (perfect for statistics testing)
- `createMockTodosForPriority()` - Even distribution across priorities
- `createMockTodosForDates()` - Mix of overdue, current, and future due dates

#### Deterministic Factories (for reproducible tests)

- `createDeterministicTodo(seed, overrides?)` - Uses faker seed for consistent data
- `createDeterministicTodos(count, baseSeed, overrides?)` - Array of deterministic todos

## Migration Examples

### Before (Hardcoded Data)

```typescript
// ❌ Before: Repetitive hardcoded mock data
const mockTodos = [
  {
    id: 1,
    title: 'Test Todo 1',
    completed: false,
    priority: 'medium',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Test Todo 2',
    completed: true,
    priority: 'high',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

const mockFilters = {
  completed: false,
  priority: 'high',
  search: 'test search',
};
```

### After (Faker Factories)

```typescript
// ✅ After: Clean, maintainable faker factories
import { createMockTodos, createMockTodoFilters } from '@test/entities/todo.mock';

const mockTodos = createMockTodos(2, {
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
});

const mockFilters = createMockTodoFilters({
  completed: false,
  priority: 'high',
  search: 'test search',
});
```

## Real Usage Examples

### 1. Store Testing

```typescript
import { createMockTodo, createMockTodoFilters } from '@test/entities/todo.mock';
import { useTodoStore } from './todo.store';

describe('Todo Store', () => {
  let mockTodo: Todo;
  let mockFilters: TodoFilters;

  beforeAll(() => {
    mockTodo = createMockTodo({
      id: 1,
      title: 'Test Todo',
      completed: false,
    });
    mockFilters = createMockTodoFilters({
      completed: false,
      priority: 'high',
    });
  });

  it('should set selected todo', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.actions.setSelectedTodo(mockTodo);
    });

    expect(result.current.selectedTodo).toEqual(mockTodo);
  });
});
```

### 2. Statistics Testing

```typescript
import { createMockTodosForStats } from '@test/entities/todo.mock';
import { useTodoStatsSelector } from './use-todo-stats-selector.hook';

describe('useTodoStatsSelector', () => {
  it('should calculate correct statistics', async () => {
    // Creates predictable data: 2 completed, 3 pending, mixed priorities
    const mockTodos = createMockTodosForStats();

    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'));

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toEqual({
        total: 5,
        completed: 2,
        pending: 3,
        highPriority: 2,
        mediumPriority: 1,
        lowPriority: 2,
        completionRate: 40, // 2/5 * 100 = 40%
      });
    });
  });
});
```

### 3. API Testing

```typescript
import { createMockTodos, createMockTodoFilters, createMockCreateTodoRequest } from '@test/entities/todo.mock';
import { todoApi } from './todo-api';

describe('TodoApi', () => {
  let mockTodos: Todo[];
  let mockFilters: TodoFilters;
  let mockCreateRequest: CreateTodoRequest;

  beforeAll(() => {
    mockTodos = createMockTodos(2);
    mockFilters = createMockTodoFilters({ priority: 'high' });
    mockCreateRequest = createMockCreateTodoRequest({
      title: 'New Todo',
      priority: 'high',
    });
  });

  it('should fetch todos with filters', async () => {
    mockedHttpClient.get.mockResolvedValue({ data: mockTodos });

    const result = await todoApi.getAll(mockFilters);

    expect(result).toEqual(mockTodos);
    expect(mockedHttpClient.get).toHaveBeenCalledWith(Endpoints.TODO.BASE, { params: mockFilters });
  });
});
```

### 4. Component Testing

```typescript
import { createCompletedTodo, createPendingTodo } from '@test/entities/todo.mock';
import { TodoItem } from './TodoItem';

describe('TodoItem', () => {
  it('should render completed todo correctly', () => {
    const completedTodo = createCompletedTodo({ title: 'Completed Task' });

    renderWithProviders(<TodoItem todo={completedTodo} />);

    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should render pending todo correctly', () => {
    const pendingTodo = createPendingTodo({
      title: 'Pending Task',
      priority: 'high'
    });

    renderWithProviders(<TodoItem todo={pendingTodo} />);

    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByText('high')).toBeInTheDocument();
  });
});
```

### 5. Deterministic Testing

```typescript
import { createDeterministicTodos } from '@test/entities/todo.mock';

describe('Todo Sorting', () => {
  it('should sort todos by priority consistently', () => {
    // Always generates the same data for consistent testing
    const todos = createDeterministicTodos(3, 12345, {
      completed: false,
    });

    const sortedTodos = sortTodosByPriority(todos);

    // Test will always pass with the same sorted order
    expect(sortedTodos[0].priority).toBe('high');
  });
});
```

## Migration Guidelines

### When to Use Faker Factories

✅ **Use factories when:**

- Mock data is repeated across multiple tests
- You need realistic, varied test data
- Testing data processing or calculations
- You want to catch edge cases with dynamic data

❌ **Keep hardcoded when:**

- Testing specific edge cases requiring exact values
- Test logic depends on precise data relationships
- Mock data is used only once and very simple

### Migration Process

1. **Identify repetitive mock data** in test files
2. **Replace hardcoded objects** with factory calls
3. **Use specialized factories** for common scenarios
4. **Add overrides** for test-specific requirements
5. **Use deterministic factories** when reproducibility is crucial

### Performance Considerations

- Factories have minimal overhead (faker is fast)
- Consider using `beforeAll()` for expensive mock generation
- Use deterministic factories for tests requiring exact reproducibility
- Cache reusable mock data in test suites when appropriate

## Extending Mock Entities

### Adding New Entity Types

Create new mock files following the same pattern:

```typescript
// test/entities/user.mock.ts
import { faker } from '@faker-js/faker';
import type { User } from '@/types';

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['admin', 'user']),
  createdAt: faker.date.past().toISOString(),
  ...overrides,
});
```

### Extending Todo Factories

Add new specialized factories as needed:

```typescript
// In todo.mock.ts
export const createUrgentTodo = (overrides: Partial<Todo> = {}): Todo =>
  createMockTodo({
    priority: 'high',
    dueDate: faker.date.soon().toISOString(), // Due soon
    completed: false,
    ...overrides,
  });
```

This faker-based approach provides a robust foundation for maintainable, consistent testing across the entire application.
