/**
 * Feedback Store Types
 */

export interface FeedbackState {
  initialized: boolean;
}

export interface FeedbackActions {
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export type FeedbackStoreState = FeedbackState & {
  actions: FeedbackActions;
};
