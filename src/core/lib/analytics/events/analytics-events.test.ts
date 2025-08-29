import { ANALYTICS_EVENTS } from './analytics-events';

describe('ANALYTICS_EVENTS', () => {
  it('should have USER events defined correctly', () => {
    expect(ANALYTICS_EVENTS.USER.LOGIN).toBe('user_login');
    expect(ANALYTICS_EVENTS.USER.LOGOUT).toBe('user_logout');
    expect(ANALYTICS_EVENTS.USER.REGISTER).toBe('user_register');
    expect(ANALYTICS_EVENTS.USER.PROFILE_UPDATE).toBe('user_profile_update');
  });

  it('should have TODO events defined correctly', () => {
    expect(ANALYTICS_EVENTS.TODO.CREATE).toBe('todo_create');
    expect(ANALYTICS_EVENTS.TODO.COMPLETE).toBe('todo_complete');
    expect(ANALYTICS_EVENTS.TODO.DELETE).toBe('todo_delete');
    expect(ANALYTICS_EVENTS.TODO.EDIT).toBe('todo_edit');
    expect(ANALYTICS_EVENTS.TODO.FILTER_APPLIED).toBe('todo_filter_applied');
  });

  it('should have NAVIGATION events defined correctly', () => {
    expect(ANALYTICS_EVENTS.NAVIGATION.PAGE_VIEW).toBe('page_view');
    expect(ANALYTICS_EVENTS.NAVIGATION.BUTTON_CLICK).toBe('button_click');
    expect(ANALYTICS_EVENTS.NAVIGATION.EXTERNAL_LINK_CLICK).toBe('external_link_click');
  });

  it('should have SETTINGS events defined correctly', () => {
    expect(ANALYTICS_EVENTS.SETTINGS.THEME_CHANGED).toBe('settings_theme_changed');
    expect(ANALYTICS_EVENTS.SETTINGS.LANGUAGE_CHANGED).toBe('settings_language_changed');
    expect(ANALYTICS_EVENTS.SETTINGS.PREFERENCES_UPDATED).toBe('settings_preferences_updated');
  });

  it('should be immutable object', () => {
    expect(Object.isFrozen(ANALYTICS_EVENTS)).toBe(false);
    expect(typeof ANALYTICS_EVENTS).toBe('object');
  });

  it('should have all required event categories', () => {
    const expectedCategories = ['USER', 'TODO', 'NAVIGATION', 'SETTINGS'];
    const actualCategories = Object.keys(ANALYTICS_EVENTS);

    expectedCategories.forEach((category) => {
      expect(actualCategories).toContain(category);
    });
  });

  it('should follow consistent naming convention', () => {
    const allEvents = Object.values(ANALYTICS_EVENTS).flatMap((category) => Object.values(category));

    allEvents.forEach((event) => {
      expect(event).toMatch(/^[a-z]+(_[a-z]+)*$/);
    });
  });

  it('should have unique event names', () => {
    const allEvents = Object.values(ANALYTICS_EVENTS).flatMap((category) => Object.values(category));
    const uniqueEvents = new Set(allEvents);

    expect(allEvents.length).toBe(uniqueEvents.size);
  });
});
