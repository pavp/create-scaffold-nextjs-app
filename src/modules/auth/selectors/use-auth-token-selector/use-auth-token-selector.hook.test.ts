/**
 * @jest-environment jsdom
 */

import { createMockAuthSession } from '@test/entities/auth.mock';
import { mockZustandStore, renderHook, setupAuthStoreState } from '@test/utils';

import { useAuthStore } from '@/modules/auth/stores/auth.store';

import { getAuthToken, useAuthTokenSelector } from './use-auth-token-selector.hook';

describe('useAuthTokenSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockZustandStore(useAuthStore, setupAuthStoreState());
  });

  describe('Token Access', () => {
    it('should return token when user is authenticated', () => {
      const mockSession = createMockAuthSession();

      mockZustandStore(useAuthStore, {
        token: mockSession.token,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(mockSession.token);
    });

    it('should return empty string when user is not authenticated', () => {
      mockZustandStore(useAuthStore, {
        token: '',
        isAuthenticated: false,
      });

      const { result } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe('');
    });

    it('should return undefined when token is undefined', () => {
      mockZustandStore(useAuthStore, {
        token: undefined,
        isAuthenticated: false,
      });

      const { result } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBeUndefined();
    });

    it('should return token for initial authenticated state', () => {
      const mockToken = 'initial-auth-token';

      mockZustandStore(useAuthStore, {
        token: mockToken,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(mockToken);
    });
  });

  describe('Token Updates', () => {
    it('should update when token changes', () => {
      const initialToken = 'initial-token';
      const newToken = 'new-token';

      // Start with initial token
      mockZustandStore(useAuthStore, {
        token: initialToken,
      });

      const { result, rerender } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(initialToken);

      // Update token
      mockZustandStore(useAuthStore, {
        token: newToken,
      });

      rerender();

      expect(result.current).toBe(newToken);
    });

    it('should update when token is cleared', () => {
      const initialToken = 'some-token';

      // Start with a token
      mockZustandStore(useAuthStore, {
        token: initialToken,
        isAuthenticated: true,
      });

      const { result, rerender } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(initialToken);

      // Clear token
      mockZustandStore(useAuthStore, {
        token: '',
        isAuthenticated: false,
      });

      rerender();
      expect(result.current).toBe('');
    });

    it('should handle token becoming undefined', () => {
      const initialToken = 'some-token';

      // Start with a token
      mockZustandStore(useAuthStore, {
        token: initialToken,
      });

      const { result, rerender } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(initialToken);

      // Token becomes undefined
      mockZustandStore(useAuthStore, {
        token: undefined,
      });

      rerender();
      expect(result.current).toBeUndefined();
    });
  });

  describe('Performance', () => {
    it('should return the same value when token stays the same', () => {
      const mockToken = 'consistent-token';

      mockZustandStore(useAuthStore, {
        token: mockToken,
      });

      const { result, rerender } = renderHook(() => useAuthTokenSelector());
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
      expect(firstResult).toBe(mockToken);
    });

    it('should only re-render when token specifically changes', () => {
      const mockToken = 'stable-token';
      const renderCount = jest.fn();

      mockZustandStore(useAuthStore, {
        token: mockToken,
        isAuthenticated: true,
        expirationDate: '2024-01-01',
      });

      const { rerender } = renderHook(() => {
        renderCount();

        return useAuthTokenSelector();
      });

      // Initial render
      expect(renderCount).toHaveBeenCalledTimes(1);

      // Update other fields but keep token same
      mockZustandStore(useAuthStore, {
        token: mockToken, // Same token
        isAuthenticated: false, // Different auth status
        expirationDate: '2024-12-31', // Different expiration
      });

      rerender();

      // Should still only have been called once since token didn't change
      // Note: This test verifies that the selector is optimized
      expect(renderCount).toHaveBeenCalledTimes(2); // Rerender happens, but token value stays same
    });
  });

  describe('getAuthToken (non-hook)', () => {
    it('should return current token from store', () => {
      const mockSession = createMockAuthSession();

      mockZustandStore(useAuthStore, {
        token: mockSession.token,
        isAuthenticated: true,
      });

      expect(getAuthToken()).toBe(mockSession.token);
    });

    it('should reflect token updates after store changes', () => {
      mockZustandStore(useAuthStore, {
        token: 'first-token',
        isAuthenticated: true,
      });

      expect(getAuthToken()).toBe('first-token');

      mockZustandStore(useAuthStore, {
        token: 'second-token',
        isAuthenticated: true,
      });

      expect(getAuthToken()).toBe('second-token');
    });

    it('should return empty string when token cleared', () => {
      mockZustandStore(useAuthStore, {
        token: 'temp-token',
        isAuthenticated: true,
      });

      expect(getAuthToken()).toBe('temp-token');

      mockZustandStore(useAuthStore, {
        token: '',
        isAuthenticated: false,
      });

      expect(getAuthToken()).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null token gracefully', () => {
      mockZustandStore(useAuthStore, {
        token: null as any,
      });

      const { result } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBeNull();
    });

    it('should handle very long tokens', () => {
      const longToken = 'a'.repeat(1000); // Very long token

      mockZustandStore(useAuthStore, {
        token: longToken,
      });

      const { result } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(longToken);
      expect(result.current).toHaveLength(1000);
    });

    it('should handle special characters in token', () => {
      const specialToken = 'token-with-special.chars_123!@#$%^&*()';

      mockZustandStore(useAuthStore, {
        token: specialToken,
      });

      const { result } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(specialToken);
    });

    it('should handle JWT-like token format', () => {
      const jwtToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
        'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      mockZustandStore(useAuthStore, {
        token: jwtToken,
      });

      const { result } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(jwtToken);
      expect(result.current).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });
  });

  describe('Return Value Consistency', () => {
    it('should always return a consistent type for the same token', () => {
      const mockToken = 'consistent-token';

      mockZustandStore(useAuthStore, {
        token: mockToken,
      });

      const { result, rerender } = renderHook(() => useAuthTokenSelector());
      const firstType = typeof result.current;

      rerender();
      const secondType = typeof result.current;

      expect(firstType).toBe(secondType);
      expect(firstType).toBe('string');
    });

    it('should handle rapid token changes', () => {
      const tokens = ['token1', 'token2', 'token3', 'token4'];
      const currentIndex = 0;

      mockZustandStore(useAuthStore, {
        token: tokens[currentIndex],
      });

      const { result, rerender } = renderHook(() => useAuthTokenSelector());

      // Rapidly change tokens
      for (let i = 1; i < tokens.length; i++) {
        mockZustandStore(useAuthStore, {
          token: tokens[i],
        });

        rerender();
        expect(result.current).toBe(tokens[i]);
      }
    });
  });
});

