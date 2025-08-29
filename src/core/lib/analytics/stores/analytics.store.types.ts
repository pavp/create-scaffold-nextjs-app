/**
 * Analytics Store Types
 */

export interface AnalyticsState {
  initialized: boolean;
}

export interface AnalyticsActions {
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export type AnalyticsStoreState = AnalyticsState & {
  actions: AnalyticsActions;
};
