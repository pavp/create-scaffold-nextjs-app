import { mutationOptions, queryOptions } from '@tanstack/react-query';

import type { AuthCredentials } from '@/modules/auth/auth.types';
import type { DataSource } from '@/types/gateway.types';

import { createHttpAuthGateway } from './gateways/http-gateway/http-gateway';
import { authQueryKeys } from './auth.repository.keys';

// ============================================================================
// QUERY OPTIONS - for Server Components and prefetch
// ============================================================================

const getValidateSessionQueryOptions = (token: string) =>
  queryOptions({
    queryKey: authQueryKeys.validate(token),
    queryFn: ({ signal }) => createHttpAuthGateway().validateSession(token, { signal }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: Boolean(token),
    retry: false, // Don't retry session validation
  });

// ============================================================================
// MUTATION OPTIONS - for consistency and reusability
// ============================================================================

const getLoginMutationOptions = (_dataSource: DataSource = 'http') =>
  mutationOptions({
    mutationFn: (credentials: AuthCredentials) => createHttpAuthGateway().login(credentials),
    retry: 1,
  });

const getLogoutMutationOptions = (_dataSource: DataSource = 'http') =>
  mutationOptions({
    mutationFn: () => createHttpAuthGateway().logout(),
    retry: 1,
  });

const getRefreshTokenMutationOptions = (_dataSource: DataSource = 'http') =>
  mutationOptions({
    mutationFn: (token: string) => createHttpAuthGateway().refreshToken(token),
    retry: 1,
  });

// ============================================================================
// ORGANIZED EXPORTS - separated by concern
// ============================================================================

// Query options for Server Components and prefetch
export const authQueryOptions = {
  validateSession: getValidateSessionQueryOptions,
} as const;

// Mutation options for consistency
export const authMutationOptions = {
  login: getLoginMutationOptions,
  logout: getLogoutMutationOptions,
  refreshToken: getRefreshTokenMutationOptions,
} as const;
