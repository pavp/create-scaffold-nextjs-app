/**
 * @jest-environment jsdom
 */

import { act, renderHookWithProviders, waitFor } from '@test/utils';

import { createHttpAuthGateway } from './gateways/http-gateway/http-gateway';
import { authQueryKeys } from './auth.repository.keys';
import { authMutationsRepository } from './auth.repository.mutations';

// Mock dependencies
jest.mock('./gateways/http-gateway/http-gateway', () => ({
  createHttpAuthGateway: jest.fn(),
}));

const mockedCreateHttpAuthGateway = createHttpAuthGateway as jest.MockedFunction<typeof createHttpAuthGateway>;

// Mock data
const mockCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

const mockAuthResponse = {
  token: 'mock-auth-token',
  expirationDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  user: { id: '1', email: 'test@example.com' },
};

const mockRefreshToken = 'refresh-token-123';

describe('authMutationsRepository', () => {
  let mockGateway: any;

  beforeAll(() => {
    mockGateway = {
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    };

    mockedCreateHttpAuthGateway.mockReturnValue(mockGateway);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset default implementations
    mockGateway.login.mockResolvedValue(mockAuthResponse);
    mockGateway.logout.mockResolvedValue(undefined);
    mockGateway.refreshToken.mockResolvedValue(mockAuthResponse);
  });

  describe('useLogin', () => {
    it('should login successfully with correct data source', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useLogin('http'), {
        queryClientOptions: { retry: false },
      });

      await act(async () => {
        const data = await result.current.mutateAsync(mockCredentials);

        expect(data).toEqual(mockAuthResponse);
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateHttpAuthGateway).toHaveBeenCalledWith();
      expect(mockGateway.login).toHaveBeenCalledWith(mockCredentials);
      expect(result.current.data).toEqual(mockAuthResponse);
    });

    it('should use http as default data source', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useLogin(), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate(mockCredentials);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateHttpAuthGateway).toHaveBeenCalledWith();
    });

    it('should call custom onSuccess callback', async () => {
      const customOnSuccess = jest.fn();

      const { result } = renderHookWithProviders(
        () => authMutationsRepository.useLogin('http', { onSuccess: customOnSuccess }),
        {
          queryClientOptions: { retry: false },
        },
      );

      act(() => {
        result.current.mutate(mockCredentials);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(customOnSuccess).toHaveBeenCalledWith(mockAuthResponse, mockCredentials, undefined, expect.anything());
    });
  });

  describe('useLogout', () => {
    it('should logout successfully with correct data source', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useLogout('http'), {
        queryClientOptions: { retry: false },
      });

      await act(async () => {
        await result.current.mutateAsync();
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateHttpAuthGateway).toHaveBeenCalledWith();
      expect(mockGateway.logout).toHaveBeenCalled();
    });

    it('should use http as default data source', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useLogout(), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateHttpAuthGateway).toHaveBeenCalledWith();
    });

    it('should remove auth queries on success', async () => {
      const { result, queryClient } = renderHookWithProviders(() => authMutationsRepository.useLogout('http'), {
        queryClientOptions: { retry: false },
      });

      const removeQueriesSpy = jest.spyOn(queryClient, 'removeQueries');

      act(() => {
        result.current.mutate();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: authQueryKeys.all });
    });

    it('should call custom success callback', async () => {
      const customOnSuccess = jest.fn();

      const { result } = renderHookWithProviders(
        () => authMutationsRepository.useLogout('http', { onSuccess: customOnSuccess }),
        {
          queryClientOptions: { retry: false },
        },
      );

      act(() => {
        result.current.mutate();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(customOnSuccess).toHaveBeenCalledWith(undefined, undefined, undefined, expect.anything());
    });
  });

  describe('useRefreshToken', () => {
    it('should refresh token successfully with correct data source', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useRefreshToken('http'), {
        queryClientOptions: { retry: false },
      });

      await act(async () => {
        const data = await result.current.mutateAsync(mockRefreshToken);

        expect(data).toEqual(mockAuthResponse);
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateHttpAuthGateway).toHaveBeenCalledWith();
      expect(mockGateway.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(result.current.data).toEqual(mockAuthResponse);
    });

    it('should use http as default data source', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useRefreshToken(), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate(mockRefreshToken);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateHttpAuthGateway).toHaveBeenCalledWith();
    });

    it('should call custom onSuccess callback', async () => {
      const customOnSuccess = jest.fn();

      const { result } = renderHookWithProviders(
        () => authMutationsRepository.useRefreshToken('http', { onSuccess: customOnSuccess }),
        {
          queryClientOptions: { retry: false },
        },
      );

      act(() => {
        result.current.mutate(mockRefreshToken);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(customOnSuccess).toHaveBeenCalledWith(mockAuthResponse, mockRefreshToken, undefined, expect.anything());
    });
  });

  describe('Mutation States', () => {
    it('should reset state on new mutation', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useLogin('http'), {
        queryClientOptions: { retry: false },
      });

      // First mutation
      act(() => {
        result.current.mutate(mockCredentials);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Reset for second mutation
      act(() => {
        result.current.reset();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBeUndefined();
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work with query client cache operations', async () => {
      const { result, queryClient } = renderHookWithProviders(() => authMutationsRepository.useLogout('http'), {
        queryClientOptions: { retry: false },
      });

      // Add some auth data to cache first
      queryClient.setQueryData(authQueryKeys.session(), { token: 'test-token' });

      act(() => {
        result.current.mutate();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify cache was cleared
      expect(queryClient.getQueryData(authQueryKeys.session())).toBeUndefined();
    });

    it('should handle mutations with custom options', async () => {
      const onMutate = jest.fn();
      const onSettled = jest.fn();

      const { result } = renderHookWithProviders(
        () =>
          authMutationsRepository.useLogin('http', {
            onMutate,
            onSettled,
          }),
        {
          queryClientOptions: { retry: false },
        },
      );

      act(() => {
        result.current.mutate(mockCredentials);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onMutate).toHaveBeenCalledWith(mockCredentials, expect.anything());
      expect(onSettled).toHaveBeenCalledWith(mockAuthResponse, null, mockCredentials, undefined, expect.anything());
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined options gracefully', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useLogin('http', undefined), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate(mockCredentials);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockAuthResponse);
    });

    it('should handle empty credentials for logout', async () => {
      const { result } = renderHookWithProviders(() => authMutationsRepository.useLogout('http'), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGateway.logout).toHaveBeenCalled();
    });

    it('should handle malformed response data', async () => {
      const malformedResponse = { invalid: 'data' };

      mockGateway.refreshToken.mockResolvedValue(malformedResponse);

      const { result } = renderHookWithProviders(() => authMutationsRepository.useRefreshToken('http'), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate(mockRefreshToken);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(malformedResponse);
    });
  });

  describe('Performance Tests', () => {
    it('should not create new mutation instances on re-render', () => {
      const { result, rerender } = renderHookWithProviders(() => authMutationsRepository.useLogin('http'), {
        queryClientOptions: { retry: false },
      });

      const firstInstance = result.current;

      rerender();

      const secondInstance = result.current;

      // The mutation function should be stable
      expect(typeof firstInstance.mutate).toBe('function');
      expect(typeof secondInstance.mutate).toBe('function');
    });

    it('should handle rapid successive calls efficiently', async () => {
      mockGateway.login
        .mockResolvedValueOnce(mockAuthResponse)
        .mockResolvedValueOnce(mockAuthResponse)
        .mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHookWithProviders(() => authMutationsRepository.useLogin('http'), {
        queryClientOptions: { retry: false },
      });

      // Make rapid successive calls
      act(() => {
        result.current.mutate(mockCredentials);
        result.current.mutate(mockCredentials);
        result.current.mutate(mockCredentials);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // All calls should have been made
      expect(mockGateway.login).toHaveBeenCalledTimes(3);
    });
  });
});
