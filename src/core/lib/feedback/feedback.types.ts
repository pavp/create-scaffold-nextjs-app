/**
 * Feedback system types and interfaces
 */

export interface FeedbackConfig {
  websiteId: string;
  userId: string;
}

export interface FeedbackState {
  initialized: boolean;
}

export interface UseFeedback extends FeedbackState {}
