import { type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';

import type { BaseRepository } from '@/core/lib/react-query';
import { MutationOptions, QueryOptions } from '@/core/lib/react-query';
import type { AuthCredentials, AuthLoginResponse } from '@/modules/auth/auth.types';
import type { DataSource } from '@/types/gateway.types';

// Repository Object Interface for Queries
export interface AuthQueriesRepository extends BaseRepository {
  useValidateSession: (token: string, options?: QueryOptions) => UseQueryResult<boolean, Error>;
}

// Repository Object Interface for Mutations
export interface AuthMutationsRepository {
  useLogin: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<AuthLoginResponse, Error, AuthCredentials>;
  useLogout: (dataSource?: DataSource, options?: MutationOptions) => UseMutationResult<void, Error, void>;
  useRefreshToken: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<AuthLoginResponse, Error, string>;
}

// Combined repository object interface
export interface AuthRepository {
  queries: AuthQueriesRepository;
  mutations: AuthMutationsRepository;
  queryKeys: typeof import('./auth.repository.keys').authQueryKeys;
  queryOptions: typeof import('./auth.query-options').authQueryOptions;
  mutationOptions: typeof import('./auth.query-options').authMutationOptions;
}
