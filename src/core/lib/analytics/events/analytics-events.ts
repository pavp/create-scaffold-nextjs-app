/**
 * Centralized Analytics Events - PROJECT EXAMPLE
 *
 * This file contains all analytics events used throughout the application.
 * Replace these events with your project-specific events.
 *
 * Pattern: CATEGORY.ACTION format for clear event organization
 */
export const ANALYTICS_EVENTS = {
  USER: {
    LOGIN: 'user_login',
    LOGOUT: 'user_logout',
    REGISTER: 'user_register',
    PROFILE_UPDATE: 'user_profile_update',
  },
  TODO: {
    CREATE: 'todo_create',
    COMPLETE: 'todo_complete',
    DELETE: 'todo_delete',
    EDIT: 'todo_edit',
    FILTER_APPLIED: 'todo_filter_applied',
  },
  NAVIGATION: {
    PAGE_VIEW: 'page_view',
    BUTTON_CLICK: 'button_click',
    EXTERNAL_LINK_CLICK: 'external_link_click',
  },
  SETTINGS: {
    THEME_CHANGED: 'settings_theme_changed',
    LANGUAGE_CHANGED: 'settings_language_changed',
    PREFERENCES_UPDATED: 'settings_preferences_updated',
  },
} as const;
