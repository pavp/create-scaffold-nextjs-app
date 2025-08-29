/**
 * @jest-environment jsdom
 */

import {
  createMockAuthCredentials,
  createMockAuthLoginResponse,
  createMockAuthValidationResponse,
} from '@test/entities/auth.mock';

import { endpoints } from '@/api/endpoints';
import { httpClient } from '@/api/http-client';
import type { AuthCredentials, AuthLoginResponse } from '@/modules/auth/auth.types';
import {
  AuthCredentialsSchema,
  AuthLoginResponseSchema,
  AuthValidationResponseSchema,
} from '@/modules/auth/auth.types';

import { authApi } from './auth-api';

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('AuthApi', () => {
  let mockCredentials: AuthCredentials;
  let mockLoginResponse: AuthLoginResponse;

  beforeAll(() => {
    // Create reusable test data using faker factories
    mockCredentials = createMockAuthCredentials({
      email: 'test@example.com',
      password: 'testPassword123',
    });

    mockLoginResponse = createMockAuthLoginResponse({
      token: 'test-token-123',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockedHttpClient.post.mockResolvedValue({ data: mockLoginResponse });

      const result = await authApi.login(mockCredentials);

      expect(mockedHttpClient.post).toHaveBeenCalledWith(endpoints.AUTH.LOGIN, mockCredentials, {
        requestSchema: AuthCredentialsSchema,
        responseSchema: AuthLoginResponseSchema,
        signal: undefined,
      });

      expect(result).toEqual(mockLoginResponse);
    });

    it('should pass signal option to http client', async () => {
      const abortController = new AbortController();

      mockedHttpClient.post.mockResolvedValue({ data: mockLoginResponse });

      await authApi.login(mockCredentials, { signal: abortController.signal });

      expect(mockedHttpClient.post).toHaveBeenCalledWith(endpoints.AUTH.LOGIN, mockCredentials, {
        requestSchema: AuthCredentialsSchema,
        responseSchema: AuthLoginResponseSchema,
        signal: abortController.signal,
      });
    });

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials';

      mockedHttpClient.post.mockRejectedValue(new Error(errorMessage));

      await expect(authApi.login(mockCredentials)).rejects.toThrow(errorMessage);
    });

    it('should validate request data with schema', async () => {
      const invalidCredentials = { email: 'invalid-email', password: '' };

      mockedHttpClient.post.mockResolvedValue({ data: mockLoginResponse });

      // The schema validation should happen in the httpClient,
      // but we test that the correct schema is passed
      await authApi.login(invalidCredentials as AuthCredentials);

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.LOGIN,
        invalidCredentials,
        expect.objectContaining({
          requestSchema: AuthCredentialsSchema,
        }),
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockedHttpClient.post.mockResolvedValue({ data: {} });

      await authApi.logout();

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.LOGOUT,
        {},
        {
          signal: undefined,
        },
      );
    });

    it('should pass signal option to http client', async () => {
      const abortController = new AbortController();

      mockedHttpClient.post.mockResolvedValue({ data: {} });

      await authApi.logout({ signal: abortController.signal });

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.LOGOUT,
        {},
        {
          signal: abortController.signal,
        },
      );
    });

    it('should handle logout error', async () => {
      const errorMessage = 'Logout failed';

      mockedHttpClient.post.mockRejectedValue(new Error(errorMessage));

      await expect(authApi.logout()).rejects.toThrow(errorMessage);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const token = 'old-token';
      const newTokenResponse = createMockAuthLoginResponse({
        token: 'new-token-456',
      });

      mockedHttpClient.post.mockResolvedValue({ data: newTokenResponse });

      const result = await authApi.refreshToken(token);

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.REFRESH,
        { token },
        {
          responseSchema: AuthLoginResponseSchema,
          signal: undefined,
        },
      );

      expect(result).toEqual(newTokenResponse);
    });

    it('should pass signal option to http client', async () => {
      const token = 'test-token';
      const abortController = new AbortController();
      const refreshResponse = createMockAuthLoginResponse();

      mockedHttpClient.post.mockResolvedValue({ data: refreshResponse });

      await authApi.refreshToken(token, { signal: abortController.signal });

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.REFRESH,
        { token },
        {
          responseSchema: AuthLoginResponseSchema,
          signal: abortController.signal,
        },
      );
    });

    it('should handle refresh token error', async () => {
      const token = 'invalid-token';
      const errorMessage = 'Token refresh failed';

      mockedHttpClient.post.mockRejectedValue(new Error(errorMessage));

      await expect(authApi.refreshToken(token)).rejects.toThrow(errorMessage);
    });
  });

  describe('validateSession', () => {
    it('should validate session successfully', async () => {
      const token = 'valid-token';
      const validationResponse = createMockAuthValidationResponse(true);

      mockedHttpClient.post.mockResolvedValue({ data: validationResponse });

      const result = await authApi.validateSession(token);

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.VALIDATE,
        { token },
        {
          responseSchema: AuthValidationResponseSchema,
          signal: undefined,
        },
      );

      expect(result).toEqual(validationResponse);
    });

    it('should return invalid session result', async () => {
      const token = 'invalid-token';
      const validationResponse = createMockAuthValidationResponse(false);

      mockedHttpClient.post.mockResolvedValue({ data: validationResponse });

      const result = await authApi.validateSession(token);

      expect(result.valid).toBe(false);
    });

    it('should pass signal option to http client', async () => {
      const token = 'test-token';
      const abortController = new AbortController();
      const validationResponse = createMockAuthValidationResponse(true);

      mockedHttpClient.post.mockResolvedValue({ data: validationResponse });

      await authApi.validateSession(token, { signal: abortController.signal });

      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.VALIDATE,
        { token },
        {
          responseSchema: AuthValidationResponseSchema,
          signal: abortController.signal,
        },
      );
    });

    it('should handle validation error', async () => {
      const token = 'test-token';
      const errorMessage = 'Validation failed';

      mockedHttpClient.post.mockRejectedValue(new Error(errorMessage));

      await expect(authApi.validateSession(token)).rejects.toThrow(errorMessage);
    });
  });

  describe('API Contract', () => {
    it('should implement all required methods', () => {
      expect(authApi.login).toBeInstanceOf(Function);
      expect(authApi.logout).toBeInstanceOf(Function);
      expect(authApi.refreshToken).toBeInstanceOf(Function);
      expect(authApi.validateSession).toBeInstanceOf(Function);
    });

    it('should use correct endpoints for all methods', async () => {
      mockedHttpClient.post.mockResolvedValue({ data: {} });

      // Test all endpoints are used correctly
      await authApi.login(mockCredentials);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(endpoints.AUTH.LOGIN, expect.any(Object), expect.any(Object));

      await authApi.logout();
      expect(mockedHttpClient.post).toHaveBeenCalledWith(endpoints.AUTH.LOGOUT, expect.any(Object), expect.any(Object));

      await authApi.refreshToken('token');
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.REFRESH,
        expect.any(Object),
        expect.any(Object),
      );

      await authApi.validateSession('token');
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        endpoints.AUTH.VALIDATE,
        expect.any(Object),
        expect.any(Object),
      );
    });
  });

  describe('Schema Validation', () => {
    it('should use correct schemas for requests and responses', async () => {
      mockedHttpClient.post.mockResolvedValue({ data: mockLoginResponse });

      // Test login uses both request and response schemas
      await authApi.login(mockCredentials);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          requestSchema: AuthCredentialsSchema,
          responseSchema: AuthLoginResponseSchema,
        }),
      );

      // Test refresh token uses response schema
      await authApi.refreshToken('token');
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          responseSchema: AuthLoginResponseSchema,
        }),
      );

      // Test validate session uses response schema
      await authApi.validateSession('token');
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          responseSchema: AuthValidationResponseSchema,
        }),
      );
    });
  });

  describe('Error Handling', () => {
    it('should propagate network errors', async () => {
      const networkError = new Error('Network error');

      mockedHttpClient.post.mockRejectedValue(networkError);

      await expect(authApi.login(mockCredentials)).rejects.toThrow('Network error');
      await expect(authApi.logout()).rejects.toThrow('Network error');
      await expect(authApi.refreshToken('token')).rejects.toThrow('Network error');
      await expect(authApi.validateSession('token')).rejects.toThrow('Network error');
    });

    it('should handle HTTP client errors gracefully', async () => {
      const httpError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      mockedHttpClient.post.mockRejectedValue(httpError);

      await expect(authApi.login(mockCredentials)).rejects.toEqual(httpError);
    });
  });
});
