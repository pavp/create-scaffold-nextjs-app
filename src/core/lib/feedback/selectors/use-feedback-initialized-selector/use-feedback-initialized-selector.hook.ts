import { useFeedbackStore } from '../../stores/feedback.store';

/**
 * Selector to get feedback initialization status
 */
export const useFeedbackInitializedSelector = () => {
  const initialized = useFeedbackStore((state) => state.initialized);

  return { initialized };
};
