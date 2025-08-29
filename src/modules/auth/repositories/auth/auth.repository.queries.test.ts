/**
 * @jest-environment jsdom
 */

import { renderHookWithProviders, waitFor } from '@test/utils';

import { createHttpAuthGateway } from './gateways/http-gateway/http-gateway';
import { authQueriesRepository } from './auth.repository.queries';

// Mock dependencies
jest.mock('./gateways/http-gateway/http-gateway', () => ({
  createHttpAuthGateway: jest.fn(),
}));

const mockedCreateHttpAuthGateway = createHttpAuthGateway as jest.MockedFunction<typeof createHttpAuthGateway>;

describe('authQueriesRepository', () => {
  let mockGateway: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGateway = {
      validateSession: jest.fn().mockResolvedValue(true),
    };

    mockedCreateHttpAuthGateway.mockReturnValue(mockGateway);
  });

  describe('useValidateSession', () => {
    const token = 'valid-token-123';

    it('should validate session successfully', async () => {
      mockGateway.validateSession.mockResolvedValue(true);

      const { result } = renderHookWithProviders(
        () => authQueriesRepository.useValidateSession(token, { enabled: true }),
        { queryClientOptions: { retry: false } },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(true);
      expect(mockedCreateHttpAuthGateway).toHaveBeenCalledTimes(1);
      expect(mockGateway.validateSession).toHaveBeenCalledWith(
        token,
        expect.objectContaining({ signal: expect.any(Object) }),
      );
    });

    it('should pass token and receive false when session invalid', async () => {
      mockGateway.validateSession.mockResolvedValue(false);

      const { result } = renderHookWithProviders(
        () => authQueriesRepository.useValidateSession(token, { enabled: true }),
        { queryClientOptions: { retry: false } },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(false);
    });

    it('should be disabled when token is falsy', () => {
      const { result } = renderHookWithProviders(
        // empty string token -> enabled should evaluate to false by default query option
        () => authQueriesRepository.useValidateSession(''),
        { queryClientOptions: { retry: false } },
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGateway.validateSession).not.toHaveBeenCalled();
    });

    it('should respect custom disabled option even with token', () => {
      const { result } = renderHookWithProviders(
        () => authQueriesRepository.useValidateSession(token, { enabled: false }),
        { queryClientOptions: { retry: false } },
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGateway.validateSession).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const error = new Error('Session invalid');

      mockGateway.validateSession.mockRejectedValue(error);

      const { result } = renderHookWithProviders(
        () => authQueriesRepository.useValidateSession(token, { enabled: true }),
        { queryClientOptions: { retry: false } },
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should allow overriding default options (e.g., retry)', async () => {
      mockGateway.validateSession.mockResolvedValue(true);

      const { result } = renderHookWithProviders(
        () => authQueriesRepository.useValidateSession(token, { enabled: true, retry: 2 }),
        { queryClientOptions: { retry: false } },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // retry option override is internal to react-query; we just assert success path ran
      expect(result.current.data).toBe(true);
    });
  });
});
