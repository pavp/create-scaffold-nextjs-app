import type { CreateTodoRequest, Todo, UpdateTodoRequest } from '@/modules/todo/todo.types';

import { createHttpTodoGateway } from './http-gateway';

// Mock dependencies
jest.mock('@/modules/todo/api/todo-api', () => ({
  todoApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    testError: jest.fn(),
    testZodRequestError: jest.fn(),
  },
}));

jest.mock('../../helpers/validation/validation.helper', () => ({
  validateTodoData: jest.fn(),
}));

// Import the mocked modules after mocking
const { todoApi } = jest.requireMock('@/modules/todo/api/todo-api');
const { validateTodoData } = jest.requireMock('../../helpers/validation/validation.helper');

const mockedTodoApi = todoApi as jest.Mocked<typeof todoApi>;
const mockedValidateTodoData = validateTodoData as jest.MockedFunction<typeof validateTodoData>;

describe('HTTP Todo Gateway', () => {
  let gateway: ReturnType<typeof createHttpTodoGateway>;

  beforeEach(() => {
    jest.clearAllMocks();
    gateway = createHttpTodoGateway();
  });

  describe('findAll', () => {
    it('should get all todos without filters', async () => {
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
          priority: 'low',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      mockedTodoApi.getAll.mockResolvedValue(mockTodos);

      const result = await gateway.findAll();

      expect(mockedTodoApi.getAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(mockTodos);
    });

    it('should get all todos with filters', async () => {
      const filters = { completed: true, priority: 'high' as const };
      const mockTodos: Todo[] = [
        {
          id: 1,
          title: 'High Priority Todo',
          completed: true,
          priority: 'high',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      mockedTodoApi.getAll.mockResolvedValue(mockTodos);

      const result = await gateway.findAll(filters);

      expect(mockedTodoApi.getAll).toHaveBeenCalledWith(filters, undefined);
      expect(result).toEqual(mockTodos);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');

      mockedTodoApi.getAll.mockRejectedValue(error);

      await expect(gateway.findAll()).rejects.toThrow('API Error');
    });
  });

  describe('findById', () => {
    it('should get todo by string id', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedTodoApi.getById.mockResolvedValue(mockTodo);

      const result = await gateway.findById('1');

      expect(mockedTodoApi.getById).toHaveBeenCalledWith('1', undefined);
      expect(result).toEqual(mockTodo);
    });

    it('should get todo by number id', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        completed: false,
        priority: 'high',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedTodoApi.getById.mockResolvedValue(mockTodo);

      const result = await gateway.findById(1);

      expect(mockedTodoApi.getById).toHaveBeenCalledWith(1, undefined);
      expect(result).toEqual(mockTodo);
    });

    it('should handle not found errors', async () => {
      const error = new Error('Todo not found');

      mockedTodoApi.getById.mockRejectedValue(error);

      await expect(gateway.findById(999)).rejects.toThrow('Todo not found');
    });
  });

  describe('create', () => {
    beforeEach(() => {
      mockedValidateTodoData.mockClear();
      mockedTodoApi.create.mockClear();
    });

    it('should create a new todo with validation', async () => {
      const createRequest: CreateTodoRequest = {
        title: 'New Todo',
        priority: 'medium',
      };

      const mockCreatedTodo: Todo = {
        id: 1,
        title: 'New Todo',
        priority: 'medium',
        completed: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedTodoApi.create.mockResolvedValue(mockCreatedTodo);

      const result = await gateway.create(createRequest);

      expect(mockedValidateTodoData).toHaveBeenCalledWith(createRequest);
      expect(mockedTodoApi.create).toHaveBeenCalledWith(createRequest, undefined);
      expect(result).toEqual(mockCreatedTodo);
    });

    it('should handle validation errors', async () => {
      const createRequest: CreateTodoRequest = {
        title: '',
        priority: 'medium',
      };

      const validationError = new Error('Title is required');

      mockedValidateTodoData.mockImplementation(() => {
        throw validationError;
      });

      await expect(gateway.create(createRequest)).rejects.toThrow('Title is required');
      expect(mockedTodoApi.create).not.toHaveBeenCalled();
    });

    it('should handle API creation errors', async () => {
      const createRequest: CreateTodoRequest = {
        title: 'New Todo',
        priority: 'medium',
      };

      // Clear previous mock implementations
      mockedValidateTodoData.mockReset();
      mockedTodoApi.create.mockReset();

      // Set up fresh mocks
      mockedValidateTodoData.mockImplementation(() => {});
      const apiError = new Error('Server Error');

      mockedTodoApi.create.mockRejectedValue(apiError);

      await expect(gateway.create(createRequest)).rejects.toThrow('Server Error');
      expect(mockedValidateTodoData).toHaveBeenCalledWith(createRequest);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      mockedValidateTodoData.mockReset();
      mockedTodoApi.update.mockReset();
    });

    it('should update todo with title validation', async () => {
      const updateRequest: UpdateTodoRequest = {
        title: 'Updated Title',
        completed: true,
      };

      const mockUpdatedTodo: Todo = {
        id: 1,
        title: 'Updated Title',
        completed: true,
        priority: 'low',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockedTodoApi.update.mockResolvedValue(mockUpdatedTodo);

      const result = await gateway.update(1, updateRequest);

      expect(mockedValidateTodoData).toHaveBeenCalledWith({ title: 'Updated Title' });
      expect(mockedTodoApi.update).toHaveBeenCalledWith(1, updateRequest, undefined);
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should update todo without title validation when title is undefined', async () => {
      const updateRequest: UpdateTodoRequest = {
        completed: true,
        priority: 'low',
      };

      const mockUpdatedTodo: Todo = {
        id: 1,
        title: 'Original Title',
        completed: true,
        priority: 'low',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockedTodoApi.update.mockResolvedValue(mockUpdatedTodo);

      const result = await gateway.update('1', updateRequest);

      expect(mockedValidateTodoData).not.toHaveBeenCalled();
      expect(mockedTodoApi.update).toHaveBeenCalledWith('1', updateRequest, undefined);
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should handle validation errors for title updates', async () => {
      const updateRequest: UpdateTodoRequest = {
        title: '',
      };

      const validationError = new Error('Title cannot be empty');

      mockedValidateTodoData.mockImplementation(() => {
        throw validationError;
      });

      await expect(gateway.update(1, updateRequest)).rejects.toThrow('Title cannot be empty');
      expect(mockedTodoApi.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete todo by string id', async () => {
      mockedTodoApi.delete.mockResolvedValue(undefined);

      await gateway.delete('1');

      expect(mockedTodoApi.delete).toHaveBeenCalledWith('1', undefined);
    });

    it('should delete todo by number id', async () => {
      mockedTodoApi.delete.mockResolvedValue(undefined);

      await gateway.delete(1);

      expect(mockedTodoApi.delete).toHaveBeenCalledWith(1, undefined);
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Failed to delete');

      mockedTodoApi.delete.mockRejectedValue(error);

      await expect(gateway.delete(1)).rejects.toThrow('Failed to delete');
    });
  });

  describe('testError', () => {
    it('should handle zod-request error type', async () => {
      const mockResult = { error: 'Zod request validation failed' };

      mockedTodoApi.testZodRequestError.mockResolvedValue(mockResult);

      const result = await gateway.testError('zod-request');

      expect(mockedTodoApi.testZodRequestError).toHaveBeenCalledWith(undefined);
      expect(mockedTodoApi.testError).not.toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should handle other error types', async () => {
      const mockResult = { error: 'Server error' };

      mockedTodoApi.testError.mockResolvedValue(mockResult);

      const result = await gateway.testError('server');

      expect(mockedTodoApi.testError).toHaveBeenCalledWith('server', undefined);
      expect(mockedTodoApi.testZodRequestError).not.toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should handle network error type', async () => {
      const mockResult = { error: 'Network error' };

      mockedTodoApi.testError.mockResolvedValue(mockResult);

      const result = await gateway.testError('network');

      expect(mockedTodoApi.testError).toHaveBeenCalledWith('network', undefined);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getSourceInfo', () => {
    it('should return correct source info for HTTP gateway', () => {
      const sourceInfo = gateway.getSourceInfo();

      expect(sourceInfo).toEqual({
        type: 'http',
        name: 'HTTP API Gateway (Clean Architecture)',
        capabilities: {
          offline: false,
          realtime: true,
          persistence: true,
        },
      });
    });
  });

  describe('Gateway Contract', () => {
    it('should implement all required TodoGateway methods', () => {
      expect(typeof gateway.findAll).toBe('function');
      expect(typeof gateway.findById).toBe('function');
      expect(typeof gateway.create).toBe('function');
      expect(typeof gateway.update).toBe('function');
      expect(typeof gateway.delete).toBe('function');
      expect(typeof gateway.testError).toBe('function');
      expect(typeof gateway.getSourceInfo).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should properly propagate API errors', async () => {
      const networkError = new Error('Network timeout');

      mockedTodoApi.getAll.mockRejectedValue(networkError);

      await expect(gateway.findAll()).rejects.toThrow('Network timeout');
    });

    it('should handle malformed responses', async () => {
      const malformedError = new Error('Invalid response format');

      mockedTodoApi.getById.mockRejectedValue(malformedError);

      await expect(gateway.findById(1)).rejects.toThrow('Invalid response format');
    });
  });
});
