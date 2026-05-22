import { mutationOptions, queryOptions } from '@tanstack/react-query';

import type { ErrorType } from '@/modules/todo/todo.types';
import type { DataSource } from '@/types/gateway.types';

import { createTodoGateway } from './gateways';
import { todoQueryKeys } from './todo.repository.keys';

// ============================================================================
// QUERY OPTIONS - for Server Components and prefetch
// ============================================================================

const getTodosQueryOptions = (filters = {}, dataSource: DataSource = 'http') =>
  queryOptions({
    queryKey: todoQueryKeys.list(filters, dataSource),
    queryFn: ({ signal }) => createTodoGateway(dataSource).findAll(filters, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

const getTodoQueryOptions = (id: string | number, dataSource: DataSource = 'http') =>
  queryOptions({
    queryKey: todoQueryKeys.detail(id, dataSource),
    queryFn: ({ signal }) => createTodoGateway(dataSource).findById(id, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });

const getTodoCountQueryOptions = (filters = {}, dataSource: DataSource = 'http') =>
  queryOptions({
    queryKey: [...todoQueryKeys.list(filters, dataSource), 'count'],
    queryFn: async ({ signal }) => {
      const gateway = createTodoGateway(dataSource);
      const todos = await gateway.findAll(filters, { signal });

      return todos.length;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

const getTestErrorQueryOptions = (type: any, dataSource: DataSource = 'http') =>
  queryOptions({
    queryKey: todoQueryKeys.testError(type, dataSource),
    queryFn: ({ signal }) => createTodoGateway(dataSource).testError(type, { signal }),
    enabled: false, // Default disabled for testing
    retry: false,
    refetchOnWindowFocus: false,
  });

// ============================================================================
// MUTATION OPTIONS - for consistency and reusability
// ============================================================================

const getCreateTodoMutationOptions = (dataSource: DataSource = 'http') =>
  mutationOptions({
    mutationFn: (todo: any) => createTodoGateway(dataSource).create(todo),
    retry: 1,
  });

const getUpdateTodoMutationOptions = (dataSource: DataSource = 'http') =>
  mutationOptions({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => createTodoGateway(dataSource).update(id, data),
    retry: 1,
  });

const getDeleteTodoMutationOptions = (dataSource: DataSource = 'http') =>
  mutationOptions({
    mutationFn: (id: string | number) => createTodoGateway(dataSource).delete(id),
    retry: 1,
  });

const getBulkDeleteTodosMutationOptions = (dataSource: DataSource = 'http') =>
  mutationOptions({
    mutationFn: async (ids: Array<string | number>) => {
      const gateway = createTodoGateway(dataSource);

      // Execute deletions in parallel
      await Promise.all(ids.map((id) => gateway.delete(id)));

      return ids;
    },
    retry: 1,
  });

const getTestErrorMutationOptions = (dataSource: DataSource = 'http') =>
  mutationOptions({
    mutationFn: (errorType: ErrorType) => createTodoGateway(dataSource).testError(errorType),
    retry: false,
  });

// ============================================================================
// ORGANIZED EXPORTS - separated by concern
// ============================================================================

// Query options for Server Components and prefetch
export const todoQueryOptions = {
  todos: getTodosQueryOptions,
  todo: getTodoQueryOptions,
  todoCount: getTodoCountQueryOptions,
  testError: getTestErrorQueryOptions,
} as const;

// Mutation options for consistency
export const todoMutationOptions = {
  createTodo: getCreateTodoMutationOptions,
  updateTodo: getUpdateTodoMutationOptions,
  deleteTodo: getDeleteTodoMutationOptions,
  bulkDeleteTodos: getBulkDeleteTodosMutationOptions,
  testError: getTestErrorMutationOptions,
} as const;
