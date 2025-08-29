import type { Draft } from 'immer';

import { createStoreWithMiddleware } from '@/core/lib/zustand';

import type { FeedbackState, FeedbackStoreState } from './feedback.store.types';

// Initial state
export const initialFeedbackState: FeedbackState = {
  initialized: false,
};

export const useFeedbackStore = createStoreWithMiddleware<FeedbackStoreState>(
  (set, _get) => ({
    ...initialFeedbackState,
    actions: {
      setInitialized: (initialized: boolean) =>
        set((draft: Draft<FeedbackStoreState>) => {
          draft.initialized = initialized;
        }),

      reset: () =>
        set((draft: Draft<FeedbackStoreState>) => {
          draft.initialized = false;
        }),
    },
  }),
  'feedback-store',
  {
    persist: false, // Feedback state should not persist
    exclude: [],
  },
);
