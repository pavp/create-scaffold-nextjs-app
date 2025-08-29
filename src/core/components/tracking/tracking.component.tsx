'use client';

import React, { PropsWithChildren } from 'react';

import { useInitAnalytics } from '@/hooks/use-init-analytics/use-init-analytics.hook';
import { useInitFeedback } from '@/hooks/use-init-feedback/use-init-feedback.hook';
import { useMixpanelApiKeySelector, useScreebWebsiteIdSelector } from '@/shared/settings/selectors';

/**
 * Tracking Component - Template Example Usage
 *
 * This component demonstrates how to use the new template-friendly
 * initialization hooks with project-specific user data.
 *
 * TEMPLATE NOTE: Replace this with your own user data source.
 * Each project should provide their own user identification strategy.
 */
const Tracking = ({ children }: PropsWithChildren) => {
  // Get settings (project-specific)
  const { mixpanelApiKey } = useMixpanelApiKeySelector();
  const { screebWebsiteId } = useScreebWebsiteIdSelector();

  // Template placeholder - Replace with your project's user data source
  const user = {
    id: '',
    username: '',
    applicationName: '',
  };

  // Initialize Analytics with project-specific user data
  useInitAnalytics({
    apiKey: mixpanelApiKey || '',
    user: {
      id: user.id,
      username: user.username,
      appName: user.applicationName,
    },
    enabled: !!mixpanelApiKey && !!user.id,
  });

  // Initialize Feedback with project-specific user data
  useInitFeedback({
    websiteId: screebWebsiteId || '',
    userId: user.id,
    appName: user.applicationName,
    enabled: !!screebWebsiteId && !!user.id,
  });

  return <>{children}</>;
};

const MemoizedTracking = React.memo(Tracking);

export { MemoizedTracking as Tracking };
