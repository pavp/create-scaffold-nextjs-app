import { settingsQueryOptions } from './settings.query-options';
import { settingsQueryKeys } from './settings.repository.keys';
import { settingsQueriesRepository } from './settings.repository.queries';
import type { SettingsRepository } from './settings.repository.types';

/**
 * Settings Repository Implementation
 * Main repository instance following todo module pattern
 */
export const settingsRepository: SettingsRepository = {
  queries: settingsQueriesRepository,
  queryKeys: settingsQueryKeys,
  queryOptions: settingsQueryOptions,
};

// Re-export types for convenience
export type { SettingsGateway } from './gateways';
export type { SettingsQueriesRepository, SettingsRepository } from './settings.repository.types';
