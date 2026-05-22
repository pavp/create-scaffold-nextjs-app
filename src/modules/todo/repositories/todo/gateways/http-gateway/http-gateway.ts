import { todoApi } from '@/modules/todo/api/todo-api';
import type { TodoGateway } from '@/modules/todo/repositories/todo/gateways/todo.gateway.types';
import { validateTodoData } from '@/modules/todo/repositories/todo/helpers/validation/validation.helper';

/**
 * HTTP Gateway Factory Function
 * Uses the new clean architecture API layer
 */
export const createHttpTodoGateway = (): TodoGateway => {
  return {
    async findAll(filters, options) {
      return todoApi.getAll(filters, options);
    },

    async findById(id, options) {
      return todoApi.getById(id, options);
    },

    async create(todo, options) {
      validateTodoData(todo);

      return todoApi.create(todo, options);
    },

    async update(id, todo, options) {
      if (todo.title !== undefined) {
        validateTodoData({ title: todo.title });
      }

      return todoApi.update(id, todo, options);
    },

    async delete(id, options) {
      await todoApi.delete(id, options);
    },

    async testError(type, options) {
      if (type === 'zod-request') {
        return todoApi.testZodRequestError(options);
      }

      return todoApi.testError(type, options);
    },

    getSourceInfo() {
      return {
        type: 'http',
        name: 'HTTP API Gateway (Clean Architecture)',
        capabilities: {
          offline: false,
          realtime: true,
          persistence: true, // Server-side persistence
        },
      };
    },
  };
};
