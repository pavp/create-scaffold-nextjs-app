import { useEffect, useMemo } from 'react';

import { encryptString } from '@/core/helpers';
import Feedback from '@/core/lib/feedback/feedback';
import { useFeedbackInitializedSelector } from '@/core/lib/feedback/selectors/use-feedback-initialized-selector/use-feedback-initialized-selector.hook';

import { UseInitFeedbackParams } from './use-init-feedback.types';

/**
 * Hook for initializing Feedback (Screeb) in a template-friendly way
 *
 * This hook removes hardcoded user store dependencies and accepts user data as parameters.
 * Each project can provide their own user identification strategy.
 *
 * @param params - Configuration for feedback initialization
 * @returns Object with initialization status
 *
 * @example
 * ```typescript
 * // In your app root component
 * const { screebWebsiteId } = useSettings();
 * const user = useYourProjectUserHook(); // Project-specific user hook
 *
 * useInitFeedback({
 *   websiteId: screebWebsiteId,
 *   userId: user.id,
 *   appName: 'MyApp',
 *   enabled: !!screebWebsiteId
 * });
 * ```
 */
export const useInitFeedback = (params: UseInitFeedbackParams) => {
  const { websiteId, userId, enabled = true, userIdTransform, appName } = params;
  const { initialized } = useFeedbackInitializedSelector();

  // Create encrypted user ID (with optional transformation)
  const encryptedUserId = useMemo(() => {
    if (userIdTransform) {
      return userIdTransform(userId, appName);
    }

    // Default transformation: encrypt user ID with app name
    if (appName) {
      const fullUserId = `${userId}@${appName}`;

      return encryptString(fullUserId);
    }

    return encryptString(userId);
  }, [userId, appName, userIdTransform]);

  // Initialize Feedback when ready
  useEffect(() => {
    if (!initialized && enabled && websiteId && websiteId.length > 0 && userId) {
      Feedback.init(websiteId, encryptedUserId).catch(() => {
        // Feedback initialization failed silently
      });
    }
  }, [initialized, enabled, websiteId, encryptedUserId, userId]);

  return {
    initialized,
    enabled: enabled && !!websiteId,
  };
};
