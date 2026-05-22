import { authMutationOptions, authQueryOptions } from './auth.query-options';
import { authQueryKeys } from './auth.repository.keys';
import { authMutationsRepository } from './auth.repository.mutations';
import { authQueriesRepository } from './auth.repository.queries';
import type { AuthRepository } from './auth.repository.types';

// Export Repository Objects with Types
export * from './auth.query-options';
export { authQueryKeys } from './auth.repository.keys';
export * from './auth.repository.mutations';
export * from './auth.repository.queries';
export type { AuthMutationsRepository, AuthQueriesRepository, AuthRepository } from './auth.repository.types';
export * from './gateways';
export * from './helpers';

// Auth Repository - Combined repository object with unified API
export const authRepository: AuthRepository = {
  queries: authQueriesRepository,
  mutations: authMutationsRepository,
  queryKeys: authQueryKeys,
  queryOptions: authQueryOptions,
  mutationOptions: authMutationOptions,
};
