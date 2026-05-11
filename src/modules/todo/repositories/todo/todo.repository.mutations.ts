import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Todo } from '@/modules/todo/todo.types';

import { todoMutationOptions } from './todo.query-options';
import { todoQueryKeys } from './todo.repository.keys';
import type { TodoMutationsRepository } from './todo.repository.types';

// Repository Object with React Query hooks for data mutations
export const todoMutationsRepository: TodoMutationsRepository = {
  /**
   * Hook to create a new todo
   * ✅ Uses mutationOptions for consistency
   */
  useCreateTodo: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const baseOptions = todoMutationOptions.createTodo(dataSource);

    return useMutation({
      ...baseOptions,
      // eslint-disable-next-line max-params
      onSuccess: (newTodo, variables, onMutateResult, context) => {
        // Repository-specific cache logic
        queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists(dataSource) });

        // Optimistically add to cache
        queryClient.setQueryData<Todo[]>(todoQueryKeys.lists(dataSource), (oldData) => {
          return oldData ? [...oldData, newTodo] : [newTodo];
        });

        // Call user's onSuccess if provided
        options?.onSuccess?.(newTodo, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  /**
   * Hook to update an existing todo
   * ✅ Uses mutationOptions for consistency
   */
  useUpdateTodo: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const baseOptions = todoMutationOptions.updateTodo(dataSource);

    return useMutation({
      ...baseOptions,
      // eslint-disable-next-line max-params
      onSuccess: (updatedTodo, variables, onMutateResult, context) => {
        // Repository-specific cache logic
        queryClient.setQueryData<Todo[]>(todoQueryKeys.lists(), (oldData) => {
          return oldData?.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo));
        });

        // Update the specific todo cache
        queryClient.setQueryData(todoQueryKeys.detail(updatedTodo.id), updatedTodo);

        // Invalidate lists to ensure consistency
        queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists(dataSource) });

        // Call user's onSuccess if provided
        options?.onSuccess?.(updatedTodo, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  /**
   * Hook to delete a todo
   * ✅ Uses mutationOptions for consistency
   */
  useDeleteTodo: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const baseOptions = todoMutationOptions.deleteTodo(dataSource);

    return useMutation({
      ...baseOptions,
      // eslint-disable-next-line max-params
      onSuccess: (result, deletedId, onMutateResult, context) => {
        // Repository-specific cache logic
        queryClient.setQueryData<Todo[]>(todoQueryKeys.lists(), (oldData) => {
          return oldData?.filter((todo) => todo.id !== deletedId);
        });

        // Remove from detail cache
        queryClient.removeQueries({ queryKey: todoQueryKeys.detail(deletedId) });

        // Invalidate lists to ensure consistency
        queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists(dataSource) });

        // Call user's onSuccess if provided
        options?.onSuccess?.(result, deletedId, onMutateResult, context);
      },
      ...options,
    });
  },

  /**
   * Hook to bulk delete todos
   * ✅ Uses mutationOptions for consistency
   */
  useBulkDeleteTodos: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const baseOptions = todoMutationOptions.bulkDeleteTodos(dataSource);

    return useMutation({
      ...baseOptions,
      // eslint-disable-next-line max-params
      onSuccess: (deletedIds, variables, onMutateResult, context) => {
        // Repository-specific cache logic
        queryClient.setQueryData<Todo[]>(todoQueryKeys.lists(), (oldData) => {
          return oldData?.filter((todo) => !deletedIds.includes(todo.id));
        });

        // Remove from detail caches
        deletedIds.forEach((id) => {
          queryClient.removeQueries({ queryKey: todoQueryKeys.detail(id) });
        });

        // Invalidate lists to ensure consistency
        queryClient.invalidateQueries({ queryKey: todoQueryKeys.lists(dataSource) });

        // Call user's onSuccess if provided
        options?.onSuccess?.(deletedIds, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  /**
   * Hook to test error scenarios
   * ✅ Uses mutationOptions for consistency
   */
  useTestError: (dataSource = 'http', options) => {
    const baseOptions = todoMutationOptions.testError(dataSource);

    return useMutation({
      ...baseOptions,
      // No cache operations needed for error testing
      ...options,
    });
  },
};
