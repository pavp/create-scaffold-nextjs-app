import { useAuthStore } from '@/modules/auth/stores/auth.store';

/**
 * Auth Token Selector Hook
 *
 * Returns the current auth token from the store.
 * Optimized for token access in interceptors and auth checks.
 */
export const useAuthTokenSelector = () => {
  return useAuthStore((state) => state.token);
};

/**
 * Get Auth Token (Non-hook version)
 *
 * Returns the current auth token without using React hooks.
 * Suitable for use in axios interceptors, middleware, or other non-React contexts.
 */
export const getAuthToken = () => {
  return useAuthStore.getState().token;
};
