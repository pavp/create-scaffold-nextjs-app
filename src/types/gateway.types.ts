/**
 * Generic types for gateway implementations
 * Can be extended by any module that needs data gateways
 */

export type DataSource = 'http' | 'localStorage';

/**
 * Gateway options for supporting cancellation and other features
 * This can be used by any gateway implementation
 */
export interface GatewayOptions {
  signal?: AbortSignal;
}

export interface GatewayCapabilities {
  offline: boolean;
  realtime: boolean;
  persistence: boolean;
}

export interface GatewaySourceInfo {
  type: DataSource;
  name: string;
  capabilities: GatewayCapabilities;
}

/**
 * Base interface that all gateways should implement
 */
export interface BaseGateway {
  getSourceInfo(): GatewaySourceInfo;
}
