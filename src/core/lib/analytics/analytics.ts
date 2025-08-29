import mixpanel from 'mixpanel-browser';

import { resetAnalyticsState, setAnalyticsInitialized } from './stores/analytics.store.actions';
import { AnalyticsInterface } from './analytics.types';

let isEnabled = false;

const analytics: AnalyticsInterface = {
  init(apiKey, config) {
    isEnabled = Boolean(apiKey);

    if (isEnabled) {
      try {
        mixpanel.init(apiKey, config);
        setAnalyticsInitialized(true);
      } catch {
        // Analytics initialization failed silently
      }
    }
  },

  trackEvent(event, properties) {
    if (isEnabled) {
      mixpanel.track(event, properties);
    }
  },

  identifyUser(userData) {
    if (isEnabled) {
      try {
        // Type-safe way to check for optional properties
        const hasAppName = 'appName' in userData && userData.appName;
        const hasUsername = 'username' in userData && userData.username;

        // Register global properties if appName is provided
        if (hasAppName) {
          mixpanel.register({
            appName: userData.appName,
          });
        }

        // Identify user
        mixpanel.identify(userData.customUserId || userData.id);

        // Set user properties - start with required id
        const userProperties: Record<string, any> = {
          id: userData.id,
        };

        // Add optional common properties if they exist
        if (hasUsername) userProperties.username = userData.username;
        if (hasAppName) userProperties.appName = userData.appName;

        // Add any additional custom properties
        Object.keys(userData).forEach((key) => {
          if (!['id', 'username', 'appName', 'customUserId'].includes(key)) {
            userProperties[key] = userData[key];
          }
        });

        mixpanel.people.set(userProperties);
      } catch {
        // User identification failed silently
      }
    }
  },

  reset() {
    if (isEnabled) {
      try {
        mixpanel.reset();
        // Update store state after successful reset
        resetAnalyticsState();
      } catch {
        // Analytics reset failed silently
      }
    }
  },
};

export default analytics;
