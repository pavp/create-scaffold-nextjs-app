/**
 * @jest-environment jsdom
 */

import { act, renderHookWithProviders } from '@test/utils';

import { authRepository } from '@/modules/auth/repositories/auth';
import { useAuthStatusSelector } from '@/modules/auth/selectors';
import { useAuthActions } from '@/modules/auth/stores/auth.store.actions';

import { useLogoutBusiness } from './use-logout-business.hook';

jest.mock('@/modules/auth/repositories/auth');
jest.mock('@/modules/auth/selectors');
jest.mock('@/modules/auth/stores/auth.store.actions');

const mockedAuthRepository = authRepository as jest.Mocked<typeof authRepository>;
const mockedUseAuthStatusSelector = useAuthStatusSelector as jest.MockedFunction<typeof useAuthStatusSelector>;
const mockedUseAuthActions = useAuthActions as jest.MockedFunction<typeof useAuthActions>;

describe('useLogoutBusiness', () => {
  const mockClearSession = jest.fn();
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuthStatusSelector.mockReturnValue({ isAuthenticated: true } as any);
    mockedUseAuthActions.mockReturnValue({ clearSession: mockClearSession } as any);

    mockedAuthRepository.mutations = {
      useLogout: jest.fn(() => ({ mutateAsync: mockMutateAsync })),
      useLogin: jest.fn(),
      useRefreshToken: jest.fn(),
    } as any;
  });

  it('should call logout mutation and clear session on success', async () => {
    mockMutateAsync.mockResolvedValue(undefined);

    const { result } = renderHookWithProviders(() => useLogoutBusiness(), {
      queryClientOptions: { retry: false },
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockMutateAsync).toHaveBeenCalled();
    expect(mockClearSession).toHaveBeenCalledTimes(1);
  });

  it('should clear session even if mutation fails', async () => {
    const error = new Error('Network');

    mockMutateAsync.mockRejectedValue(error);

    const { result } = renderHookWithProviders(() => useLogoutBusiness(), {
      queryClientOptions: { retry: false },
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockMutateAsync).toHaveBeenCalled();
    expect(mockClearSession).toHaveBeenCalledTimes(1);
  });

  it('should return isAuthenticated from selector', () => {
    mockedUseAuthStatusSelector.mockReturnValue({ isAuthenticated: false } as any);

    const { result } = renderHookWithProviders(() => useLogoutBusiness(), {
      queryClientOptions: { retry: false },
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should memoize logout callback', () => {
    const { result, rerender } = renderHookWithProviders(() => useLogoutBusiness(), {
      queryClientOptions: { retry: false },
    });

    const first = result.current.logout;

    rerender(undefined as any);
    expect(result.current.logout).toBe(first);
  });
});
