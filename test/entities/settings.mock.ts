import { faker } from '@faker-js/faker';

import type { SettingsResponse } from '@/shared/settings/settings.types';

// === CORE SETTINGS MOCK FACTORIES ===

/**
 * Creates a mock SettingsResponse object with faker-generated data
 * @param overrides - Partial SettingsResponse object to override default faker values
 * @returns Complete SettingsResponse object
 */
export const createMockSettings = (overrides: Partial<SettingsResponse> = {}): SettingsResponse => ({
  mixPanelKey: faker.string.alphanumeric({ length: 32 }),
  screeb_website_id: faker.string.alphanumeric({ length: 24 }),
  muiKey: faker.string.alphanumeric({ length: 40 }),
  ...overrides,
});

// === SPECIALIZED SETTINGS FACTORIES ===

/**
 * Creates settings with empty MUI key (allowed by backend)
 */
export const createMockSettingsWithEmptyMui = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({
    muiKey: '',
    ...overrides,
  });

/**
 * Creates settings with realistic API keys
 */
export const createMockSettingsRealistic = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({
    mixPanelKey: `mp_${faker.string.alphanumeric({ length: 28 })}`,
    screeb_website_id: `screeb_${faker.string.alphanumeric({ length: 18 })}`,
    muiKey: `mui_${faker.string.alphanumeric({ length: 35 })}`,
    ...overrides,
  });

/**
 * Creates settings with minimal/test values
 */
export const createMockSettingsMinimal = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({
    mixPanelKey: 'test_mixpanel_key',
    screeb_website_id: 'test_screeb_id',
    muiKey: 'test_mui_key',
    ...overrides,
  });

/**
 * Creates settings for development environment
 */
export const createMockSettingsDev = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({
    mixPanelKey: 'dev_mp_key_12345',
    screeb_website_id: 'dev_screeb_67890',
    muiKey: 'dev_mui_key_abcdef',
    ...overrides,
  });

/**
 * Creates settings for production-like environment
 */
export const createMockSettingsProduction = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({
    mixPanelKey: faker.string.alphanumeric({ length: 32 }),
    screeb_website_id: faker.string.uuid(),
    muiKey: faker.string.alphanumeric({ length: 64 }),
    ...overrides,
  });

// === SCENARIO-BASED FACTORIES ===

/**
 * Creates settings for testing different key lengths
 * Returns array with different key length scenarios
 */
export const createMockSettingsForKeyLengths = (): SettingsResponse[] => [
  createMockSettings({
    mixPanelKey: faker.string.alphanumeric({ length: 16 }), // Short key
    screeb_website_id: faker.string.alphanumeric({ length: 12 }),
    muiKey: faker.string.alphanumeric({ length: 20 }),
  }),
  createMockSettings({
    mixPanelKey: faker.string.alphanumeric({ length: 32 }), // Standard key
    screeb_website_id: faker.string.alphanumeric({ length: 24 }),
    muiKey: faker.string.alphanumeric({ length: 40 }),
  }),
  createMockSettings({
    mixPanelKey: faker.string.alphanumeric({ length: 64 }), // Long key
    screeb_website_id: faker.string.alphanumeric({ length: 48 }),
    muiKey: faker.string.alphanumeric({ length: 80 }),
  }),
];

/**
 * Creates settings for testing empty/missing values
 */
export const createMockSettingsForEmptyValues = (): SettingsResponse[] => [
  createMockSettingsWithEmptyMui(), // Empty MUI key only
  createMockSettings({
    mixPanelKey: faker.string.alphanumeric({ length: 32 }),
    screeb_website_id: faker.string.alphanumeric({ length: 24 }),
    muiKey: '', // Empty MUI key
  }),
];

// === DETERMINISTIC FACTORIES (FOR CONSISTENT TESTS) ===

/**
 * Creates deterministic settings data for consistent testing
 * Uses fixed seeds to ensure reproducible results
 */
export const createDeterministicSettings = (
  seed: number,
  overrides: Partial<SettingsResponse> = {},
): SettingsResponse => {
  faker.seed(seed);
  const settings = createMockSettings(overrides);

  faker.seed(); // Reset seed

  return settings;
};

/**
 * Creates a predefined settings object for stable tests
 */
export const createStableSettings = (overrides: Partial<SettingsResponse> = {}): SettingsResponse => ({
  mixPanelKey: 'stable_mixpanel_key_123456789012345',
  screeb_website_id: 'stable_screeb_id_abcdef',
  muiKey: 'stable_mui_key_xyz789',
  ...overrides,
});

// === ERROR SCENARIO FACTORIES ===

/**
 * Creates invalid settings for error testing
 * Note: These would fail Zod validation
 */
export const createInvalidSettingsForTesting = () => ({
  // Missing required fields
  incomplete: {},

  // Wrong types (for testing runtime validation)
  wrongTypes: {
    mixPanelKey: 123,
    screeb_website_id: null,
    muiKey: undefined,
  },

  // Extra fields (should be stripped by Zod)
  extraFields: {
    mixPanelKey: 'valid_key',
    screeb_website_id: 'valid_id',
    muiKey: 'valid_mui',
    extraField: 'should_be_stripped',
    anotherExtra: 42,
  },
});

// === STORE STATE FACTORIES ===

/**
 * Creates mock store state with settings
 */
export const createMockSettingsStoreState = (settings: SettingsResponse | null = null) => ({
  settings: settings || createMockSettings(),
});

/**
 * Creates empty store state
 */
export const createEmptySettingsStoreState = () => ({
  settings: null,
});
