/**
 * @jest-environment jsdom
 */

import { createMockTodo, createMockTodoFilters, createMockTodos } from '@test/entities/todo.mock';
import { z } from 'zod';

import { endpoints } from '@/api/endpoints';
import { httpClient } from '@/api/http-client';
import type { CreateTodoRequest, Todo, TodoFilters, UpdateTodoRequest } from '@/modules/todo/todo.types';
import {
  CreateTodoSchema,
  TodoArraySchema,
  TodoFiltersSchema,
  TodoSchema,
  UpdateTodoSchema,
} from '@/modules/todo/todo.types';

import { todoApi } from './todo-api';

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('TodoApi', () => {
  let mockTodos: Todo[];
  let mockFilters: TodoFilters;

  beforeAll(() => {
    // Create reusable test data using faker factories
    mockTodos = createMockTodos(2, {
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    });

    mockFilters = createMockTodoFilters({
      priority: 'high',
      completed: false,
      search: 'priority',
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all todos without filters', async () => {
      mockedHttpClient.get.mockResolvedValue({ data: mockTodos });

      const result = await todoApi.getAll();

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.BASE, {
        params: {},
        requestSchema: TodoFiltersSchema,
        responseSchema: TodoArraySchema,
      });
      expect(result).toEqual(mockTodos);
    });

    it('should fetch todos with filters', async () => {
      const filteredTodos = [
        createMockTodo({
          id: 1,
          title: 'High Priority Todo',
          completed: false,
          priority: 'high',
        }),
      ];

      mockedHttpClient.get.mockResolvedValue({ data: filteredTodos });

      const result = await todoApi.getAll(mockFilters);

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.BASE, {
        params: mockFilters,
        requestSchema: TodoFiltersSchema,
        responseSchema: TodoArraySchema,
      });
      expect(result).toEqual(filteredTodos);
    });

    it('should handle empty todos array', async () => {
      mockedHttpClient.get.mockResolvedValue({ data: [] });

      const result = await todoApi.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch todo by string id', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockTodo });

      const result = await todoApi.getById('1');

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.BY_ID('1'), {
        responseSchema: TodoSchema,
      });
      expect(result).toEqual(mockTodo);
    });

    it('should fetch todo by number id', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockTodo });

      const result = await todoApi.getById(1);

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.BY_ID(1), {
        responseSchema: TodoSchema,
      });
      expect(result).toEqual(mockTodo);
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const todoRequest: CreateTodoRequest = {
        title: 'New Todo',
        description: 'A new todo item',
        priority: 'high',
        dueDate: '2023-12-31T23:59:59Z',
      };

      const mockCreatedTodo: Todo = {
        id: 1,
        title: 'New Todo',
        description: 'A new todo item',
        completed: false,
        priority: 'high',
        dueDate: '2023-12-31T23:59:59Z',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedHttpClient.post.mockResolvedValue({ data: mockCreatedTodo });

      const result = await todoApi.create(todoRequest);

      expect(mockedHttpClient.post).toHaveBeenCalledWith(endpoints.TODO.BASE, todoRequest, {
        requestSchema: CreateTodoSchema,
        responseSchema: TodoSchema,
      });
      expect(result).toEqual(mockCreatedTodo);
    });

    it('should create todo with minimal data', async () => {
      const todoRequest: CreateTodoRequest = {
        title: 'Minimal Todo',
      };

      const mockCreatedTodo: Todo = {
        id: 1,
        title: 'Minimal Todo',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedHttpClient.post.mockResolvedValue({ data: mockCreatedTodo });

      const result = await todoApi.create(todoRequest);

      expect(mockedHttpClient.post).toHaveBeenCalledWith(endpoints.TODO.BASE, todoRequest, {
        requestSchema: CreateTodoSchema,
        responseSchema: TodoSchema,
      });
      expect(result).toEqual(mockCreatedTodo);
    });
  });

  describe('update', () => {
    it('should update a todo by string id', async () => {
      const todoUpdate: UpdateTodoRequest = {
        title: 'Updated Todo',
        completed: true,
        priority: 'low',
      };

      const mockUpdatedTodo: Todo = {
        id: 1,
        title: 'Updated Todo',
        completed: true,
        priority: 'low',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockedHttpClient.put.mockResolvedValue({ data: mockUpdatedTodo });

      const result = await todoApi.update('1', todoUpdate);

      expect(mockedHttpClient.put).toHaveBeenCalledWith(endpoints.TODO.BY_ID('1'), todoUpdate, {
        requestSchema: UpdateTodoSchema,
        responseSchema: TodoSchema,
      });
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should update a todo by number id', async () => {
      const todoUpdate: UpdateTodoRequest = {
        completed: true,
      };

      const mockUpdatedTodo: Todo = {
        id: 1,
        title: 'Original Todo',
        completed: true,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockedHttpClient.put.mockResolvedValue({ data: mockUpdatedTodo });

      const result = await todoApi.update(1, todoUpdate);

      expect(mockedHttpClient.put).toHaveBeenCalledWith(endpoints.TODO.BY_ID(1), todoUpdate, {
        requestSchema: UpdateTodoSchema,
        responseSchema: TodoSchema,
      });
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should handle partial updates', async () => {
      const todoUpdate: UpdateTodoRequest = {
        description: 'Updated description only',
      };

      const mockUpdatedTodo: Todo = {
        id: 1,
        title: 'Original Todo',
        description: 'Updated description only',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      mockedHttpClient.put.mockResolvedValue({ data: mockUpdatedTodo });

      const result = await todoApi.update(1, todoUpdate);

      expect(result).toEqual(mockUpdatedTodo);
    });
  });

  describe('delete', () => {
    it('should delete a todo by string id', async () => {
      mockedHttpClient.delete.mockResolvedValue({} as any);

      await todoApi.delete('1');

      expect(mockedHttpClient.delete).toHaveBeenCalledWith(endpoints.TODO.BY_ID('1'), {
        signal: undefined,
      });
    });

    it('should delete a todo by number id', async () => {
      mockedHttpClient.delete.mockResolvedValue({} as any);

      await todoApi.delete(1);

      expect(mockedHttpClient.delete).toHaveBeenCalledWith(endpoints.TODO.BY_ID(1), {
        signal: undefined,
      });
    });
  });

  describe('testError', () => {
    it('should handle zod-response error type', async () => {
      // Mock httpClient.get to throw a validation error
      mockedHttpClient.get.mockRejectedValue(new Error('Validation error: requiredNewField is required'));

      await expect(todoApi.testError('zod-response')).rejects.toThrow('Validation error: requiredNewField is required');

      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        endpoints.TODO.TEST_ERRORS,
        expect.objectContaining({
          params: { type: 'zod-response' },
          responseSchema: expect.any(z.ZodObject),
        }),
      );
    });

    it('should handle server error types', async () => {
      const mockErrorResponse = {
        error: 'Server error',
        message: 'Something went wrong',
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockErrorResponse });

      const result = await todoApi.testError('server');

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.TEST_ERRORS, {
        params: { type: 'server' },
      });
      expect(result).toEqual(mockErrorResponse);
    });

    it('should handle validation error type', async () => {
      const mockErrorResponse = {
        error: 'Validation error',
        details: ['Title is required'],
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockErrorResponse });

      const result = await todoApi.testError('validation');

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.TEST_ERRORS, {
        params: { type: 'validation' },
      });
      expect(result).toEqual(mockErrorResponse);
    });

    it('should handle unauthorized error type', async () => {
      const mockErrorResponse = {
        error: 'Unauthorized',
        message: 'Authentication required',
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockErrorResponse });

      const result = await todoApi.testError('unauthorized');

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.TEST_ERRORS, {
        params: { type: 'unauthorized' },
      });
      expect(result).toEqual(mockErrorResponse);
    });

    it('should handle notfound error type', async () => {
      const mockErrorResponse = {
        error: 'Not found',
        message: 'Todo not found',
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockErrorResponse });

      const result = await todoApi.testError('notfound');

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.TEST_ERRORS, {
        params: { type: 'notfound' },
      });
      expect(result).toEqual(mockErrorResponse);
    });

    it('should handle network error type', async () => {
      const mockErrorResponse = {
        error: 'Network error',
        message: 'Connection failed',
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockErrorResponse });

      const result = await todoApi.testError('network');

      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.TODO.TEST_ERRORS, {
        params: { type: 'network' },
      });
      expect(result).toEqual(mockErrorResponse);
    });
  });

  describe('testZodRequestError', () => {
    it('should trigger request validation error with invalid data', async () => {
      // Mock implementation should throw validation error due to invalid request data
      mockedHttpClient.post.mockRejectedValue(new Error('Request validation failed'));

      await expect(todoApi.testZodRequestError()).rejects.toThrow('Request validation failed');

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.TODO.TEST_ERRORS,
        {
          title: '',
          priority: 'totally-invalid-priority',
          dueDate: 12345,
          completed: 'not-a-boolean',
          description: null,
        },
        {
          requestSchema: CreateTodoSchema,
          responseSchema: TodoSchema,
        },
      );
    });
  });

  describe('error handling', () => {
    it('should propagate HTTP errors from getAll', async () => {
      const mockError = new Error('Network error');

      mockedHttpClient.get.mockRejectedValue(mockError);

      await expect(todoApi.getAll()).rejects.toThrow('Network error');
    });

    it('should propagate HTTP errors from getById', async () => {
      const mockError = new Error('Todo not found');

      mockedHttpClient.get.mockRejectedValue(mockError);

      await expect(todoApi.getById(1)).rejects.toThrow('Todo not found');
    });

    it('should propagate HTTP errors from create', async () => {
      const mockError = new Error('Validation failed');

      mockedHttpClient.post.mockRejectedValue(mockError);

      await expect(todoApi.create({ title: 'Test' })).rejects.toThrow('Validation failed');
    });

    it('should propagate HTTP errors from update', async () => {
      const mockError = new Error('Update failed');

      mockedHttpClient.put.mockRejectedValue(mockError);

      await expect(todoApi.update(1, { title: 'Updated' })).rejects.toThrow('Update failed');
    });

    it('should propagate HTTP errors from delete', async () => {
      const mockError = new Error('Delete failed');

      mockedHttpClient.delete.mockRejectedValue(mockError);

      await expect(todoApi.delete(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('schema validation', () => {
    it('should use correct schemas for getAll request', async () => {
      mockedHttpClient.get.mockResolvedValue({ data: [] });

      await todoApi.getAll({ priority: 'high' });

      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        endpoints.TODO.BASE,
        expect.objectContaining({
          requestSchema: TodoFiltersSchema,
          responseSchema: TodoArraySchema,
        }),
      );
    });

    it('should use correct schemas for getById response', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockTodo });

      await todoApi.getById(1);

      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        endpoints.TODO.BY_ID(1),
        expect.objectContaining({
          responseSchema: TodoSchema,
        }),
      );
    });

    it('should use correct schemas for create request and response', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedHttpClient.post.mockResolvedValue({ data: mockTodo });

      await todoApi.create({ title: 'Test' });

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.TODO.BASE,
        { title: 'Test' },
        expect.objectContaining({
          requestSchema: CreateTodoSchema,
          responseSchema: TodoSchema,
        }),
      );
    });

    it('should use correct schemas for update request and response', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Updated',
        completed: false,
        priority: 'medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedHttpClient.put.mockResolvedValue({ data: mockTodo });

      await todoApi.update(1, { title: 'Updated' });

      expect(mockedHttpClient.put).toHaveBeenCalledWith(
        endpoints.TODO.BY_ID(1),
        { title: 'Updated' },
        expect.objectContaining({
          requestSchema: UpdateTodoSchema,
          responseSchema: TodoSchema,
        }),
      );
    });
  });
});
