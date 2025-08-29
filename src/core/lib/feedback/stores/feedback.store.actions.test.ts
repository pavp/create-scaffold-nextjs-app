import { act, renderHook } from '@test/utils';

import { useFeedbackStore } from './feedback.store';
import { resetFeedbackState, setFeedbackInitialized, useFeedbackActions } from './feedback.store.actions';

// Mock the store
jest.mock('./feedback.store');

const mockUseFeedbackStore = useFeedbackStore as unknown as {
  getState: jest.MockedFunction<() => { actions: { setInitialized: jest.Mock; reset: jest.Mock } }>;
};

describe('Feedback Store Actions', () => {
  const mockSetInitialized = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFeedbackStore.getState = jest.fn().mockReturnValue({
      actions: {
        setInitialized: mockSetInitialized,
        reset: mockReset,
      },
    });
  });

  describe('setFeedbackInitialized', () => {
    it('should call store setInitialized action with true', () => {
      setFeedbackInitialized(true);

      expect(mockUseFeedbackStore.getState).toHaveBeenCalledTimes(1);
      expect(mockSetInitialized).toHaveBeenCalledWith(true);
    });

    it('should call store setInitialized action with false', () => {
      setFeedbackInitialized(false);

      expect(mockUseFeedbackStore.getState).toHaveBeenCalledTimes(1);
      expect(mockSetInitialized).toHaveBeenCalledWith(false);
    });

    it('should handle multiple calls correctly', () => {
      setFeedbackInitialized(true);
      setFeedbackInitialized(false);
      setFeedbackInitialized(true);

      expect(mockUseFeedbackStore.getState).toHaveBeenCalledTimes(3);
      expect(mockSetInitialized).toHaveBeenCalledTimes(3);
      expect(mockSetInitialized).toHaveBeenNthCalledWith(1, true);
      expect(mockSetInitialized).toHaveBeenNthCalledWith(2, false);
      expect(mockSetInitialized).toHaveBeenNthCalledWith(3, true);
    });

    it('should work with boolean values only', () => {
      setFeedbackInitialized(true);
      setFeedbackInitialized(false);

      expect(mockSetInitialized).toHaveBeenCalledWith(true);
      expect(mockSetInitialized).toHaveBeenCalledWith(false);
    });
  });

  describe('resetFeedbackState', () => {
    it('should call store reset action', () => {
      resetFeedbackState();

      expect(mockUseFeedbackStore.getState).toHaveBeenCalledTimes(1);
      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockReset).toHaveBeenCalledWith();
    });

    it('should handle multiple reset calls', () => {
      resetFeedbackState();
      resetFeedbackState();
      resetFeedbackState();

      expect(mockUseFeedbackStore.getState).toHaveBeenCalledTimes(3);
      expect(mockReset).toHaveBeenCalledTimes(3);
    });

    it('should call reset without parameters', () => {
      resetFeedbackState();

      expect(mockReset).toHaveBeenCalledWith();
    });
  });

  describe('actions integration', () => {
    it('should use the same store instance for both actions', () => {
      setFeedbackInitialized(true);
      resetFeedbackState();

      expect(mockUseFeedbackStore.getState).toHaveBeenCalledTimes(2);

      // Verify both calls use the same store instance
      const firstCall = mockUseFeedbackStore.getState.mock.calls[0];
      const secondCall = mockUseFeedbackStore.getState.mock.calls[1];

      expect(firstCall).toEqual(secondCall);
    });

    it('should access actions correctly from store state', () => {
      const mockState = {
        initialized: false,
        actions: {
          setInitialized: mockSetInitialized,
          reset: mockReset,
        },
      };

      mockUseFeedbackStore.getState.mockReturnValue(mockState);

      setFeedbackInitialized(true);
      resetFeedbackState();

      expect(mockSetInitialized).toHaveBeenCalledWith(true);
      expect(mockReset).toHaveBeenCalledWith();
    });
  });

  describe('useFeedbackActions', () => {
    beforeEach(() => {
      // Reset the mock for hook tests
      jest.resetAllMocks();
    });

    it('should return only actions from store', () => {
      const mockStore = {
        initialized: false,
        actions: {
          setInitialized: jest.fn(),
          reset: jest.fn(),
        },
      };

      (useFeedbackStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(mockStore));

      const { result } = renderHook(() => useFeedbackActions());

      expect(result.current).toHaveProperty('setInitialized');
      expect(result.current).toHaveProperty('reset');
      expect(typeof result.current.setInitialized).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('should allow actions to modify store state', () => {
      const mockActions = {
        setInitialized: jest.fn(),
        reset: jest.fn(),
      };

      const mockStore = {
        initialized: false,
        actions: mockActions,
      };

      (useFeedbackStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(mockStore));

      const { result } = renderHook(() => useFeedbackActions());

      act(() => {
        result.current.setInitialized(true);
      });

      expect(mockActions.setInitialized).toHaveBeenCalledWith(true);

      act(() => {
        result.current.reset();
      });

      expect(mockActions.reset).toHaveBeenCalledWith();
    });
  });

  describe('error handling', () => {
    it('should handle getState errors gracefully', () => {
      mockUseFeedbackStore.getState.mockImplementation(() => {
        throw new Error('Store access failed');
      });

      expect(() => setFeedbackInitialized(true)).toThrow('Store access failed');
      expect(() => resetFeedbackState()).toThrow('Store access failed');
    });

    it('should handle action execution errors gracefully', () => {
      mockSetInitialized.mockImplementation(() => {
        throw new Error('Action failed');
      });

      mockReset.mockImplementation(() => {
        throw new Error('Reset failed');
      });

      expect(() => setFeedbackInitialized(true)).toThrow('Action failed');
      expect(() => resetFeedbackState()).toThrow('Reset failed');
    });
  });
});
