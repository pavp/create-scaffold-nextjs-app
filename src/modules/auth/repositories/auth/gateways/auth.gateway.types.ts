import type { AuthCredentials, AuthLoginResponse } from '@/modules/auth/auth.types';
import type { BaseGateway, GatewayOptions } from '@/types/gateway.types';

// Auth-specific gateway interface extending the base gateway
export interface AuthGateway extends BaseGateway {
  login(credentials: AuthCredentials, options?: GatewayOptions): Promise<AuthLoginResponse>;
  logout(options?: GatewayOptions): Promise<void>;
  refreshToken(token: string, options?: GatewayOptions): Promise<AuthLoginResponse>;
  validateSession(token: string, options?: GatewayOptions): Promise<boolean>;
}
