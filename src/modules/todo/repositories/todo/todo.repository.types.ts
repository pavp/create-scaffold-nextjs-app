import { type QueryClient, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';

import type { BaseRepository, PrefetchOptions } from '@/core/lib/react-query';
import { MutationOptions, QueryOptions } from '@/core/lib/react-query';
import type { CreateTodoRequest, ErrorType, Todo, TodoFilters, UpdateTodoRequest } from '@/modules/todo/todo.types';
import type { DataSource } from '@/types/gateway.types';

// Repository Object Interface for Queries
export interface TodoQueriesRepository extends BaseRepository {
  useTodos: (filters?: TodoFilters, dataSource?: DataSource, options?: QueryOptions) => UseQueryResult<Todo[], Error>;
  useTodo: (id: string | number, dataSource?: DataSource, options?: QueryOptions) => UseQueryResult<Todo, Error>;
  useTodoCount: (
    filters?: TodoFilters,
    dataSource?: DataSource,
    options?: QueryOptions,
  ) => UseQueryResult<number, Error>;
  useTestError: (type: ErrorType, dataSource?: DataSource, options?: QueryOptions) => UseQueryResult<any, Error>;

  // Prefetch methods
  prefetch: {
    prefetchTodos: (queryClient: QueryClient, filters?: TodoFilters, options?: PrefetchOptions) => Promise<void>;
  };

  // Cancellation methods
  cancel: {
    cancelTodos: (filters?: TodoFilters, dataSource?: DataSource) => Promise<void>;
    cancelTodo: (id: string | number, dataSource?: DataSource) => Promise<void>;
    cancelTodoCount: (filters?: TodoFilters, dataSource?: DataSource) => Promise<void>;
    cancelTestError: (type: ErrorType, dataSource?: DataSource) => Promise<void>;
    cancelAll: () => Promise<void>;
  };
}

// Repository Object Interface for Mutations
export interface TodoMutationsRepository {
  useCreateTodo: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<Todo, Error, CreateTodoRequest>;
  useUpdateTodo: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<Todo, Error, { id: string | number; data: UpdateTodoRequest }>;
  useDeleteTodo: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<void, Error, string | number>;
  useBulkDeleteTodos: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<Array<string | number>, Error, Array<string | number>>;
  useTestError: (dataSource?: DataSource, options?: MutationOptions) => UseMutationResult<any, Error, ErrorType>;
}

// Combined repository object interface
export interface TodoRepository {
  queries: TodoQueriesRepository;
  mutations: TodoMutationsRepository;
  queryKeys: typeof import('./todo.repository.keys').todoQueryKeys;
  queryOptions: typeof import('./todo.query-options').todoQueryOptions;
  mutationOptions: typeof import('./todo.query-options').todoMutationOptions;
}
