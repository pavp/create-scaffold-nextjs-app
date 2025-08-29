import { useAnalyticsStore } from '../../stores/analytics.store';

/**
 * Selector to get analytics initialization status
 */
export const useAnalyticsInitializedSelector = () => {
  const initialized = useAnalyticsStore((state) => state.initialized);

  return { initialized };
};
