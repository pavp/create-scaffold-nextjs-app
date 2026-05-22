import { settingsApi } from '@/shared/settings/api/settings-api';
import type { SettingsGateway } from '@/shared/settings/repositories/settings/gateways/settings.gateway.types';

/**
 * HTTP Gateway Factory Function
 * Uses the settings API layer
 */
export const createSettingsHttpGateway = (): SettingsGateway => {
  return {
    getSourceInfo() {
      return {
        type: 'http' as const,
        name: 'Settings HTTP Gateway',
        capabilities: {
          offline: false,
          realtime: false,
          persistence: false,
        },
      };
    },

    async getSettings(options) {
      return settingsApi.getSettings(options);
    },
  };
};
