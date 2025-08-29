import { createMockTodo } from '@test/entities/todo.mock';

import type { Todo } from '@/modules/todo/todo.types';

import { applyFiltersToTodos } from './filter-todos.helper';

describe('applyFiltersToTodos', () => {
  // Create specific test data for comprehensive filtering tests
  const mockTodos: Todo[] = [
    createMockTodo({
      id: 1,
      title: 'Buy groceries',
      description: 'Milk, eggs, bread',
      completed: false,
      priority: 'medium',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    }),
    createMockTodo({
      id: 2,
      title: 'Walk the dog',
      description: 'Take Rex to the park',
      completed: true,
      priority: 'low',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    }),
    createMockTodo({
      id: 3,
      title: 'Finish project',
      description: 'Complete the final report',
      completed: false,
      priority: 'high',
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z',
    }),
  ];

  it('should return all todos when no filters provided', () => {
    const result = applyFiltersToTodos(mockTodos);

    expect(result).toHaveLength(3);
    expect(result).toEqual(mockTodos);
  });

  it('should filter by search term in title', () => {
    const result = applyFiltersToTodos(mockTodos, { search: 'groceries' });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Buy groceries');
  });

  it('should filter by search term in description', () => {
    const result = applyFiltersToTodos(mockTodos, { search: 'park' });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Walk the dog');
  });

  it('should filter by completed status', () => {
    const completedTodos = applyFiltersToTodos(mockTodos, { completed: true });
    const pendingTodos = applyFiltersToTodos(mockTodos, { completed: false });

    expect(completedTodos).toHaveLength(1);
    expect(completedTodos[0].title).toBe('Walk the dog');

    expect(pendingTodos).toHaveLength(2);
    expect(pendingTodos.map((t) => t.title)).toEqual(['Buy groceries', 'Finish project']);
  });

  it('should filter by priority', () => {
    const highPriorityTodos = applyFiltersToTodos(mockTodos, { priority: 'high' });

    expect(highPriorityTodos).toHaveLength(1);
    expect(highPriorityTodos[0].title).toBe('Finish project');
  });

  it('should sort by title ascending', () => {
    const result = applyFiltersToTodos(mockTodos, {
      sortBy: 'title',
      sortOrder: 'asc',
    });

    expect(result[0].title).toBe('Buy groceries');
    expect(result[1].title).toBe('Finish project');
    expect(result[2].title).toBe('Walk the dog');
  });

  it('should sort by title descending', () => {
    const result = applyFiltersToTodos(mockTodos, {
      sortBy: 'title',
      sortOrder: 'desc',
    });

    expect(result[0].title).toBe('Walk the dog');
    expect(result[1].title).toBe('Finish project');
    expect(result[2].title).toBe('Buy groceries');
  });

  it('should combine multiple filters', () => {
    const result = applyFiltersToTodos(mockTodos, {
      completed: false,
      priority: 'medium',
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Buy groceries');
  });
});
