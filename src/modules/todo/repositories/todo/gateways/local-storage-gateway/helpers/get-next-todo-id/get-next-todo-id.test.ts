import type { Todo } from '@/modules/todo/todo.types';

import { getNextId } from '../../../../helpers/id-generator/id-generator.helper';
import { getTodosFromStorage } from '../get-todos-from-storage/get-todos-from-storage.helper';

import { getNextTodoId } from './get-next-todo-id.helper';

// Mock dependencies
jest.mock('../../../../helpers/id-generator/id-generator.helper');
jest.mock('../get-todos-from-storage/get-todos-from-storage.helper');

const mockedGetNextId = getNextId as jest.MockedFunction<typeof getNextId>;
const mockedGetTodosFromStorage = getTodosFromStorage as jest.MockedFunction<typeof getTodosFromStorage>;

describe('getNextTodoId', () => {
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
    jest.clearAllMocks();
  });

  it('should get next ID for empty storage', () => {
    mockedGetTodosFromStorage.mockReturnValue([]);
    mockedGetNextId.mockReturnValue(1);

    const result = getNextTodoId(TEST_STORAGE_KEY);

    expect(mockedGetTodosFromStorage).toHaveBeenCalledWith(TEST_STORAGE_KEY);
    expect(mockedGetNextId).toHaveBeenCalledWith([]);
    expect(result).toBe(1);
  });

  it('should get next ID for existing todos', () => {
    mockedGetTodosFromStorage.mockReturnValue(mockTodos);
    mockedGetNextId.mockReturnValue(3);

    const result = getNextTodoId(TEST_STORAGE_KEY);

    expect(mockedGetTodosFromStorage).toHaveBeenCalledWith(TEST_STORAGE_KEY);
    expect(mockedGetNextId).toHaveBeenCalledWith(mockTodos);
    expect(result).toBe(3);
  });

  it('should handle corrupted storage when getting next ID', () => {
    mockedGetTodosFromStorage.mockReturnValue([]);
    mockedGetNextId.mockReturnValue(1);

    const result = getNextTodoId(TEST_STORAGE_KEY);

    expect(mockedGetTodosFromStorage).toHaveBeenCalledWith(TEST_STORAGE_KEY);
    expect(mockedGetNextId).toHaveBeenCalledWith([]);
    expect(result).toBe(1);
  });

  it('should work with non-sequential IDs', () => {
    const nonSequentialTodos: Todo[] = [
      {
        id: 5,
        title: 'Todo 5',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      {
        id: 10,
        title: 'Todo 10',
        completed: true,
        priority: 'high',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      {
        id: 3,
        title: 'Todo 3',
        completed: false,
        priority: 'low',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ];

    mockedGetTodosFromStorage.mockReturnValue(nonSequentialTodos);
    mockedGetNextId.mockReturnValue(11);

    const result = getNextTodoId(TEST_STORAGE_KEY);

    expect(mockedGetTodosFromStorage).toHaveBeenCalledWith(TEST_STORAGE_KEY);
    expect(mockedGetNextId).toHaveBeenCalledWith(nonSequentialTodos);
    expect(result).toBe(11);
  });
});
