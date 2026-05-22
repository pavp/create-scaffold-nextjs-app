import type { ApiOptions } from '@/api/api.types';
import { endpoints } from '@/api/endpoints';
import { httpClient } from '@/api/http-client';
import type { SettingsResponse } from '@/shared/settings/settings.types';
import { SettingsResponseSchema } from '@/shared/settings/settings.types';

// Contract interface
export interface SettingsApiContract {
  getSettings(options?: ApiOptions): Promise<SettingsResponse>;
}

// Service implementation with Zod validation
const createSettingsApiService = (): SettingsApiContract => ({
  async getSettings(options) {
    const response = await httpClient.get<SettingsResponse>(endpoints.SETTINGS.BASE, {
      signal: options?.signal,
      responseSchema: SettingsResponseSchema,
    });

    return response.data;
  },
});

// Export service instance
export const settingsApi = createSettingsApiService();
