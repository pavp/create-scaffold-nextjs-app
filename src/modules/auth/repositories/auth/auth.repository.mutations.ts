import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authMutationOptions } from './auth.query-options';
import { authQueryKeys } from './auth.repository.keys';
import type { AuthMutationsRepository } from './auth.repository.types';

// Repository Object with React Query hooks for data mutations
export const authMutationsRepository: AuthMutationsRepository = {
  /**
   * Hook to login user
   * Uses mutationOptions for consistency
   */
  useLogin: (dataSource = 'http', options) => {
    const baseOptions = authMutationOptions.login(dataSource);

    return useMutation({
      ...baseOptions,
      onSuccess: (loginResponse, variables, context) => {
        // Repository-specific cache logic
        // Projects should implement their own token storage and cache invalidation

        // Call user's onSuccess if provided
        options?.onSuccess?.(loginResponse, variables, context);
      },
      ...options,
    });
  },

  /**
   * Hook to logout user
   * Uses mutationOptions for consistency
   */
  useLogout: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const baseOptions = authMutationOptions.logout(dataSource);

    return useMutation({
      ...baseOptions,
      onSuccess: (result, variables, context) => {
        // Repository-specific cache logic
        // Clear all auth-related queries
        queryClient.removeQueries({ queryKey: authQueryKeys.all });

        // Projects should implement their own token cleanup

        // Call user's onSuccess if provided
        options?.onSuccess?.(result, variables, context);
      },
      ...options,
    });
  },

  /**
   * Hook to refresh token
   * Uses mutationOptions for consistency
   */
  useRefreshToken: (dataSource = 'http', options) => {
    const baseOptions = authMutationOptions.refreshToken(dataSource);

    return useMutation({
      ...baseOptions,
      onSuccess: (refreshResponse, variables, context) => {
        // Repository-specific cache logic
        // Projects should implement their own token update logic

        // Call user's onSuccess if provided
        options?.onSuccess?.(refreshResponse, variables, context);
      },
      ...options,
    });
  },
};
