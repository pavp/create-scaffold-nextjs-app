/**
 * @jest-environment jsdom
 */

import { mockZustandStore, renderHook, setupAuthStoreState } from '@test/utils';

import { useAuthStore } from './auth.store';
import { useAuthActions } from './auth.store.actions';

describe('useAuthActions', () => {
  // Mock actions (using actual AuthActions interface)
  const mockActions = {
    setToken: jest.fn(),
    setSession: jest.fn(),
    clearSession: jest.fn(),
    validateSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset all mock functions
    Object.values(mockActions).forEach((mockFn) => {
      mockFn.mockReset();
    });

    // Setup default store state with mocked actions
    mockZustandStore(useAuthStore, {
      ...setupAuthStoreState(),
      actions: mockActions,
    });
  });

  describe('Actions Access', () => {
    it('should return auth actions object', () => {
      const { result } = renderHook(() => useAuthActions());

      expect(result.current).toBe(mockActions);
      expect(result.current).toHaveProperty('setToken');
      expect(result.current).toHaveProperty('setSession');
      expect(result.current).toHaveProperty('clearSession');
      expect(result.current).toHaveProperty('validateSession');
    });

    it('should return all expected action methods', () => {
      const { result } = renderHook(() => useAuthActions());
      const actions = result.current;

      // Verify all actions are functions
      expect(typeof actions.setToken).toBe('function');
      expect(typeof actions.setSession).toBe('function');
      expect(typeof actions.clearSession).toBe('function');
      expect(typeof actions.validateSession).toBe('function');
    });

    it('should maintain reference consistency across renders', () => {
      const { result, rerender } = renderHook(() => useAuthActions());
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      // Should return the same object reference
      expect(firstResult).toBe(secondResult);
    });
  });

  describe('Action Functionality', () => {
    it('should allow calling setToken action', () => {
      const { result } = renderHook(() => useAuthActions());
      const token = 'new-auth-token';

      result.current.setToken(token);

      expect(mockActions.setToken).toHaveBeenCalledWith(token);
      expect(mockActions.setToken).toHaveBeenCalledTimes(1);
    });

    it('should allow calling setSession action', () => {
      const { result } = renderHook(() => useAuthActions());
      const session = {
        token: 'session-token',
        expirationDate: new Date().toISOString(),
        isAuthenticated: true,
      };

      result.current.setSession(session);

      expect(mockActions.setSession).toHaveBeenCalledWith(session);
      expect(mockActions.setSession).toHaveBeenCalledTimes(1);
    });

    it('should allow calling clearSession action', () => {
      const { result } = renderHook(() => useAuthActions());

      result.current.clearSession();

      expect(mockActions.clearSession).toHaveBeenCalledWith();
      expect(mockActions.clearSession).toHaveBeenCalledTimes(1);
    });

    it('should allow calling validateSession action', () => {
      const { result } = renderHook(() => useAuthActions());

      mockActions.validateSession.mockReturnValue(true);
      const isValid = result.current.validateSession();

      expect(mockActions.validateSession).toHaveBeenCalledWith();
      expect(mockActions.validateSession).toHaveBeenCalledTimes(1);
      expect(isValid).toBe(true);
    });

    it('should handle validateSession returning false', () => {
      const { result } = renderHook(() => useAuthActions());

      mockActions.validateSession.mockReturnValue(false);
      const isValid = result.current.validateSession();

      expect(mockActions.validateSession).toHaveBeenCalledWith();
      expect(isValid).toBe(false);
    });
  });

  describe('Multiple Action Calls', () => {
    it('should handle multiple consecutive action calls', () => {
      const { result } = renderHook(() => useAuthActions());

      // Call multiple actions
      result.current.setToken('token1');
      result.current.setSession({ isAuthenticated: true });
      result.current.validateSession();
      result.current.clearSession();

      expect(mockActions.setToken).toHaveBeenCalledTimes(1);
      expect(mockActions.setSession).toHaveBeenCalledTimes(1);
      expect(mockActions.validateSession).toHaveBeenCalledTimes(1);
      expect(mockActions.clearSession).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid successive calls to same action', () => {
      const { result } = renderHook(() => useAuthActions());

      // Call same action multiple times
      result.current.validateSession();
      result.current.validateSession();
      result.current.validateSession();

      expect(mockActions.validateSession).toHaveBeenCalledTimes(3);
    });

    it('should preserve action arguments across multiple calls', () => {
      const { result } = renderHook(() => useAuthActions());

      const token1 = 'first-token';
      const token2 = 'second-token';

      result.current.setToken(token1);
      result.current.setToken(token2);

      expect(mockActions.setToken).toHaveBeenNthCalledWith(1, token1);
      expect(mockActions.setToken).toHaveBeenNthCalledWith(2, token2);
      expect(mockActions.setToken).toHaveBeenCalledTimes(2);
    });

    it('should handle complex session updates', () => {
      const { result } = renderHook(() => useAuthActions());

      const session1 = { token: 'token1', isAuthenticated: true };
      const session2 = { expirationDate: new Date().toISOString() };

      result.current.setSession(session1);
      result.current.setSession(session2);

      expect(mockActions.setSession).toHaveBeenNthCalledWith(1, session1);
      expect(mockActions.setSession).toHaveBeenNthCalledWith(2, session2);
      expect(mockActions.setSession).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should work when actions are undefined', () => {
      // Mock store without actions
      mockZustandStore(useAuthStore, {
        ...setupAuthStoreState(),
        actions: undefined,
      });

      const { result } = renderHook(() => useAuthActions());

      expect(result.current).toBeUndefined();
    });

    it('should work when actions is null', () => {
      // Mock store with null actions
      mockZustandStore(useAuthStore, {
        ...setupAuthStoreState(),
        actions: null,
      });

      const { result } = renderHook(() => useAuthActions());

      expect(result.current).toBeNull();
    });

    it('should work when actions is an empty object', () => {
      // Mock store with empty actions object
      mockZustandStore(useAuthStore, {
        ...setupAuthStoreState(),
        actions: {},
      });

      const { result } = renderHook(() => useAuthActions());

      expect(result.current).toEqual({});
    });

    it('should work when only some actions are present', () => {
      const partialActions = {
        setToken: jest.fn(),
        clearSession: jest.fn(),
        // Missing setSession and validateSession
      };

      mockZustandStore(useAuthStore, {
        ...setupAuthStoreState(),
        actions: partialActions,
      });

      const { result } = renderHook(() => useAuthActions());

      expect(result.current).toBe(partialActions);
      expect(result.current).toHaveProperty('setToken');
      expect(result.current).toHaveProperty('clearSession');
      expect(result.current).not.toHaveProperty('setSession');
      expect(result.current).not.toHaveProperty('validateSession');
    });

    it('should handle null and undefined token values', () => {
      const { result } = renderHook(() => useAuthActions());

      result.current.setToken(null as any);
      result.current.setToken(undefined as any);

      expect(mockActions.setToken).toHaveBeenNthCalledWith(1, null);
      expect(mockActions.setToken).toHaveBeenNthCalledWith(2, undefined);
      expect(mockActions.setToken).toHaveBeenCalledTimes(2);
    });

    it('should handle empty and partial session objects', () => {
      const { result } = renderHook(() => useAuthActions());

      result.current.setSession({});
      result.current.setSession({ token: 'only-token' });

      expect(mockActions.setSession).toHaveBeenNthCalledWith(1, {});
      expect(mockActions.setSession).toHaveBeenNthCalledWith(2, { token: 'only-token' });
      expect(mockActions.setSession).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance', () => {
    it('should not create new action references on re-render', () => {
      const { result, rerender } = renderHook(() => useAuthActions());
      const firstActions = result.current;

      rerender();
      const secondActions = result.current;

      // Should be the exact same reference
      expect(firstActions).toBe(secondActions);
      expect(firstActions.setToken).toBe(secondActions.setToken);
      expect(firstActions.clearSession).toBe(secondActions.clearSession);
    });

    it('should be optimized for frequent access', () => {
      const renderSpy = jest.fn();

      const { rerender } = renderHook(() => {
        renderSpy();

        return useAuthActions();
      });

      // Multiple re-renders should not cause performance issues
      for (let i = 0; i < 10; i++) {
        rerender();
      }

      expect(renderSpy).toHaveBeenCalledTimes(11); // Initial + 10 re-renders
    });

    it('should handle high-frequency action calls efficiently', () => {
      const { result } = renderHook(() => useAuthActions());

      // Simulate high-frequency validation calls
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        result.current.validateSession();
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete quickly (under 100ms for 100 calls)
      expect(executionTime).toBeLessThan(100);
      expect(mockActions.validateSession).toHaveBeenCalledTimes(100);
    });
  });

  describe('Integration', () => {
    it('should work correctly with store updates', () => {
      const { result, rerender } = renderHook(() => useAuthActions());
      const initialActions = result.current;

      // Update store with new actions
      const newActions = {
        ...mockActions,
        newAction: jest.fn(),
      };

      mockZustandStore(useAuthStore, {
        ...setupAuthStoreState(),
        actions: newActions,
      });

      rerender();
      const updatedActions = result.current;

      expect(updatedActions).toBe(newActions);
      expect(updatedActions).not.toBe(initialActions);
      expect(updatedActions).toHaveProperty('newAction');
    });

    it('should maintain consistent behavior across component instances', () => {
      const { result: result1 } = renderHook(() => useAuthActions());
      const { result: result2 } = renderHook(() => useAuthActions());

      // Both should return the same actions object
      expect(result1.current).toBe(result2.current);

      // Actions called from either should work the same
      result1.current.setToken('test-token');
      result2.current.clearSession();

      expect(mockActions.setToken).toHaveBeenCalledTimes(1);
      expect(mockActions.clearSession).toHaveBeenCalledTimes(1);
    });

    it('should work correctly when used with other auth selectors', () => {
      // Mock a complete auth state
      mockZustandStore(useAuthStore, {
        token: 'auth-token',
        expirationDate: new Date().toISOString(),
        isAuthenticated: true,
        actions: mockActions,
      });

      const { result: actionsResult } = renderHook(() => useAuthActions());
      const { result: storeResult } = renderHook(() => useAuthStore());

      // Actions should be accessible from both
      expect(actionsResult.current).toBe(storeResult.current.actions);
      expect(actionsResult.current).toBe(mockActions);
    });

    it('should work correctly with real auth workflow', () => {
      const { result } = renderHook(() => useAuthActions());

      // Simulate login workflow
      const token = 'workflow-token';
      const expirationDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      result.current.setToken(token);
      result.current.setSession({
        token,
        expirationDate,
        isAuthenticated: true,
      });

      mockActions.validateSession.mockReturnValue(true);
      const isValid = result.current.validateSession();

      // Simulate logout
      result.current.clearSession();

      expect(mockActions.setToken).toHaveBeenCalledWith(token);
      expect(mockActions.setSession).toHaveBeenCalledWith({
        token,
        expirationDate,
        isAuthenticated: true,
      });
      expect(isValid).toBe(true);
      expect(mockActions.clearSession).toHaveBeenCalled();
    });
  });
});
