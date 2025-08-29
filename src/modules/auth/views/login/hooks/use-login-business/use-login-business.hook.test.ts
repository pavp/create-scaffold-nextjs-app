/**
 * @jest-environment jsdom
 */

import { act, renderHookWithProviders } from '@test/utils';

import { authRepository } from '@/modules/auth/repositories/auth';
import { useAuthActions } from '@/modules/auth/stores/auth.store.actions';

import { useLoginBusiness } from './use-login-business.hook';

// Mocks
jest.mock('@/modules/auth/repositories/auth');
jest.mock('@/modules/auth/stores/auth.store.actions');

const mockedAuthRepository = authRepository as jest.Mocked<typeof authRepository>;
const mockedUseAuthActions = useAuthActions as jest.MockedFunction<typeof useAuthActions>;

describe('useLoginBusiness', () => {
  const mockSetSession = jest.fn();
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuthActions.mockReturnValue({ setSession: mockSetSession } as any);

    mockedAuthRepository.mutations = {
      useLogin: jest.fn(() => ({ mutateAsync: mockMutateAsync, isPending: false, error: null })),
      useLogout: jest.fn(),
      useRefreshToken: jest.fn(),
    } as any;
  });

  it('should call mutateAsync with credentials and set session on success', async () => {
    const credentials = { email: 'user@example.com', password: 'secret' };
    const response = {
      token: 'token123',
      expirationDate: '2025-01-01T00:00:00.000Z',
    } as any;

    mockMutateAsync.mockResolvedValue(response);

    const { result } = renderHookWithProviders(() => useLoginBusiness(), {
      queryClientOptions: { retry: false },
    });

    await act(async () => {
      await result.current.login(credentials);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(credentials);
    expect(mockSetSession).toHaveBeenCalledWith({
      token: response.token,
      expirationDate: response.expirationDate,
      isAuthenticated: true,
    });
  });

  it('should expose loading and error state from mutation', () => {
    mockedAuthRepository.mutations.useLogin = jest.fn(() => ({
      mutateAsync: mockMutateAsync,
      isPending: true,
      error: new Error('Failed'),
    })) as any;

    const { result } = renderHookWithProviders(() => useLoginBusiness(), {
      queryClientOptions: { retry: false },
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toEqual(new Error('Failed'));
  });

  it('should propagate error without calling setSession', async () => {
    const credentials = { email: 'user@example.com', password: 'secret' };
    const error = new Error('Invalid credentials');

    mockMutateAsync.mockRejectedValue(error);

    const { result } = renderHookWithProviders(() => useLoginBusiness(), {
      queryClientOptions: { retry: false },
    });

    await expect(result.current.login(credentials)).rejects.toThrow(error);
    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it('should memoize login function (stable reference)', () => {
    const { result, rerender } = renderHookWithProviders(() => useLoginBusiness(), {
      queryClientOptions: { retry: false },
    });

    const first = result.current.login;

    rerender(undefined as any);
    expect(result.current.login).toBe(first);
  });
});
