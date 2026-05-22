import { faker } from '@faker-js/faker';

import type { SettingsResponse } from '@/shared/settings/settings.types';

export const createMockSettings = (overrides: Partial<SettingsResponse> = {}): SettingsResponse => ({
  muiKey: faker.string.alphanumeric({ length: 40 }),
  ...overrides,
});

export const createMockSettingsWithEmptyMui = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({ muiKey: '', ...overrides });

export const createMockSettingsMinimal = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({ muiKey: 'test_mui_key', ...overrides });

export const createMockSettingsDev = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({ muiKey: 'dev_mui_key_abcdef', ...overrides });

export const createMockSettingsProduction = (overrides: Partial<SettingsResponse> = {}): SettingsResponse =>
  createMockSettings({ muiKey: faker.string.alphanumeric({ length: 64 }), ...overrides });

export const createMockSettingsForKeyLengths = (): SettingsResponse[] => [
  createMockSettings({ muiKey: faker.string.alphanumeric({ length: 20 }) }),
  createMockSettings({ muiKey: faker.string.alphanumeric({ length: 40 }) }),
  createMockSettings({ muiKey: faker.string.alphanumeric({ length: 80 }) }),
];

export const createMockSettingsForEmptyValues = (): SettingsResponse[] => [
  createMockSettingsWithEmptyMui(),
  createMockSettings({ muiKey: '' }),
];

export const createDeterministicSettings = (
  seed: number,
  overrides: Partial<SettingsResponse> = {},
): SettingsResponse => {
  faker.seed(seed);
  const settings = createMockSettings(overrides);

  faker.seed();

  return settings;
};

export const createStableSettings = (overrides: Partial<SettingsResponse> = {}): SettingsResponse => ({
  muiKey: 'stable_mui_key_xyz789',
  ...overrides,
});

export const createInvalidSettingsForTesting = () => ({
  incomplete: {},
  wrongTypes: { muiKey: undefined },
  extraFields: { muiKey: 'valid_mui', extraField: 'should_be_stripped' },
});

export const createMockSettingsStoreState = (settings: SettingsResponse | null = null) => ({
  settings: settings || createMockSettings(),
});

export const createEmptySettingsStoreState = () => ({ settings: null });
