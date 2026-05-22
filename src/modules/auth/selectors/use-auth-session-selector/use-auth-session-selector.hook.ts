import { useShallow } from 'zustand/shallow';

import { useAuthStore } from '@/modules/auth/stores/auth.store';

/**
 * Auth Session Selector Hook
 *
 * Provides access to authentication session data.
 * Use this hook to access token, expiration, and session status.
 */
export const useAuthSessionSelector = () => {
  const { token, expirationDate, isAuthenticated, actions } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      expirationDate: state.expirationDate,
      isAuthenticated: state.isAuthenticated,
      actions: state.actions,
    })),
  );

  return {
    token,
    expirationDate,
    isAuthenticated,
    isSessionValid: actions.validateSession(),
    hasToken: Boolean(token),
    isExpired: expirationDate ? new Date() >= new Date(expirationDate) : true,
  };
};
