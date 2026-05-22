import { act, mockZustandStore, renderHook } from '@test/utils';
import Cookies from 'js-cookie';

import { COOKIES_NAME } from '@/types/cookies.types';

import type { AuthSession } from '../auth.types';

import { useAuthStore } from './auth.store';

// Mock js-cookie
jest.mock('js-cookie');
const mockedCookies = Cookies as jest.Mocked<typeof Cookies>;

describe('Auth Store', () => {
  // Mock data for testing - generated dynamically
  let mockSession: AuthSession;
  let expiredSession: AuthSession;

  beforeAll(() => {
    // Generate dynamic dates for consistent testing
    const futureDate = new Date();

    futureDate.setFullYear(futureDate.getFullYear() + 1); // 1 year in the future

    const pastDate = new Date();

    pastDate.setFullYear(pastDate.getFullYear() - 1); // 1 year in the past

    mockSession = {
      token: 'test-token-123',
      expirationDate: futureDate.toISOString(),
      isAuthenticated: true,
    };

    expiredSession = {
      token: 'expired-token',
      expirationDate: pastDate.toISOString(),
      isAuthenticated: true,
    };
  });

  beforeEach(() => {
    // Reset store to initial state before each test
    mockZustandStore(useAuthStore, {
      token: '',
      expirationDate: '',
      isAuthenticated: false,
    });

    // Clear all cookie mocks
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.token).toBe('');
      expect(result.current.expirationDate).toBe('');
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.actions).toBeDefined();
    });

    it('should have all required actions', () => {
      const { result } = renderHook(() => useAuthStore());
      const { actions } = result.current;

      expect(actions.setToken).toBeInstanceOf(Function);
      expect(actions.setSession).toBeInstanceOf(Function);
      expect(actions.clearSession).toBeInstanceOf(Function);
      expect(actions.validateSession).toBeInstanceOf(Function);
    });
  });

  describe('Actions', () => {
    describe('setToken', () => {
      it('should set token', () => {
        const { result } = renderHook(() => useAuthStore());

        act(() => {
          result.current.actions.setToken('new-token');
        });

        expect(result.current.token).toBe('new-token');
      });

      it('should clear token when empty string is passed', () => {
        const { result } = renderHook(() => useAuthStore());

        // First set a token
        act(() => {
          result.current.actions.setToken('test-token');
        });

        expect(result.current.token).toBe('test-token');

        // Then clear it
        act(() => {
          result.current.actions.setToken('');
        });

        expect(result.current.token).toBe('');
      });
    });

    describe('setSession', () => {
      it('should set session and mark as authenticated', () => {
        const { result } = renderHook(() => useAuthStore());

        act(() => {
          result.current.actions.setSession(mockSession);
        });

        expect(result.current.token).toBe(mockSession.token);
        expect(result.current.expirationDate).toBe(mockSession.expirationDate);
        expect(result.current.isAuthenticated).toBe(true);
      });

      it('should set session cookie when valid session is provided', () => {
        const { result } = renderHook(() => useAuthStore());

        act(() => {
          result.current.actions.setSession(mockSession);
        });

        expect(mockedCookies.set).toHaveBeenCalledWith(
          COOKIES_NAME.SESSION,
          JSON.stringify({
            token: mockSession.token,
            expirationDate: mockSession.expirationDate,
          }),
        );
      });

      it('should not set cookie when token is missing', () => {
        const { result } = renderHook(() => useAuthStore());
        const sessionWithoutToken = { ...mockSession, token: '' };

        act(() => {
          result.current.actions.setSession(sessionWithoutToken);
        });

        expect(mockedCookies.set).not.toHaveBeenCalled();
      });

      it('should not set cookie when expiration date is missing', () => {
        const { result } = renderHook(() => useAuthStore());
        const sessionWithoutExpiration = { ...mockSession, expirationDate: '' };

        act(() => {
          result.current.actions.setSession(sessionWithoutExpiration);
        });

        expect(mockedCookies.set).not.toHaveBeenCalled();
      });

      it('should set isAuthenticated based on token presence', () => {
        const { result } = renderHook(() => useAuthStore());

        // Test with valid token
        act(() => {
          result.current.actions.setSession(mockSession);
        });

        expect(result.current.isAuthenticated).toBe(true);

        // Test with empty token
        act(() => {
          result.current.actions.setSession({ ...mockSession, token: '' });
        });

        expect(result.current.isAuthenticated).toBe(false);
      });
    });

    describe('clearSession', () => {
      it('should reset state to initial values', () => {
        const { result } = renderHook(() => useAuthStore());

        // First set a session
        act(() => {
          result.current.actions.setSession(mockSession);
        });

        expect(result.current.isAuthenticated).toBe(true);

        // Then clear it
        act(() => {
          result.current.actions.clearSession();
        });

        expect(result.current.token).toBe('');
        expect(result.current.expirationDate).toBe('');
        expect(result.current.isAuthenticated).toBe(false);
      });

      it('should remove session cookie', () => {
        const { result } = renderHook(() => useAuthStore());

        act(() => {
          result.current.actions.clearSession();
        });

        expect(mockedCookies.remove).toHaveBeenCalledWith(COOKIES_NAME.SESSION);
      });
    });

    describe('validateSession', () => {
      it('should return true for valid session', () => {
        const { result } = renderHook(() => useAuthStore());

        // Set up valid session
        act(() => {
          result.current.actions.setSession(mockSession);
        });

        let isValid: boolean;

        act(() => {
          isValid = result.current.actions.validateSession();
        });

        expect(isValid!).toBe(true);
      });

      it('should return false when token is missing', () => {
        const { result } = renderHook(() => useAuthStore());

        let isValid: boolean;

        act(() => {
          isValid = result.current.actions.validateSession();
        });

        expect(isValid!).toBe(false);
      });

      it('should return false when expiration date is missing', () => {
        const { result } = renderHook(() => useAuthStore());

        // Set up session without expiration
        act(() => {
          result.current.actions.setSession({ ...mockSession, expirationDate: '' });
        });

        let isValid: boolean;

        act(() => {
          isValid = result.current.actions.validateSession();
        });

        expect(isValid!).toBe(false);
      });

      it('should clear session and return false for expired session', () => {
        const { result } = renderHook(() => useAuthStore());

        // Set up expired session
        act(() => {
          result.current.actions.setSession(expiredSession);
        });

        expect(result.current.isAuthenticated).toBe(true);

        let isValid: boolean;

        act(() => {
          isValid = result.current.actions.validateSession();
        });

        expect(isValid!).toBe(false);
        expect(result.current.token).toBe('');
        expect(result.current.expirationDate).toBe('');
        expect(result.current.isAuthenticated).toBe(false);
        expect(mockedCookies.remove).toHaveBeenCalledWith(COOKIES_NAME.SESSION);
      });

      it('should not clear session for valid future date', () => {
        const { result } = renderHook(() => useAuthStore());

        // Generate dynamic future date
        const farFutureDate = new Date();

        farFutureDate.setFullYear(farFutureDate.getFullYear() + 5);

        const futureSession = {
          ...mockSession,
          expirationDate: farFutureDate.toISOString(),
        };

        // Set up future session
        act(() => {
          result.current.actions.setSession(futureSession);
        });

        let isValid: boolean;

        act(() => {
          isValid = result.current.actions.validateSession();
        });

        expect(isValid!).toBe(true);
        expect(result.current.isAuthenticated).toBe(true);
        expect(mockedCookies.remove).not.toHaveBeenCalled();
      });
    });
  });

  describe('Store Integration', () => {
    it('should maintain state consistency across multiple operations', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set session
      act(() => {
        result.current.actions.setSession(mockSession);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Validate session
      let isValid: boolean;

      act(() => {
        isValid = result.current.actions.validateSession();
      });

      expect(isValid!).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);

      // Clear session
      act(() => {
        result.current.actions.clearSession();
      });

      expect(result.current.isAuthenticated).toBe(false);

      // Validate cleared session
      act(() => {
        isValid = result.current.actions.validateSession();
      });

      expect(isValid!).toBe(false);
    });

    it('should handle rapid state changes correctly', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.actions.setSession(mockSession);
        result.current.actions.setToken('updated-token');
        result.current.actions.clearSession();
      });

      expect(result.current.token).toBe('');
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
