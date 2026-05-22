import { faker } from '@faker-js/faker';

import type { CreateTodoRequest, Todo, TodoFilters, TodoPriority, UpdateTodoRequest } from '@/modules/todo/todo.types';

// === CORE TODO MOCK FACTORIES ===

/**
 * Creates a mock Todo object with faker-generated data
 * @param overrides - Partial Todo object to override default faker values
 * @returns Complete Todo object
 */
export const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  title: faker.lorem.sentence({ min: 2, max: 6 }),
  description: faker.lorem.paragraph({ min: 1, max: 3 }),
  completed: faker.datatype.boolean(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as TodoPriority[]),
  dueDate: faker.date.future().toISOString(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

/**
 * Creates an array of mock Todo objects
 * @param count - Number of todos to create
 * @param baseOverrides - Common overrides to apply to all todos
 * @returns Array of Todo objects
 */
export const createMockTodos = (count: number, baseOverrides: Partial<Todo> = {}): Todo[] =>
  Array.from({ length: count }, (_, index) =>
    createMockTodo({
      id: index + 1, // Ensure unique sequential IDs
      ...baseOverrides,
    }),
  );

// === SPECIALIZED TODO FACTORIES ===

/**
 * Creates a completed todo
 */
export const createCompletedTodo = (overrides: Partial<Todo> = {}): Todo =>
  createMockTodo({
    completed: true,
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  });

/**
 * Creates a pending (incomplete) todo
 */
export const createPendingTodo = (overrides: Partial<Todo> = {}): Todo =>
  createMockTodo({
    completed: false,
    ...overrides,
  });

/**
 * Creates a high priority todo
 */
export const createHighPriorityTodo = (overrides: Partial<Todo> = {}): Todo =>
  createMockTodo({
    priority: 'high',
    ...overrides,
  });

/**
 * Creates a low priority todo
 */
export const createLowPriorityTodo = (overrides: Partial<Todo> = {}): Todo =>
  createMockTodo({
    priority: 'low',
    ...overrides,
  });

/**
 * Creates an overdue todo (dueDate in the past)
 */
export const createOverdueTodo = (overrides: Partial<Todo> = {}): Todo =>
  createMockTodo({
    dueDate: faker.date.past().toISOString(),
    completed: false,
    priority: faker.helpers.arrayElement(['medium', 'high'] as TodoPriority[]),
    ...overrides,
  });

/**
 * Creates a todo without description
 */
export const createMinimalTodo = (overrides: Partial<Todo> = {}): Todo =>
  createMockTodo({
    description: undefined,
    dueDate: undefined,
    ...overrides,
  });

// === REQUEST MOCK FACTORIES ===

/**
 * Creates a mock CreateTodoRequest object
 */
export const createMockCreateTodoRequest = (overrides: Partial<CreateTodoRequest> = {}): CreateTodoRequest => ({
  title: faker.lorem.sentence({ min: 2, max: 4 }),
  description: faker.lorem.paragraph({ min: 1, max: 2 }),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as TodoPriority[]),
  dueDate: faker.date.future().toISOString(),
  completed: faker.datatype.boolean(),
  ...overrides,
});

/**
 * Creates a mock UpdateTodoRequest object
 */
export const createMockUpdateTodoRequest = (overrides: Partial<UpdateTodoRequest> = {}): UpdateTodoRequest => ({
  title: faker.lorem.sentence({ min: 2, max: 4 }),
  description: faker.datatype.boolean() ? faker.lorem.paragraph({ min: 1, max: 2 }) : undefined,
  priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as TodoPriority[]),
  dueDate: faker.datatype.boolean() ? faker.date.future().toISOString() : undefined,
  completed: faker.datatype.boolean(),
  ...overrides,
});

// === FILTERS MOCK FACTORIES ===

/**
 * Creates a mock TodoFilters object
 */
export const createMockTodoFilters = (overrides: Partial<TodoFilters> = {}): TodoFilters => ({
  completed: faker.datatype.boolean(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as TodoPriority[]),
  search: faker.lorem.words({ min: 1, max: 3 }),
  dueBefore: faker.date.future().toISOString(),
  dueAfter: faker.date.past().toISOString(),
  page: faker.number.int({ min: 1, max: 5 }),
  limit: faker.number.int({ min: 10, max: 50 }),
  sortBy: faker.helpers.arrayElement(['title', 'priority', 'createdAt', 'dueDate']),
  sortOrder: faker.helpers.arrayElement(['asc', 'desc'] as const),
  ...overrides,
});

/**
 * Creates empty/minimal filters
 */
export const createEmptyFilters = (): TodoFilters => ({});

/**
 * Creates filters for completed todos only
 */
export const createCompletedFilters = (overrides: Partial<TodoFilters> = {}): TodoFilters =>
  createMockTodoFilters({
    completed: true,
    ...overrides,
  });

/**
 * Creates filters for pending todos only
 */
export const createPendingFilters = (overrides: Partial<TodoFilters> = {}): TodoFilters =>
  createMockTodoFilters({
    completed: false,
    ...overrides,
  });

// === SCENARIO-BASED FACTORIES ===

/**
 * Creates a set of todos for testing statistics
 * Returns: 2 completed, 3 pending, mixed priorities
 */
export const createMockTodosForStats = (): Todo[] => [
  createCompletedTodo({ id: 1, priority: 'high' }),
  createCompletedTodo({ id: 2, priority: 'low' }),
  createPendingTodo({ id: 3, priority: 'high' }),
  createPendingTodo({ id: 4, priority: 'medium' }),
  createPendingTodo({ id: 5, priority: 'low' }),
];

/**
 * Creates todos for testing priority filtering
 * Returns: 2 high, 2 medium, 1 low priority
 */
export const createMockTodosForPriority = (): Todo[] => [
  createHighPriorityTodo({ id: 1 }),
  createHighPriorityTodo({ id: 2 }),
  createMockTodo({ id: 3, priority: 'medium' }),
  createMockTodo({ id: 4, priority: 'medium' }),
  createLowPriorityTodo({ id: 5 }),
];

/**
 * Creates todos for testing date-based functionality
 * Returns: mix of overdue, current, and future todos
 */
export const createMockTodosForDates = (): Todo[] => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // Yesterday
  const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // Tomorrow

  return [
    createOverdueTodo({ id: 1, dueDate: pastDate }),
    createMockTodo({ id: 2, dueDate: futureDate }),
    createMockTodo({ id: 3, dueDate: undefined }), // No due date
  ];
};

// === DETERMINISTIC FACTORIES (FOR CONSISTENT TESTS) ===

/**
 * Creates deterministic todo data for consistent testing
 * Uses fixed seeds to ensure reproducible results
 */
export const createDeterministicTodo = (seed: number, overrides: Partial<Todo> = {}): Todo => {
  faker.seed(seed);
  const todo = createMockTodo(overrides);

  faker.seed(); // Reset seed

  return todo;
};

/**
 * Creates deterministic array of todos
 */
export const createDeterministicTodos = (count: number, baseSeed: number, baseOverrides: Partial<Todo> = {}): Todo[] =>
  Array.from({ length: count }, (_, index) =>
    createDeterministicTodo(baseSeed + index, {
      id: index + 1,
      ...baseOverrides,
    }),
  );
