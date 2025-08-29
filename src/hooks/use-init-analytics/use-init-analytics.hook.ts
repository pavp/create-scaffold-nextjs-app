import { useEffect, useMemo } from 'react';

import { encryptString } from '@/core/helpers';
import Analytics from '@/core/lib/analytics/analytics';
import type { AnalyticsUser } from '@/core/lib/analytics/analytics.types';
import { useAnalyticsInitializedSelector } from '@/core/lib/analytics/selectors/use-analytics-initialized-selector/use-analytics-initialized-selector.hook';

import { UseInitAnalyticsParams } from './use-init-analytics.types';

/**
 * Hook for initializing Analytics (Mixpanel) in a template-friendly way
 *
 * This hook removes hardcoded user store dependencies and accepts user data as parameters.
 * Each project can provide their own user data structure.
 *
 * @param params - Configuration for analytics initialization
 * @returns Object with initialization status
 *
 * @example
 * ```typescript
 * // In your app root component
 * const { mixpanelApiKey } = useSettings();
 * const user = useYourProjectUserHook(); // Project-specific user hook
 *
 * useInitAnalytics({
 *   apiKey: mixpanelApiKey,
 *   user: {
 *     id: user.id,
 *     username: user.name,
 *     appName: 'MyApp'
 *   },
 *   enabled: !!mixpanelApiKey
 * });
 * ```
 */
export const useInitAnalytics = (params: UseInitAnalyticsParams) => {
  const { apiKey, user, enabled = true, userIdTransform } = params;
  const { initialized } = useAnalyticsInitializedSelector();

  // Create user ID (with optional transformation)
  const analyticsUserId = useMemo(() => {
    if (userIdTransform) {
      return userIdTransform(user.id, user.appName);
    }

    // Default transformation: encrypt user ID with app name
    if (user.appName) {
      const userId = `${user.id}@${user.appName}`;

      return encryptString(userId);
    }

    return encryptString(user.id);
  }, [user.id, user.appName, userIdTransform]);

  // Initialize Analytics when ready
  useEffect(() => {
    if (!initialized && enabled && apiKey && apiKey.length > 0 && user.id) {
      try {
        // Initialize analytics
        Analytics.init(apiKey);

        // Prepare user data for identification (generic approach)
        const analyticsUser: AnalyticsUser = {
          id: user.id,
          customUserId: analyticsUserId,
          // Include all additional user properties dynamically
          ...Object.keys(user).reduce(
            (acc, key) => {
              if (key !== 'id') {
                // Exclude id as it's already set
                acc[key] = user[key];
              }

              return acc;
            },
            {} as Record<string, any>,
          ),
        };

        // Identify user
        Analytics.identifyUser(analyticsUser);
      } catch {
        // Analytics initialization failed silently
      }
    }
  }, [initialized, enabled, apiKey, user, analyticsUserId]);

  return {
    initialized,
    enabled: enabled && !!apiKey,
  };
};
