/**
 * Configuration parameters for feedback initialization
 */
export interface UseInitFeedbackParams {
  /** Screeb website ID */
  websiteId: string;
  /** User ID for identification */
  userId: string;
  /** Whether feedback should be enabled */
  enabled?: boolean;
  /** Custom user ID prefix/suffix for encryption */
  userIdTransform?: (userId: string, appName?: string) => string;
  /** Optional app name for user ID transformation */
  appName?: string;
}
