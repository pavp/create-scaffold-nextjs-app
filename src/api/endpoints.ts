// Base API endpoints
export const endpoints = {
  // Todo endpoints
  TODO: {
    BASE: '/todos',
    BY_ID: (id: string | number) => `/todos/${id}`,
    TEST_ERRORS: '/todos/test-errors',
  },

  // Settings endpoints
  SETTINGS: {
    BASE: '/front-end-settings',
    TRANSLATION: '/core/i18n',
  },

  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VALIDATE: '/auth/validate',
  },
} as const;
