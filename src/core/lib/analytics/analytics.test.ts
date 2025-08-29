import mixpanel from 'mixpanel-browser';

import { ANALYTICS_EVENTS } from './events/analytics-events';
import Analytics from './analytics';

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
      expect(mixpanel.init).toHaveBeenCalledWith('valid-api-key', undefined);
    });

    it('should initialize mixpanel with config when provided', () => {
      const config = { debug: true };

      Analytics.init('valid-api-key', config);
      expect(mixpanel.init).toHaveBeenCalledWith('valid-api-key', config);
    });

    it('should not initialize mixpanel when provided with an empty API key', () => {
      Analytics.init('');
      expect(mixpanel.init).not.toHaveBeenCalled();
    });
  });

  describe('trackEvent', () => {
    it('should track an event if enabled', () => {
      Analytics.init('valid-api-key');
      Analytics.trackEvent(ANALYTICS_EVENTS.USER.LOGIN, { method: 'email' });
      expect(mixpanel.track).toHaveBeenCalledWith(ANALYTICS_EVENTS.USER.LOGIN, { method: 'email' });
    });

    it('should track an event without properties if enabled', () => {
      Analytics.init('valid-api-key');
      Analytics.trackEvent(ANALYTICS_EVENTS.USER.LOGOUT);
      expect(mixpanel.track).toHaveBeenCalledWith(ANALYTICS_EVENTS.USER.LOGOUT, undefined);
    });

    it('should not track an event if not enabled', () => {
      Analytics.init('');
      Analytics.trackEvent(ANALYTICS_EVENTS.USER.LOGIN);
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  describe('identifyUser', () => {
    const userData = {
      appName: 'TestApp',
      customUserId: 'custom123',
      id: 'user123',
      username: 'testuser',
    };

    it('should identify the user if enabled', () => {
      Analytics.init('valid-api-key');
      Analytics.identifyUser(userData);
      expect(mixpanel.register).toHaveBeenCalledWith({ appName: userData.appName });
      expect(mixpanel.identify).toHaveBeenCalledWith(userData.customUserId);
      expect(mixpanel.people.set).toHaveBeenCalledWith({
        id: userData.id,
        username: userData.username,
        appName: userData.appName,
      });
    });

    it('should identify the user if enabled and customUserId does not exist', () => {
      const { id, username, appName } = userData;

      Analytics.init('valid-api-key');
      Analytics.identifyUser({ id, username, appName });
      expect(mixpanel.register).toHaveBeenCalledWith({ appName });
      expect(mixpanel.identify).toHaveBeenCalledWith(id);
      expect(mixpanel.people.set).toHaveBeenCalledWith({
        id,
        username,
        appName,
      });
    });

    it('should handle user data without appName', () => {
      const { id, username, customUserId } = userData;

      Analytics.init('valid-api-key');
      Analytics.identifyUser({ id, username, customUserId });
      expect(mixpanel.register).not.toHaveBeenCalled();
      expect(mixpanel.identify).toHaveBeenCalledWith(customUserId);
      expect(mixpanel.people.set).toHaveBeenCalledWith({
        id,
        username,
      });
    });

    it('should include additional custom properties', () => {
      const userWithCustomProps = {
        ...userData,
        role: 'admin',
        department: 'IT',
      };

      Analytics.init('valid-api-key');
      Analytics.identifyUser(userWithCustomProps);
      expect(mixpanel.people.set).toHaveBeenCalledWith({
        id: userWithCustomProps.id,
        username: userWithCustomProps.username,
        appName: userWithCustomProps.appName,
        role: userWithCustomProps.role,
        department: userWithCustomProps.department,
      });
    });

    it('should not identify the user if not enabled', () => {
      Analytics.init('');
      Analytics.identifyUser(userData);
      expect(mixpanel.register).not.toHaveBeenCalled();
      expect(mixpanel.identify).not.toHaveBeenCalled();
      expect(mixpanel.people.set).not.toHaveBeenCalled();
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
