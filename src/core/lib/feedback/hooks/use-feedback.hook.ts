import { useEffect, useMemo } from 'react';

import { config } from '@/config';
import { encryptString } from '@/core/helpers';
import { useScreebWebsiteIdSelector } from '@/shared/settings/selectors';

import Feedback from '../feedback';
import type { UseFeedback } from '../feedback.types';
import { useFeedbackInitializedSelector } from '../selectors/use-feedback-initialized-selector/use-feedback-initialized-selector.hook';

const appName = config.appName;

/**
 * Feedback Hook - Handles Screeb initialization and management
 * Simplified: only triggers initialization, Feedback.ts handles state updates
 */
export const useFeedback = (): UseFeedback => {
  const { initialized } = useFeedbackInitializedSelector();

  // Dependencies
  const { screebWebsiteId } = useScreebWebsiteIdSelector();

  // Template placeholder - Replace with your project's user data
  const user = { id: '' };

  // Create encrypted user ID
  const userId = useMemo(() => {
    const userId = `${user.id}@${appName}`;

    return encryptString(userId);
  }, [user.id]);

  // Initialize Feedback when ready
  useEffect(() => {
    if (!initialized && screebWebsiteId && screebWebsiteId.length > 0) {
      Feedback.init(screebWebsiteId, userId).catch(() => {
        // Feedback initialization failed silently
      });
    }
  }, [initialized, screebWebsiteId, userId]);

  return {
    initialized,
  };
};
