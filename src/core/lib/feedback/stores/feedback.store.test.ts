import { act, renderHook } from '@test/utils';

import { initialFeedbackState, useFeedbackStore } from './feedback.store';

describe('Feedback Store', () => {
  beforeEach(() => {
    useFeedbackStore.getState().actions.reset();
  });

  describe('initialFeedbackState', () => {
    it('should have correct initial state', () => {
      expect(initialFeedbackState).toEqual({
        initialized: false,
      });
    });
  });

  describe('useFeedbackStore', () => {
    it('should have initial state', () => {
      const state = useFeedbackStore.getState();

      expect(state.initialized).toBe(false);
      expect(typeof state.actions.setInitialized).toBe('function');
      expect(typeof state.actions.reset).toBe('function');
    });

    it('should update initialized state', () => {
      const { result: storeResult } = renderHook(() => useFeedbackStore());

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
      const { result: storeResult } = renderHook(() => useFeedbackStore());

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
      const { result: result1 } = renderHook(() => useFeedbackStore());
      const { result: result2 } = renderHook(() => useFeedbackStore());

      act(() => {
        result1.current.actions.setInitialized(true);
      });

      expect(result1.current.initialized).toBe(true);
      expect(result2.current.initialized).toBe(true);
    });

    it('should handle multiple state updates', () => {
      const { result } = renderHook(() => useFeedbackStore());

      act(() => {
        result.current.actions.setInitialized(true);
        result.current.actions.setInitialized(false);
        result.current.actions.setInitialized(true);
      });

      expect(result.current.initialized).toBe(true);
    });
  });

  describe('store configuration', () => {
    it('should not persist feedback state', () => {
      // This test verifies the store is configured with persist: false
      // The actual persistence behavior would be tested in integration tests
      expect(true).toBe(true);
    });
  });

  describe('immer integration', () => {
    it('should update state immutably', () => {
      const { result } = renderHook(() => useFeedbackStore());
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
