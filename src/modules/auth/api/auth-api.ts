import type { ApiOptions } from '@/api/api.types';
import { endpoints } from '@/api/endpoints';
import { httpClient } from '@/api/http-client';
import type { AuthCredentials, AuthLoginResponse } from '@/modules/auth/auth.types';
import {
  AuthCredentialsSchema,
  AuthLoginResponseSchema,
  AuthValidationResponseSchema,
} from '@/modules/auth/auth.types';

// Contract interface
export interface AuthApiContract {
  login(credentials: AuthCredentials, options?: ApiOptions): Promise<AuthLoginResponse>;
  logout(options?: ApiOptions): Promise<void>;
  refreshToken(token: string, options?: ApiOptions): Promise<AuthLoginResponse>;
  validateSession(token: string, options?: ApiOptions): Promise<{ valid: boolean }>;
}

// Service implementation with Zod validation
const createAuthApiService = (): AuthApiContract => ({
  async login(credentials, options) {
    const response = await httpClient.post<AuthLoginResponse>(endpoints.AUTH.LOGIN, credentials, {
      requestSchema: AuthCredentialsSchema,
      responseSchema: AuthLoginResponseSchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async logout(options) {
    await httpClient.post(
      endpoints.AUTH.LOGOUT,
      {},
      {
        signal: options?.signal,
      },
    );
  },

  async refreshToken(token, options) {
    const response = await httpClient.post<AuthLoginResponse>(
      endpoints.AUTH.REFRESH,
      { token },
      {
        responseSchema: AuthLoginResponseSchema,
        signal: options?.signal,
      },
    );

    return response.data;
  },

  async validateSession(token, options) {
    const response = await httpClient.post<{ valid: boolean }>(
      endpoints.AUTH.VALIDATE,
      { token },
      {
        responseSchema: AuthValidationResponseSchema,
        signal: options?.signal,
      },
    );

    return response.data;
  },
});

// Singleton instance for the entire app
export const authApi = createAuthApiService();
