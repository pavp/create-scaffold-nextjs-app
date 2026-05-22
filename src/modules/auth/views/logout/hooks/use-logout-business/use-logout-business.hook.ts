'use client';

import { useCallback } from 'react';

import { authRepository } from '@/modules/auth/repositories/auth';
import { useAuthStatusSelector } from '@/modules/auth/selectors';
import { useAuthActions } from '@/modules/auth/stores/auth.store.actions';

/**
 * Logout Business Logic Hook
 *
 * Handles logout-specific business operations.
 * Uses repository mutations for API calls and store actions for state management.
 */
export const useLogoutBusiness = () => {
  const { isAuthenticated } = useAuthStatusSelector();
  const { clearSession } = useAuthActions();

  // Use actual repository mutation
  const logoutMutation = authRepository.mutations.useLogout();
  const { mutateAsync: logoutAsync } = logoutMutation;

  const logout = useCallback(async () => {
    try {
      // Use real repository mutation
      await logoutAsync();

      // Clear session after successful logout
      clearSession();
    } catch {
      // Clear session even on error for security
      clearSession();
    }
  }, [logoutAsync, clearSession]);

  return {
    logout,
    isAuthenticated,
  };
};
