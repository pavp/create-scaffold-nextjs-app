import mixpanel from 'mixpanel-browser';

import { AnalyticsInterface } from './types';

let isEnabled = false;

const analytics: AnalyticsInterface = {
  init(apiKey) {
    isEnabled = Boolean(apiKey);

    if (isEnabled) {
      mixpanel.init(apiKey);
    }
  },

  trackEvent(eventName, data) {
    if (isEnabled) {
      mixpanel.track(eventName, data);
    }
  },

  identifyUser(data) {
    if (isEnabled) {
      mixpanel.register({
        DealerGroup: data.appName,
      });
      mixpanel.identify(data.customUserId || data.id);
      mixpanel.people.set({
        id: data.id,
        username: data.username,
        DealerGroup: data.appName,
      });

      this.trackEvent('Login');
    }
  },

  reset() {
    if (isEnabled) {
      mixpanel.reset();
    }
  },
};

export default analytics;
