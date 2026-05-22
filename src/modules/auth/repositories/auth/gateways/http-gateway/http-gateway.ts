import { authApi } from '@/modules/auth/api/auth-api';
import type { AuthGateway } from '@/modules/auth/repositories/auth/gateways/auth.gateway.types';

/**
 * HTTP Gateway Factory Function
 * Uses the auth API service for actual HTTP calls
 */
export const createHttpAuthGateway = (): AuthGateway => {
  return {
    async login(credentials, options) {
      // Use actual authApi service
      return authApi.login(credentials, options);
    },

    async logout(options) {
      // Use actual authApi service
      await authApi.logout(options);
    },

    async refreshToken(token, options) {
      // Use actual authApi service
      return authApi.refreshToken(token, options);
    },

    async validateSession(token, options) {
      // Use actual authApi service
      const result = await authApi.validateSession(token, options);

      return result.valid;
    },

    getSourceInfo() {
      return {
        type: 'http',
        name: 'HTTP Auth Gateway (Clean Architecture)',
        capabilities: {
          offline: false,
          realtime: true,
          persistence: true, // Server-side persistence
        },
      };
    },
  };
};
