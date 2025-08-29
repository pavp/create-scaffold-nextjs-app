import type { TodoGateway } from '@/modules/todo/repositories/todo/gateways/todo.gateway.types';
import { applyFiltersToTodos } from '@/modules/todo/repositories/todo/helpers/filter-todos/filter-todos.helper';
import { validateTodoData } from '@/modules/todo/repositories/todo/helpers/validation/validation.helper';
import { Todo } from '@/modules/todo/todo.types';

import { getNextTodoId } from './helpers/get-next-todo-id/get-next-todo-id.helper';
import { getTodosFromStorage } from './helpers/get-todos-from-storage/get-todos-from-storage.helper';
import { saveTodosToStorage } from './helpers/save-todos-to-storage/save-todos-to-storage.helper';

/**
 * LocalStorage Gateway Factory Function
 * Handles all localStorage operations for todo management
 */
export const createLocalStorageTodoGateway = (storageKey = 'nextlane_todos'): TodoGateway => {
  return {
    async findAll(filters, options) {
      // Check for cancellation before proceeding
      if (options?.signal?.aborted) {
        throw new DOMException('Operation was aborted', 'AbortError');
      }

      const todos = getTodosFromStorage(storageKey);

      return applyFiltersToTodos(todos, filters);
    },

    async findById(id, options) {
      // Check for cancellation before proceeding
      if (options?.signal?.aborted) {
        throw new DOMException('Operation was aborted', 'AbortError');
      }

      const todos = getTodosFromStorage(storageKey);
      const todo = todos.find((t) => t.id === id);

      if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
      }

      return todo;
    },

    async create(todoData, options) {
      // Check for cancellation before proceeding
      if (options?.signal?.aborted) {
        throw new DOMException('Operation was aborted', 'AbortError');
      }

      validateTodoData(todoData);

      const todos = getTodosFromStorage(storageKey);
      const now = new Date().toISOString();

      const newTodo: Todo = {
        id: getNextTodoId(storageKey),
        title: todoData.title,
        description: todoData.description || '',
        completed: false,
        priority: todoData.priority || 'medium',
        dueDate: todoData.dueDate,
        createdAt: now,
        updatedAt: now,
      };

      const updatedTodos = [...todos, newTodo];

      saveTodosToStorage(storageKey, updatedTodos);

      return newTodo;
    },

    async update(id, updates, options) {
      // Check for cancellation before proceeding
      if (options?.signal?.aborted) {
        throw new DOMException('Operation was aborted', 'AbortError');
      }

      if (updates.title !== undefined) {
        validateTodoData({ title: updates.title });
      }

      const todos = getTodosFromStorage(storageKey);
      const index = todos.findIndex((t) => t.id === id);

      if (index === -1) {
        throw new Error(`Todo with id ${id} not found`);
      }

      const updatedTodo: Todo = {
        ...todos[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const updatedTodos = [...todos];

      updatedTodos[index] = updatedTodo;
      saveTodosToStorage(storageKey, updatedTodos);

      return updatedTodo;
    },

    async delete(id, options) {
      // Check for cancellation before proceeding
      if (options?.signal?.aborted) {
        throw new DOMException('Operation was aborted', 'AbortError');
      }

      const todos = getTodosFromStorage(storageKey);
      const filteredTodos = todos.filter((t) => t.id !== id);

      if (filteredTodos.length === todos.length) {
        throw new Error(`Todo with id ${id} not found`);
      }

      saveTodosToStorage(storageKey, filteredTodos);
    },

    async testError(type, options) {
      // Check for cancellation before proceeding
      if (options?.signal?.aborted) {
        throw new DOMException('Operation was aborted', 'AbortError');
      }

      // Simulate different error types locally
      await new Promise((resolve) => setTimeout(resolve, 300));

      switch (type) {
        case 'validation':
          throw new Error('Local validation error occurred');
        case 'unauthorized':
          throw new Error('Local unauthorized access');
        case 'notfound':
          throw new Error('Local resource not found');
        case 'server':
          throw new Error('Local server simulation error');
        default:
          throw new Error('Local generic error');
      }
    },

    getSourceInfo() {
      return {
        type: 'localStorage',
        name: 'Local Storage Gateway',
        capabilities: {
          offline: true,
          realtime: false,
          persistence: true, // Client-side persistence
        },
      };
    },
  };
};
