import type { SettingsResponse } from '@/shared/settings/settings.types';
import type { BaseGateway, GatewayOptions } from '@/types/gateway.types';

/**
 * Settings Gateway interface
 * Defines contract for all settings data sources
 */
export interface SettingsGateway extends BaseGateway {
  /**
   * Fetch settings data
   * @param options - Gateway options including cancellation
   * @returns Promise with settings response
   */
  getSettings(options?: GatewayOptions): Promise<SettingsResponse>;
}
