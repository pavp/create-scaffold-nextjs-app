/**
 * @jest-environment jsdom
 */

import { createMockAuthSession } from '@test/entities/auth.mock';
import { mockZustandStore, renderHook, setupAuthStoreState } from '@test/utils';

import { useAuthStore } from '@/modules/auth/stores/auth.store';

import { useAuthStatusSelector } from './use-auth-status-selector.hook';

describe('useAuthStatusSelector', () => {
  // Mock data for testing
  let mockAuthenticatedSession: any;
  let mockUnauthenticatedSession: any;

  beforeAll(() => {
    // Generate dynamic test data
    mockAuthenticatedSession = createMockAuthSession({
      isAuthenticated: true,
    });

    mockUnauthenticatedSession = createMockAuthSession({
      isAuthenticated: false,
    });
  });

  beforeEach(() => {
    // Reset store state before each test
    mockZustandStore(useAuthStore, setupAuthStoreState());
  });

  describe('Authentication Status', () => {
    it('should return true when user is authenticated', () => {
      // Setup authenticated state
      mockZustandStore(useAuthStore, {
        ...mockAuthenticatedSession,
        actions: {} as any,
      });

      const { result } = renderHook(() => useAuthStatusSelector());

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      // Setup unauthenticated state
      mockZustandStore(useAuthStore, {
        ...mockUnauthenticatedSession,
        actions: {} as any,
      });

      const { result } = renderHook(() => useAuthStatusSelector());

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return false for initial state', () => {
      // Use default initial state (unauthenticated)
      const { result } = renderHook(() => useAuthStatusSelector());

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Selector Updates', () => {
    it('should update when authentication status changes', () => {
      const { result, rerender } = renderHook(() => useAuthStatusSelector());

      // Initially unauthenticated
      expect(result.current.isAuthenticated).toBe(false);

      // Update store to authenticated state
      mockZustandStore(useAuthStore, {
        ...mockAuthenticatedSession,
        actions: {} as any,
      });

      rerender();

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should update when user logs out', () => {
      // Start with authenticated state
      mockZustandStore(useAuthStore, {
        ...mockAuthenticatedSession,
        actions: {} as any,
      });

      const { result, rerender } = renderHook(() => useAuthStatusSelector());

      expect(result.current.isAuthenticated).toBe(true);

      // Update store to unauthenticated state
      mockZustandStore(useAuthStore, {
        ...mockUnauthenticatedSession,
        actions: {} as any,
      });

      rerender();

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Selector Performance', () => {
    it('should return consistent value when isAuthenticated stays the same', () => {
      const { result, rerender } = renderHook(() => useAuthStatusSelector());
      const initialIsAuthenticated = result.current.isAuthenticated;

      // Update store with same authentication status but different token
      mockZustandStore(useAuthStore, {
        token: 'different-token',
        expirationDate: '2030-01-01T00:00:00Z',
        isAuthenticated: false, // Same as initial state
        actions: {} as any,
      });

      rerender();

      // Value should be the same even if object reference might be different
      expect(result.current.isAuthenticated).toBe(initialIsAuthenticated);
    });

    it('should return different value when authentication status actually changes', () => {
      const { result, rerender } = renderHook(() => useAuthStatusSelector());
      const initialIsAuthenticated = result.current.isAuthenticated;

      // Update store with different authentication status
      mockZustandStore(useAuthStore, {
        ...mockAuthenticatedSession,
        actions: {} as any,
      });

      rerender();

      // Value should be different
      expect(result.current.isAuthenticated).not.toBe(initialIsAuthenticated);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Return Value Structure', () => {
    it('should return an object with isAuthenticated property', () => {
      const { result } = renderHook(() => useAuthStatusSelector());

      expect(typeof result.current).toBe('object');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(typeof result.current.isAuthenticated).toBe('boolean');
    });

    it('should return consistent structure across different states', () => {
      // Test unauthenticated state
      const { result: unauthResult } = renderHook(() => useAuthStatusSelector());
      const unauthKeys = Object.keys(unauthResult.current);

      // Test authenticated state
      mockZustandStore(useAuthStore, {
        ...mockAuthenticatedSession,
        actions: {} as any,
      });

      const { result: authResult } = renderHook(() => useAuthStatusSelector());
      const authKeys = Object.keys(authResult.current);

      // Structure should be the same
      expect(unauthKeys).toEqual(authKeys);
      expect(unauthKeys).toEqual(['isAuthenticated']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined authentication state gracefully', () => {
      // Setup state with undefined isAuthenticated
      mockZustandStore(useAuthStore, {
        token: '',
        expirationDate: '',
        isAuthenticated: undefined as any,
        actions: {} as any,
      });

      const { result } = renderHook(() => useAuthStatusSelector());

      // Should handle undefined gracefully (falsy value)
      expect(result.current.isAuthenticated).toBeFalsy();
    });

    it('should handle null authentication state gracefully', () => {
      // Setup state with null isAuthenticated
      mockZustandStore(useAuthStore, {
        token: '',
        expirationDate: '',
        isAuthenticated: null as any,
        actions: {} as any,
      });

      const { result } = renderHook(() => useAuthStatusSelector());

      // Should handle null gracefully (falsy value)
      expect(result.current.isAuthenticated).toBeFalsy();
    });
  });

  describe('Integration', () => {
    it('should work correctly with real auth store state changes', () => {
      const { result } = renderHook(() => useAuthStatusSelector());

      // Initial state should be unauthenticated
      expect(result.current.isAuthenticated).toBe(false);

      // Test with a complete authenticated state
      const completeAuthState = {
        token: 'valid-token-123',
        expirationDate: '2030-12-31T23:59:59Z',
        isAuthenticated: true,
        actions: {} as any,
      };

      mockZustandStore(useAuthStore, completeAuthState);

      const { result: authResult } = renderHook(() => useAuthStatusSelector());

      expect(authResult.current.isAuthenticated).toBe(true);
    });
  });
});
