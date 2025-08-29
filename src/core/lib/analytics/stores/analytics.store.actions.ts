import { useAnalyticsStore } from './analytics.store';
import type { AnalyticsActions } from './analytics.store.types';

/**
 * Analytics Store Actions
 * Direct access to store actions without hooks
 */

/**
 * Set analytics initialization status
 * Used by Analytics.ts after successful initialization
 */
export const setAnalyticsInitialized = (initialized: boolean) => {
  useAnalyticsStore.getState().actions.setInitialized(initialized);
};

/**
 * Reset analytics store state
 * Used by Analytics.ts after successful mixpanel reset
 */
export const resetAnalyticsState = () => {
  useAnalyticsStore.getState().actions.reset();
};

/**
 * Custom hook that returns only the actions from the analytics store
 */
export const useAnalyticsActions = (): AnalyticsActions => useAnalyticsStore((state) => state.actions);
