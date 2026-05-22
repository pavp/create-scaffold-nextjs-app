import type { DataSource } from '@/types/gateway.types';

import { createSettingsHttpGateway } from './http-gateway/http-gateway';
import type { SettingsGateway } from './settings.gateway.types';

/**
 * Settings Gateway Factory
 * Creates appropriate gateway based on data source
 * Currently only supports HTTP, following simple pattern
 */
export const createSettingsGateway = (dataSource: DataSource = 'http'): SettingsGateway => {
  switch (dataSource) {
    case 'http':
      return createSettingsHttpGateway();
    case 'localStorage':
      throw new Error('localStorage gateway not supported for settings');
    default:
      throw new Error(`Unsupported data source: ${dataSource}`);
  }
};

// Re-export types for convenience
export type { SettingsGateway } from './settings.gateway.types';
