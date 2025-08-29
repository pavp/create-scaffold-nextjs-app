import { faker } from '@faker-js/faker';

import type { AuthCredentials, AuthLoginResponse, AuthSession } from '@/modules/auth/auth.types';

// === AUTH MOCK FACTORIES ===

/**
 * Creates mock auth credentials with faker-generated data
 * @param overrides - Partial AuthCredentials object to override default faker values
 * @returns Complete AuthCredentials object
 */
export const createMockAuthCredentials = (overrides: Partial<AuthCredentials> = {}): AuthCredentials => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 12 }),
  ...overrides,
});

/**
 * Creates mock auth session with faker-generated data
 * @param overrides - Partial AuthSession object to override default faker values
 * @returns Complete AuthSession object
 */
export const createMockAuthSession = (overrides: Partial<AuthSession> = {}): AuthSession => {
  const futureDate = new Date();

  futureDate.setHours(futureDate.getHours() + 24); // Default 24 hours from now

  return {
    token: faker.string.alphanumeric(32),
    expirationDate: futureDate.toISOString(),
    isAuthenticated: true,
    ...overrides,
  };
};

/**
 * Creates mock auth login response with faker-generated data
 * @param overrides - Partial AuthLoginResponse object to override default faker values
 * @returns Complete AuthLoginResponse object
 */
export const createMockAuthLoginResponse = (overrides: Partial<AuthLoginResponse> = {}): AuthLoginResponse => {
  const futureDate = new Date();

  futureDate.setHours(futureDate.getHours() + 24); // Default 24 hours from now

  return {
    token: faker.string.alphanumeric(32),
    expirationDate: futureDate.toISOString(),
    user: {
      id: faker.number.int({ min: 1, max: 10000 }),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(['admin', 'user', 'moderator']),
    },
    ...overrides,
  };
};

/**
 * Creates an expired auth session for testing expired scenarios
 * @param overrides - Partial AuthSession object to override default values
 * @returns AuthSession with expired date
 */
export const createMockExpiredAuthSession = (overrides: Partial<AuthSession> = {}): AuthSession => {
  const pastDate = new Date();

  pastDate.setHours(pastDate.getHours() - 24); // 24 hours ago

  return createMockAuthSession({
    expirationDate: pastDate.toISOString(),
    isAuthenticated: false,
    ...overrides,
  });
};

/**
 * Creates multiple mock auth credentials for testing
 * @param count - Number of mock credentials to create
 * @param baseOverrides - Base overrides to apply to all credentials
 * @returns Array of AuthCredentials objects
 */
export const createMockAuthCredentialsList = (
  count: number,
  baseOverrides: Partial<AuthCredentials> = {},
): AuthCredentials[] =>
  Array.from({ length: count }, (_, index) =>
    createMockAuthCredentials({
      ...baseOverrides,
      email: `user${index + 1}@${faker.internet.domainName()}`,
    }),
  );

/**
 * Creates mock validation response
 * @param valid - Whether the validation should be valid or not
 * @returns Validation response object
 */
export const createMockAuthValidationResponse = (valid: boolean = true) => ({
  valid,
});
