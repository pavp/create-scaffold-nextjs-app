'use client';

import { useCallback } from 'react';

import type { AuthCredentials } from '@/modules/auth/auth.types';
import { authRepository } from '@/modules/auth/repositories/auth';
import { useAuthActions } from '@/modules/auth/stores/auth.store.actions';

/**
 * Login Business Logic Hook
 *
 * Handles login-specific business operations using auth mutations.
 * Uses repository mutations for API calls and store actions for state management.
 */
export const useLoginBusiness = () => {
  const { setSession } = useAuthActions();

  // Use actual repository mutation
  const loginMutation = authRepository.mutations.useLogin();
  const { mutateAsync: loginAsync, isPending: isLoading, error } = loginMutation;

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      // Use real repository mutation
      const response = await loginAsync(credentials);

      // Update session in store after successful login
      setSession({
        token: response.token,
        expirationDate: response.expirationDate,
        isAuthenticated: true,
      });
    },
    [loginAsync, setSession],
  );

  return {
    login,
    isLoading,
    error,
  };
};
