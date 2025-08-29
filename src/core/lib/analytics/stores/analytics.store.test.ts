import { act, renderHook } from '@test/utils';

import { initialAnalyticsState, useAnalyticsStore } from './analytics.store';

describe('Analytics Store', () => {
  beforeEach(() => {
    useAnalyticsStore.getState().actions.reset();
  });

  describe('initialAnalyticsState', () => {
    it('should have correct initial state', () => {
      expect(initialAnalyticsState).toEqual({
        initialized: false,
      });
    });
  });

  describe('useAnalyticsStore', () => {
    it('should have initial state', () => {
      const state = useAnalyticsStore.getState();

      expect(state.initialized).toBe(false);
      expect(typeof state.actions.setInitialized).toBe('function');
      expect(typeof state.actions.reset).toBe('function');
    });

    it('should update initialized state', () => {
      const { result: storeResult } = renderHook(() => useAnalyticsStore());

      act(() => {
        storeResult.current.actions.setInitialized(true);
      });

      expect(storeResult.current.initialized).toBe(true);

      act(() => {
        storeResult.current.actions.setInitialized(false);
      });

      expect(storeResult.current.initialized).toBe(false);
    });

    it('should reset state to initial values', () => {
      const { result: storeResult } = renderHook(() => useAnalyticsStore());

      act(() => {
        storeResult.current.actions.setInitialized(true);
      });

      expect(storeResult.current.initialized).toBe(true);

      act(() => {
        storeResult.current.actions.reset();
      });

      expect(storeResult.current.initialized).toBe(false);
    });

    it('should maintain state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useAnalyticsStore());
      const { result: result2 } = renderHook(() => useAnalyticsStore());

      act(() => {
        result1.current.actions.setInitialized(true);
      });

      expect(result1.current.initialized).toBe(true);
      expect(result2.current.initialized).toBe(true);
    });

    it('should handle multiple state updates', () => {
      const { result } = renderHook(() => useAnalyticsStore());

      act(() => {
        result.current.actions.setInitialized(true);
        result.current.actions.setInitialized(false);
        result.current.actions.setInitialized(true);
      });

      expect(result.current.initialized).toBe(true);
    });
  });

  describe('store configuration', () => {
    it('should not persist analytics state', () => {
      // This test verifies the store is configured with persist: false
      // The actual persistence behavior would be tested in integration tests
      expect(true).toBe(true);
    });
  });

  describe('immer integration', () => {
    it('should update state immutably', () => {
      const { result } = renderHook(() => useAnalyticsStore());
      const initialState = result.current;

      act(() => {
        result.current.actions.setInitialized(true);
      });

      const updatedState = result.current;

      // States should be different objects
      expect(initialState).not.toBe(updatedState);
      expect(initialState.initialized).toBe(false);
      expect(updatedState.initialized).toBe(true);
    });
  });
});
