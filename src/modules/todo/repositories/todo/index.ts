import { todoMutationOptions, todoQueryOptions } from './todo.query-options';
import { todoQueryKeys } from './todo.repository.keys';
import { todoMutationsRepository } from './todo.repository.mutations';
import { todoQueriesRepository } from './todo.repository.queries';
import type { TodoRepository } from './todo.repository.types';

// Export Repository Objects with Types
export { todoQueryKeys } from './todo.repository.keys';
export type { TodoMutationsRepository, TodoQueriesRepository, TodoRepository } from './todo.repository.types';

// Todo Repository - Combined repository object with unified API
export const todoRepository: TodoRepository = {
  queries: todoQueriesRepository,
  mutations: todoMutationsRepository,
  queryKeys: todoQueryKeys,
  queryOptions: todoQueryOptions,
  mutationOptions: todoMutationOptions,
};
