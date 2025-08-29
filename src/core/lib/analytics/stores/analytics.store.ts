import type { Draft } from 'immer';

import { createStoreWithMiddleware } from '@/core/lib/zustand';

import type { AnalyticsState, AnalyticsStoreState } from './analytics.store.types';

// Initial state
export const initialAnalyticsState: AnalyticsState = {
  initialized: false,
};

export const useAnalyticsStore = createStoreWithMiddleware<AnalyticsStoreState>(
  (set, _get) => ({
    ...initialAnalyticsState,
    actions: {
      setInitialized: (initialized: boolean) =>
        set((draft: Draft<AnalyticsStoreState>) => {
          draft.initialized = initialized;
        }),

      reset: () =>
        set((draft: Draft<AnalyticsStoreState>) => {
          draft.initialized = false;
        }),
    },
  }),
  'analytics-store',
  {
    persist: false, // Analytics state should not persist
    exclude: [],
  },
);
