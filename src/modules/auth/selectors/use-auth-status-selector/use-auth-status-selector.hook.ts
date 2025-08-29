import { useAuthStore } from '@/modules/auth/stores/auth.store';

/**
 * Auth Status Selector Hook
 *
 * Provides access to authentication status and loading states.
 * Use this hook to access loading state and errors.
 */
export const useAuthStatusSelector = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    isAuthenticated,
  };
};
