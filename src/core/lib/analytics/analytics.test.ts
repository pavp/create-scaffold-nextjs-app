import mixpanel from 'mixpanel-browser';

import Analytics from './analytics';
import { Events } from './types';

describe('Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('init', () => {
    it('should initialize mixpanel when provided with a valid API key', () => {
      Analytics.init('valid-api-key');
      expect(mixpanel.init).toHaveBeenCalledWith('valid-api-key');
    });

    it('should not initialize mixpanel when provided with an empty API key', () => {
      Analytics.init('');
      expect(mixpanel.init).not.toHaveBeenCalled();
    });
  });

  describe('track', () => {
    it('should track an event if enabled', () => {
      Analytics.init('valid-api-key');
      Analytics.trackEvent('Login');
      expect(mixpanel.track).toHaveBeenCalledWith(Events.Login, undefined);
    });

    it('should not track an event if not enabled', () => {
      Analytics.init('');
      Analytics.trackEvent('Login');
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  describe('identify', () => {
    const userData = {
      appName: 'TestApp',
      customUserId: 'custom123',
      id: 'user123',
      username: 'testuser',
    };

    it('should identify the user if enabled', () => {
      Analytics.init('valid-api-key');
      Analytics.identifyUser(userData);
      expect(mixpanel.register).toHaveBeenCalledWith({ DealerGroup: userData.appName });
      expect(mixpanel.identify).toHaveBeenCalledWith(userData.customUserId);
      expect(mixpanel.people.set).toHaveBeenCalledWith({
        id: userData.id,
        username: userData.username,
        DealerGroup: userData.appName,
      });
      expect(mixpanel.track).toHaveBeenCalledWith(Events.Login, undefined);
    });

    it('should identify the user if enabled and customUserId does not exist', () => {
      const { id, username, appName } = userData;

      Analytics.init('valid-api-key');
      Analytics.identifyUser({ id, username, appName });
      expect(mixpanel.register).toHaveBeenCalledWith({ DealerGroup: appName });
      expect(mixpanel.identify).toHaveBeenCalledWith(id);
      expect(mixpanel.people.set).toHaveBeenCalledWith({
        id,
        username,
        DealerGroup: appName,
      });
      expect(mixpanel.track).toHaveBeenCalledWith(Events.Login, undefined);
    });

    it('should not identify the user if not enabled', () => {
      Analytics.init('');
      Analytics.identifyUser(userData);
      expect(mixpanel.register).not.toHaveBeenCalled();
      expect(mixpanel.identify).not.toHaveBeenCalled();
      expect(mixpanel.people.set).not.toHaveBeenCalled();
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset mixpanel if enabled', () => {
      Analytics.init('valid-api-key');
      Analytics.reset();
      expect(mixpanel.reset).toHaveBeenCalled();
    });

    it('should not reset mixpanel if not enabled', () => {
      Analytics.init('');
      Analytics.reset();
      expect(mixpanel.reset).not.toHaveBeenCalled();
    });
  });
});