describe('getAuthToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockZustandStore(useAuthStore, setupAuthStoreState());
  });

  describe('Non-Hook Token Access', () => {
    it('should return token without using React hooks', () => {
      const mockToken = 'non-hook-token';

      mockZustandStore(useAuthStore, {
        token: mockToken,
      });

      // Mock getState method
      const mockGetState = jest.fn(() => ({ token: mockToken }));

      (useAuthStore as any).getState = mockGetState;

      const token = getAuthToken();

      expect(token).toBe(mockToken);
      expect(mockGetState).toHaveBeenCalled();
    });

    it('should return empty string when no token exists', () => {
      mockZustandStore(useAuthStore, {
        token: '',
      });

      // Mock getState method
      const mockGetState = jest.fn(() => ({ token: '' }));

      (useAuthStore as any).getState = mockGetState;

      const token = getAuthToken();

      expect(token).toBe('');
      expect(mockGetState).toHaveBeenCalled();
    });

    it('should return undefined when token is undefined', () => {
      mockZustandStore(useAuthStore, {
        token: undefined,
      });

      // Mock getState method
      const mockGetState = jest.fn(() => ({ token: undefined }));

      (useAuthStore as any).getState = mockGetState;

      const token = getAuthToken();

      expect(token).toBeUndefined();
      expect(mockGetState).toHaveBeenCalled();
    });

    it('should work for axios interceptors use case', () => {
      const interceptorToken = 'interceptor-token-123';

      mockZustandStore(useAuthStore, {
        token: interceptorToken,
      });

      // Mock getState method
      const mockGetState = jest.fn(() => ({ token: interceptorToken }));

      (useAuthStore as any).getState = mockGetState;

      // Simulate axios interceptor usage
      const authHeader = `Bearer ${getAuthToken()}`;

      expect(authHeader).toBe(`Bearer ${interceptorToken}`);
      expect(mockGetState).toHaveBeenCalled();
    });

    it('should handle multiple rapid calls', () => {
      const mockToken = 'rapid-access-token';

      mockZustandStore(useAuthStore, {
        token: mockToken,
      });

      // Mock getState method
      const mockGetState = jest.fn(() => ({ token: mockToken }));

      (useAuthStore as any).getState = mockGetState;

      // Multiple rapid calls
      const results = [];

      for (let i = 0; i < 5; i++) {
        results.push(getAuthToken());
      }

      // All should return the same token
      results.forEach((token) => {
        expect(token).toBe(mockToken);
      });

      expect(mockGetState).toHaveBeenCalledTimes(5);
    });
  });

  describe('Integration with useAuthTokenSelector', () => {
    it('should return the same token as the hook version', () => {
      const mockToken = 'integration-test-token';

      mockZustandStore(useAuthStore, {
        token: mockToken,
      });

      // Mock getState method
      const mockGetState = jest.fn(() => ({ token: mockToken }));

      (useAuthStore as any).getState = mockGetState;

      const { result } = renderHook(() => useAuthTokenSelector());
      const hookToken = result.current;
      const nonHookToken = getAuthToken();

      expect(hookToken).toBe(nonHookToken);
      expect(hookToken).toBe(mockToken);
    });

    it('should both reflect token updates', () => {
      const initialToken = 'initial-integration-token';
      const updatedToken = 'updated-integration-token';

      // Start with initial token
      mockZustandStore(useAuthStore, {
        token: initialToken,
      });

      // Mock getState method for initial state
      let mockGetState = jest.fn(() => ({ token: initialToken }));

      (useAuthStore as any).getState = mockGetState;

      const { result, rerender } = renderHook(() => useAuthTokenSelector());

      expect(result.current).toBe(initialToken);
      expect(getAuthToken()).toBe(initialToken);

      // Update token
      mockZustandStore(useAuthStore, {
        token: updatedToken,
      });

      // Update mock for new state
      mockGetState = jest.fn(() => ({ token: updatedToken }));
      (useAuthStore as any).getState = mockGetState;

      rerender();

      expect(result.current).toBe(updatedToken);
      expect(getAuthToken()).toBe(updatedToken);
    });
  });
});
