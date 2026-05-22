import { z } from 'zod';

import type { ApiOptions } from '@/api/api.types';
import { endpoints } from '@/api/endpoints';
import { httpClient } from '@/api/http-client';
import type { CreateTodoRequest, ErrorType, Todo, TodoFilters, UpdateTodoRequest } from '@/modules/todo/todo.types';
import {
  CreateTodoSchema,
  TodoArraySchema,
  TodoFiltersSchema,
  TodoSchema,
  UpdateTodoSchema,
} from '@/modules/todo/todo.types';

// Contract interface
export interface TodoApiContract {
  getAll(filters?: TodoFilters, options?: ApiOptions): Promise<Todo[]>;
  getById(id: string | number, options?: ApiOptions): Promise<Todo>;
  create(todo: CreateTodoRequest, options?: ApiOptions): Promise<Todo>;
  update(id: string | number, todo: UpdateTodoRequest, options?: ApiOptions): Promise<Todo>;
  delete(id: string | number, options?: ApiOptions): Promise<void>;
  testError(type: ErrorType, options?: ApiOptions): Promise<any>;
  testZodRequestError(options?: ApiOptions): Promise<any>;
}

// Service implementation with Zod validation
const createTodoApiService = (): TodoApiContract => ({
  async getAll(filters = {}, options) {
    const response = await httpClient.get<Todo[]>(endpoints.TODO.BASE, {
      params: filters,
      requestSchema: TodoFiltersSchema,
      responseSchema: TodoArraySchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async getById(id, options) {
    const response = await httpClient.get<Todo>(endpoints.TODO.BY_ID(id), {
      responseSchema: TodoSchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async create(todo, options) {
    const response = await httpClient.post<Todo>(endpoints.TODO.BASE, todo, {
      requestSchema: CreateTodoSchema,
      responseSchema: TodoSchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async update(id, todo, options) {
    const response = await httpClient.put<Todo>(endpoints.TODO.BY_ID(id), todo, {
      requestSchema: UpdateTodoSchema,
      responseSchema: TodoSchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async delete(id, options) {
    await httpClient.delete(endpoints.TODO.BY_ID(id), {
      signal: options?.signal,
    });
  },

  async testError(type, options) {
    if (type === 'zod-response') {
      // Create invalid response schema to trigger response validation error
      const InvalidResponseSchema = TodoSchema.extend({
        requiredNewField: z.string(), // This field won't exist in response
      });

      // Get a valid response from server but use invalid schema
      const response = await httpClient.get<Todo>(endpoints.TODO.TEST_ERRORS, {
        params: { type }, // Get valid server response
        responseSchema: InvalidResponseSchema, // Invalid schema will fail validation
        signal: options?.signal,
      });

      return response.data;
    }

    // For other error types, delegate to server
    const response = await httpClient.get(endpoints.TODO.TEST_ERRORS, {
      params: { type },
      signal: options?.signal,
      // No validation for test error responses as they can be various formats
    });

    return response.data;
  },

  async testZodRequestError(options) {
    // Simulate request schema validation error by sending obviously invalid data
    const invalidTodo = {
      title: '', // Invalid: empty title (violates min(1) requirement)
      priority: 'totally-invalid-priority', // Invalid: not in enum
      dueDate: 12345, // Invalid: should be string, not number
      completed: 'not-a-boolean', // Invalid: should be boolean
      description: null, // Invalid: should be string or undefined
    };

    const response = await httpClient.post<Todo>(endpoints.TODO.TEST_ERRORS, invalidTodo, {
      requestSchema: CreateTodoSchema, // This will trigger validation error
      responseSchema: TodoSchema,
      signal: options?.signal,
    });

    return response.data;
  },
});

// Singleton instance for the entire app
export const todoApi = createTodoApiService();
