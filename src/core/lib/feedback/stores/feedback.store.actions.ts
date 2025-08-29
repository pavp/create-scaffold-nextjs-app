import { useFeedbackStore } from './feedback.store';
import type { FeedbackActions } from './feedback.store.types';

/**
 * Feedback Store Actions
 * Direct access to store actions without hooks
 */

/**
 * Set feedback initialization status
 * Used by Feedback.ts after successful initialization
 */
export const setFeedbackInitialized = (initialized: boolean) => {
  useFeedbackStore.getState().actions.setInitialized(initialized);
};

/**
 * Reset feedback store state
 * Used by Feedback.ts after successful service reset
 */
export const resetFeedbackState = () => {
  useFeedbackStore.getState().actions.reset();
};

/**
 * Custom hook that returns only the actions from the feedback store
 */
export const useFeedbackActions = (): FeedbackActions => useFeedbackStore((state) => state.actions);
