import type { ANALYTICS_EVENTS } from './events/analytics-events';

/**
 * Generic Analytics Types
 *
 * These types are framework-agnostic and can be used with any analytics provider.
 * Project-specific events and properties should be defined in the events/ folder.
 */

/**
 * Utility types for extracting event names from ANALYTICS_EVENTS
 */
type AnalyticsEventsValues<T> = T extends Record<string, infer U> ? U : never;
type AnalyticsEventCategories = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Type for analytics event names from centralized events
 */
export type AnalyticsEventName = AnalyticsEventsValues<AnalyticsEventCategories>;

/**
 * Generic parameters for tracking events
 */
export interface TrackEventParams {
  event: AnalyticsEventName | string;
  properties?: Record<string, any>;
}

/**
 * Generic analytics user interface with common optional properties
 * Projects can use this directly or extend it with additional properties
 */
export interface AnalyticsUser {
  /** Required: Unique user identifier */
  id: string;
  /** Optional: Alternative user ID for analytics (e.g., encrypted ID) */
  customUserId?: string;
  /** Optional: User display name or username */
  username?: string;
  /** Optional: Application or organization name */
  appName?: string;
  /** Allow any additional properties per project */
  [key: string]: any;
}

/**
 * Configuration options for analytics initialization
 */
export interface AnalyticsConfig {
  apiKey: string;
  enabled?: boolean;
  debug?: boolean;
  [key: string]: any; // Allow additional config options
}

/**
 * Generic Analytics Interface
 *
 * This interface defines the contract for any analytics provider.
 * Implementation details are handled by the specific provider (e.g., Mixpanel, GA4, etc.)
 */
export interface AnalyticsInterface {
  /**
   * Initialize the analytics provider with configuration
   */
  init(apiKey: string, config?: Partial<AnalyticsConfig>): void;

  /**
   * Identify a user for tracking
   * Accepts any object with at least an id property
   */
  identifyUser(userData: AnalyticsUser): void;

  /**
   * Track a custom event with optional properties
   */
  trackEvent(event: AnalyticsEventName, properties?: Record<string, any>): void;

  /**
   * Reset analytics state (useful for logout)
   */
  reset(): void;
}
