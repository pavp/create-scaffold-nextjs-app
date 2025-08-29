/**
 * Configuration parameters for analytics initialization
 */
export interface UseInitAnalyticsParams {
  /** Mixpanel API key */
  apiKey: string;
  /** User data for identification */
  user: {
    id: string;
    username?: string;
    appName?: string;
    [key: string]: any; // Allow additional user properties
  };
  /** Whether analytics should be enabled */
  enabled?: boolean;
  /** Custom user ID prefix/suffix for encryption */
  userIdTransform?: (userId: string, appName?: string) => string;
}
