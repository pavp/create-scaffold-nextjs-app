import { createMockTodo, createMockTodos } from '@test/entities/todo.mock';

import type { Todo } from '@/modules/todo/todo.types';

import { getTodosFromStorage } from './get-todos-from-storage.helper';

describe('getTodosFromStorage', () => {
  const TEST_STORAGE_KEY = 'test-todos';

  // Create test todos with consistent timestamps for localStorage testing
  const mockTodos: Todo[] = createMockTodos(2, {
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return empty array when no data exists in localStorage', () => {
    const result = getTodosFromStorage(TEST_STORAGE_KEY);

    expect(result).toEqual([]);
  });

  it('should return empty array when localStorage contains null', () => {
    const result = getTodosFromStorage('non-existent-key');

    expect(result).toEqual([]);
  });

  it('should return parsed todos when valid data exists', () => {
    localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(mockTodos));

    const result = getTodosFromStorage(TEST_STORAGE_KEY);

    expect(result).toEqual(mockTodos);
  });

  it('should return empty array when JSON parsing fails', () => {
    localStorage.setItem(TEST_STORAGE_KEY, 'invalid-json');

    const result = getTodosFromStorage(TEST_STORAGE_KEY);

    expect(result).toEqual([]);
  });

  it('should handle malformed JSON gracefully', () => {
    localStorage.setItem(TEST_STORAGE_KEY, '{"incomplete": json}');

    const result = getTodosFromStorage(TEST_STORAGE_KEY);

    expect(result).toEqual([]);
  });

  it('should handle empty string in localStorage', () => {
    localStorage.setItem(TEST_STORAGE_KEY, '');

    const result = getTodosFromStorage(TEST_STORAGE_KEY);

    expect(result).toEqual([]);
  });

  it('should handle complex todo objects correctly', () => {
    const complexTodos: Todo[] = [
      createMockTodo({
        id: 1,
        title: 'Complex Todo',
        description: 'A todo with all fields',
        priority: 'high',
        completed: false,
        dueDate: '2023-12-31T23:59:59Z',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }),
    ];

    localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(complexTodos));

    const result = getTodosFromStorage(TEST_STORAGE_KEY);

    expect(result).toEqual(complexTodos);
  });

  it('should handle getItem throwing an error', () => {
    const originalGetItem = localStorage.getItem;

    localStorage.getItem = jest.fn(() => {
      throw new Error('localStorage access denied');
    });

    const result = getTodosFromStorage(TEST_STORAGE_KEY);

    expect(result).toEqual([]);
    localStorage.getItem = originalGetItem;
  });
});
