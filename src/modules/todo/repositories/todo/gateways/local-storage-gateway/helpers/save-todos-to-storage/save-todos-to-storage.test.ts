import type { Todo } from '@/modules/todo/todo.types';

import { saveTodosToStorage } from './save-todos-to-storage.helper';

describe('saveTodosToStorage', () => {
  const TEST_STORAGE_KEY = 'test-todos';
  const mockTodos: Todo[] = [
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

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save todos to localStorage successfully', () => {
    saveTodosToStorage(TEST_STORAGE_KEY, mockTodos);

    const stored = localStorage.getItem(TEST_STORAGE_KEY);

    expect(stored).toBe(JSON.stringify(mockTodos));
  });

  it('should save empty array to localStorage', () => {
    saveTodosToStorage(TEST_STORAGE_KEY, []);

    const stored = localStorage.getItem(TEST_STORAGE_KEY);

    expect(stored).toBe('[]');
  });

  it('should overwrite existing data in localStorage', () => {
    localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify([{ id: 999, title: 'Old Todo' }]));

    saveTodosToStorage(TEST_STORAGE_KEY, mockTodos);

    const stored = localStorage.getItem(TEST_STORAGE_KEY);

    expect(stored).toBe(JSON.stringify(mockTodos));
  });

  it('should handle complex todo objects', () => {
    const complexTodos: Todo[] = [
      {
        id: 1,
        title: 'Complex Todo',
        description: 'A todo with all fields',
        priority: 'high',
        completed: false,
        dueDate: '2023-12-31T23:59:59Z',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ];

    saveTodosToStorage(TEST_STORAGE_KEY, complexTodos);

    const stored = localStorage.getItem(TEST_STORAGE_KEY);

    expect(stored).toBe(JSON.stringify(complexTodos));
  });

  it('should throw error when localStorage fails', () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem;
    const mockSetItem = jest.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    Object.defineProperty(Storage.prototype, 'setItem', {
      value: mockSetItem,
      writable: true,
    });

    expect(() => {
      saveTodosToStorage(TEST_STORAGE_KEY, mockTodos);
    }).toThrow('Failed to save todos to localStorage');

    // Restore original implementation
    Object.defineProperty(Storage.prototype, 'setItem', {
      value: originalSetItem,
      writable: true,
    });
  });

  it('should handle undefined todos gracefully', () => {
    // @ts-expect-error - Testing runtime behavior with invalid input
    expect(() => saveTodosToStorage(TEST_STORAGE_KEY, undefined)).not.toThrow();
  });

  it('should handle storage quota exceeded gracefully', () => {
    // Mock localStorage to simulate quota exceeded
    const originalSetItem = localStorage.setItem;
    const mockSetItem = jest.fn(() => {
      throw new DOMException('QuotaExceededError');
    });

    Object.defineProperty(Storage.prototype, 'setItem', {
      value: mockSetItem,
      writable: true,
    });

    expect(() => {
      saveTodosToStorage(TEST_STORAGE_KEY, mockTodos);
    }).toThrow('Failed to save todos to localStorage');

    Object.defineProperty(Storage.prototype, 'setItem', {
      value: originalSetItem,
      writable: true,
    });
  });

  it('should handle circular reference in todos gracefully', () => {
    // Create object with circular reference
    const circularTodo: any = {
      id: 1,
      title: 'Circular Todo',
      completed: false,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    circularTodo.self = circularTodo;

    expect(() => {
      saveTodosToStorage(TEST_STORAGE_KEY, [circularTodo]);
    }).toThrow('Failed to save todos to localStorage');
  });
});
