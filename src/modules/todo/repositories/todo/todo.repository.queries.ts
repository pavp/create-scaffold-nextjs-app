import { useQuery } from '@tanstack/react-query';

import { createPrefetchFunction, getQueryClient } from '@/core/lib/react-query';

import { createTodoGateway } from './gateways';
import { todoQueryOptions } from './todo.query-options';
import { todoQueryKeys } from './todo.repository.keys';
import type { TodoQueriesRepository } from './todo.repository.types';

// Repository Object with React Query hooks for data fetching
export const todoQueriesRepository: TodoQueriesRepository = {
  /**
   * Hook to fetch all todos with optional filters
   * Uses queryOptions for consistency with prefetch
   */
  useTodos: (filters = {}, dataSource = 'http', options) => {
    const baseOptions = todoQueryOptions.todos(filters, dataSource);

    return useQuery({
      ...baseOptions,
      ...options,
    });
  },

  /**
   * Hook to fetch a single todo by ID
   * ✅ Uses queryOptions eliminating code duplication
   */
  useTodo: (id, dataSource = 'http', options) => {
    return useQuery({
      ...todoQueryOptions.todo(id, dataSource),
      ...options, // User options overrides defaults
    });
  },

  /**
   * Hook to get todo count with filters
   * ✅ Uses queryOptions eliminating code duplication
   */
  useTodoCount: (filters = {}, dataSource = 'http', options) => {
    return useQuery({
      ...todoQueryOptions.todoCount(filters, dataSource),
      ...options, // User options overrides defaults
    });
  },

  /**
   * Hook to test error handling
   * ✅ Uses queryOptions eliminating code duplication
   */
  useTestError: (type, dataSource = 'http', options) => {
    return useQuery({
      ...todoQueryOptions.testError(type, dataSource),
      ...options, // User options overrides defaults
    });
  },

  // ✅ Prefetch methods - simple and functional
  prefetch: {
    /**
     * Prefetch list of todos with optional filters
     * Compatible with queryOptions for Server Components usage
     */
    prefetchTodos: createPrefetchFunction((filters = {}, dataSource = 'http') => ({
      queryKey: [...todoQueryKeys.list(filters, dataSource)],
      queryFn: () => createTodoGateway(dataSource).findAll(filters),
    })),
  },

  // ✅ Cancellation methods - optional manual query cancellation
  cancel: {
    /**
     * Cancel todos queries with optional filters
     * Uses React Query's cancelQueries method
     */
    cancelTodos: async (filters = {}, dataSource = 'http') => {
      const queryClient = getQueryClient();

      await queryClient.cancelQueries({ queryKey: todoQueryKeys.list(filters, dataSource) });
    },

    /**
     * Cancel a specific todo query by ID
     */
    cancelTodo: async (id: string | number, dataSource = 'http') => {
      const queryClient = getQueryClient();

      await queryClient.cancelQueries({ queryKey: todoQueryKeys.detail(id, dataSource) });
    },

    /**
     * Cancel todo count queries with optional filters
     */
    cancelTodoCount: async (filters = {}, dataSource = 'http') => {
      const queryClient = getQueryClient();

      await queryClient.cancelQueries({ queryKey: [...todoQueryKeys.list(filters, dataSource), 'count'] });
    },

    /**
     * Cancel test error queries by type
     */
    cancelTestError: async (type: any, dataSource = 'http') => {
      const queryClient = getQueryClient();

      await queryClient.cancelQueries({ queryKey: todoQueryKeys.testError(type, dataSource) });
    },

    /**
     * Cancel all todo-related queries
     * Useful for component cleanup or when switching data sources
     */
    cancelAll: async () => {
      const queryClient = getQueryClient();

      await queryClient.cancelQueries({ queryKey: todoQueryKeys.all });
    },
  },
};
