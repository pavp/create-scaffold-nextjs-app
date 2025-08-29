/**
 * @jest-environment jsdom
 */

import { createMockAuthSession } from '@test/entities/auth.mock';
import { mockZustandStore, renderHook, setupAuthStoreState } from '@test/utils';

import { useAuthStore } from '@/modules/auth/stores/auth.store';

import { useAuthSessionSelector } from './use-auth-session-selector.hook';

describe('useAuthSessionSelector', () => {
  // Mock validateSession action
  const mockValidateSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateSession.mockReturnValue(false);
    mockZustandStore(useAuthStore, setupAuthStoreState());
  });

  describe('Session Data Access', () => {
    it('should return session data when user is authenticated', () => {
      const mockSession = createMockAuthSession();

      mockZustandStore(useAuthStore, {
        isAuthenticated: true,
        token: mockSession.token,
        expirationDate: mockSession.expirationDate,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.token).toBe(mockSession.token);
      expect(result.current.expirationDate).toBe(mockSession.expirationDate);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.hasToken).toBe(true);
    });

    it('should return null/undefined data when user is not authenticated', () => {
      mockZustandStore(useAuthStore, {
        isAuthenticated: false,
        token: undefined,
        expirationDate: undefined,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.token).toBeUndefined();
      expect(result.current.expirationDate).toBeUndefined();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.hasToken).toBe(false);
    });

    it('should return consistent data structure for initial state', () => {
      mockZustandStore(useAuthStore, {
        ...setupAuthStoreState(),
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current).toEqual({
        token: '',
        expirationDate: '',
        isAuthenticated: false,
        isSessionValid: false,
        hasToken: false,
        isExpired: true,
      });
    });
  });

  describe('Session Validation', () => {
    it('should return true for isSessionValid when session is valid', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      mockValidateSession.mockReturnValue(true);
      mockZustandStore(useAuthStore, {
        isAuthenticated: true,
        token: 'valid-token',
        expirationDate: futureDate.toISOString(),
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.isSessionValid).toBe(true);
    });

    it('should return false for isSessionValid when session is invalid', () => {
      mockValidateSession.mockReturnValue(false);
      mockZustandStore(useAuthStore, {
        isAuthenticated: false,
        token: undefined,
        expirationDate: undefined,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.isSessionValid).toBe(false);
    });

    it('should call validateSession action when accessing isSessionValid', () => {
      mockZustandStore(useAuthStore, {
        ...setupAuthStoreState(),
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      renderHook(() => useAuthSessionSelector());

      expect(mockValidateSession).toHaveBeenCalled();
    });
  });

  describe('Token Validation', () => {
    it('should return hasToken as true when token exists', () => {
      mockZustandStore(useAuthStore, {
        token: 'existing-token',
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.hasToken).toBe(true);
    });

    it('should return hasToken as false when token is null', () => {
      mockZustandStore(useAuthStore, {
        token: undefined,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.hasToken).toBe(false);
    });

    it('should return hasToken as false when token is empty string', () => {
      mockZustandStore(useAuthStore, {
        token: '',
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.hasToken).toBe(false);
    });
  });

  describe('Expiration Validation', () => {
    it('should return isExpired as false when token is not expired', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      mockZustandStore(useAuthStore, {
        expirationDate: futureDate.toISOString(),
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.isExpired).toBe(false);
    });

    it('should return isExpired as true when token is expired', () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

      mockZustandStore(useAuthStore, {
        expirationDate: pastDate.toISOString(),
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.isExpired).toBe(true);
    });

    it('should return isExpired as true when expiration date is null', () => {
      mockZustandStore(useAuthStore, {
        expirationDate: undefined,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.isExpired).toBe(true);
    });

    it('should return isExpired as true when expiration date is undefined', () => {
      mockZustandStore(useAuthStore, {
        expirationDate: undefined,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.isExpired).toBe(true);
    });

    it('should handle edge case when expiration date equals current time', () => {
      const currentDate = new Date();

      mockZustandStore(useAuthStore, {
        expirationDate: currentDate.toISOString(),
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      // Should be expired when equal to current time (>= comparison)
      expect(result.current.isExpired).toBe(true);
    });
  });

  describe('Return Value Structure', () => {
    it('should return an object with all expected properties', () => {
      const mockSession = createMockAuthSession();

      mockZustandStore(useAuthStore, {
        isAuthenticated: true,
        token: mockSession.token,
        expirationDate: mockSession.expirationDate,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current).toHaveProperty('token');
      expect(result.current).toHaveProperty('expirationDate');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('isSessionValid');
      expect(result.current).toHaveProperty('hasToken');
      expect(result.current).toHaveProperty('isExpired');
    });

    it('should return consistent structure across different states', () => {
      // Test with authenticated state
      mockZustandStore(useAuthStore, {
        isAuthenticated: true,
        token: 'token',
        expirationDate: new Date().toISOString(),
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result: authenticatedResult } = renderHook(() => useAuthSessionSelector());
      const authenticatedKeys = Object.keys(authenticatedResult.current);

      // Test with unauthenticated state
      mockZustandStore(useAuthStore, {
        isAuthenticated: false,
        token: undefined,
        expirationDate: undefined,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result: unauthenticatedResult } = renderHook(() => useAuthSessionSelector());
      const unauthenticatedKeys = Object.keys(unauthenticatedResult.current);

      expect(authenticatedKeys).toEqual(unauthenticatedKeys);
      expect(authenticatedKeys).toHaveLength(6);
    });
  });

  describe('Integration Scenarios', () => {
    it('should work correctly with a complete valid session', () => {
      const mockSession = createMockAuthSession();

      // Mock session as valid since it's not expired
      mockValidateSession.mockReturnValue(true);
      mockZustandStore(useAuthStore, {
        isAuthenticated: true,
        token: mockSession.token,
        expirationDate: mockSession.expirationDate,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.token).toBe(mockSession.token);
      expect(result.current.expirationDate).toBe(mockSession.expirationDate);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isSessionValid).toBe(true);
      expect(result.current.hasToken).toBe(true);
      expect(result.current.isExpired).toBe(false);
    });

    it('should work correctly with an expired session', () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

      // Mock session as invalid since it's expired
      mockValidateSession.mockReturnValue(false);
      mockZustandStore(useAuthStore, {
        isAuthenticated: false,
        token: 'expired-token',
        expirationDate: pastDate.toISOString(),
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.token).toBe('expired-token');
      expect(result.current.expirationDate).toBe(pastDate.toISOString());
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isSessionValid).toBe(false);
      expect(result.current.hasToken).toBe(true);
      expect(result.current.isExpired).toBe(true);
    });

    it('should work correctly with no session data', () => {
      // Mock session as invalid since no data
      mockValidateSession.mockReturnValue(false);
      mockZustandStore(useAuthStore, {
        isAuthenticated: false,
        token: undefined,
        expirationDate: undefined,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result } = renderHook(() => useAuthSessionSelector());

      expect(result.current.token).toBeUndefined();
      expect(result.current.expirationDate).toBeUndefined();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isSessionValid).toBe(false);
      expect(result.current.hasToken).toBe(false);
      expect(result.current.isExpired).toBe(true);
    });
  });

  describe('Selector Performance', () => {
    it('should return consistent value when session data stays the same', () => {
      const mockSession = createMockAuthSession();

      mockZustandStore(useAuthStore, {
        isAuthenticated: true,
        token: mockSession.token,
        expirationDate: mockSession.expirationDate,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result, rerender } = renderHook(() => useAuthSessionSelector());
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      // Values should be equal but objects may be different due to Zustand behavior
      expect(firstResult.token).toEqual(secondResult.token);
      expect(firstResult.expirationDate).toEqual(secondResult.expirationDate);
      expect(firstResult.isAuthenticated).toEqual(secondResult.isAuthenticated);
    });

    it('should return different value when session data changes', () => {
      const initialSession = createMockAuthSession();

      mockZustandStore(useAuthStore, {
        isAuthenticated: true,
        token: initialSession.token,
        expirationDate: initialSession.expirationDate,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      const { result, rerender } = renderHook(() => useAuthSessionSelector());
      const firstResult = result.current;

      // Simulate session change
      const newSession = createMockAuthSession();

      // Ensure expirationDate differs even if factory returns static value
      if (newSession.expirationDate === initialSession.expirationDate) {
        newSession.expirationDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      }

      mockZustandStore(useAuthStore, {
        isAuthenticated: true,
        token: newSession.token,
        expirationDate: newSession.expirationDate,
        actions: {
          validateSession: mockValidateSession,
        } as any,
      });

      rerender();
      const secondResult = result.current;

      expect(firstResult.token).not.toEqual(secondResult.token);
      expect(firstResult.expirationDate).not.toEqual(secondResult.expirationDate);
    });
  });
});
