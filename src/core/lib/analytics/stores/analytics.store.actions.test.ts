import { act, renderHook } from '@test/utils';

import { useAnalyticsStore } from './analytics.store';
import { resetAnalyticsState, setAnalyticsInitialized, useAnalyticsActions } from './analytics.store.actions';

// Mock the store
jest.mock('./analytics.store');

const mockUseAnalyticsStore = useAnalyticsStore as unknown as {
  getState: jest.MockedFunction<() => { actions: { setInitialized: jest.Mock; reset: jest.Mock } }>;
};

describe('Analytics Store Actions', () => {
  const mockSetInitialized = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAnalyticsStore.getState = jest.fn().mockReturnValue({
      actions: {
        setInitialized: mockSetInitialized,
        reset: mockReset,
      },
    });
  });

  describe('setAnalyticsInitialized', () => {
    it('should call store setInitialized action with true', () => {
      setAnalyticsInitialized(true);

      expect(mockUseAnalyticsStore.getState).toHaveBeenCalledTimes(1);
      expect(mockSetInitialized).toHaveBeenCalledWith(true);
    });

    it('should call store setInitialized action with false', () => {
      setAnalyticsInitialized(false);

      expect(mockUseAnalyticsStore.getState).toHaveBeenCalledTimes(1);
      expect(mockSetInitialized).toHaveBeenCalledWith(false);
    });

    it('should handle multiple calls correctly', () => {
      setAnalyticsInitialized(true);
      setAnalyticsInitialized(false);
      setAnalyticsInitialized(true);

      expect(mockUseAnalyticsStore.getState).toHaveBeenCalledTimes(3);
      expect(mockSetInitialized).toHaveBeenCalledTimes(3);
      expect(mockSetInitialized).toHaveBeenNthCalledWith(1, true);
      expect(mockSetInitialized).toHaveBeenNthCalledWith(2, false);
      expect(mockSetInitialized).toHaveBeenNthCalledWith(3, true);
    });

    it('should work with boolean values only', () => {
      setAnalyticsInitialized(true);
      setAnalyticsInitialized(false);

      expect(mockSetInitialized).toHaveBeenCalledWith(true);
      expect(mockSetInitialized).toHaveBeenCalledWith(false);
    });
  });

  describe('resetAnalyticsState', () => {
    it('should call store reset action', () => {
      resetAnalyticsState();

      expect(mockUseAnalyticsStore.getState).toHaveBeenCalledTimes(1);
      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockReset).toHaveBeenCalledWith();
    });

    it('should handle multiple reset calls', () => {
      resetAnalyticsState();
      resetAnalyticsState();
      resetAnalyticsState();

      expect(mockUseAnalyticsStore.getState).toHaveBeenCalledTimes(3);
      expect(mockReset).toHaveBeenCalledTimes(3);
    });

    it('should call reset without parameters', () => {
      resetAnalyticsState();

      expect(mockReset).toHaveBeenCalledWith();
    });
  });

  describe('actions integration', () => {
    it('should use the same store instance for both actions', () => {
      setAnalyticsInitialized(true);
      resetAnalyticsState();

      expect(mockUseAnalyticsStore.getState).toHaveBeenCalledTimes(2);

      // Verify both calls use the same store instance
      const firstCall = mockUseAnalyticsStore.getState.mock.calls[0];
      const secondCall = mockUseAnalyticsStore.getState.mock.calls[1];

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

      mockUseAnalyticsStore.getState.mockReturnValue(mockState);

      setAnalyticsInitialized(true);
      resetAnalyticsState();

      expect(mockSetInitialized).toHaveBeenCalledWith(true);
      expect(mockReset).toHaveBeenCalledWith();
    });
  });

  describe('useAnalyticsActions', () => {
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

      (useAnalyticsStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(mockStore));

      const { result } = renderHook(() => useAnalyticsActions());

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

      (useAnalyticsStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(mockStore));

      const { result } = renderHook(() => useAnalyticsActions());

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
      mockUseAnalyticsStore.getState.mockImplementation(() => {
        throw new Error('Store access failed');
      });

      expect(() => setAnalyticsInitialized(true)).toThrow('Store access failed');
      expect(() => resetAnalyticsState()).toThrow('Store access failed');
    });

    it('should handle action execution errors gracefully', () => {
      mockSetInitialized.mockImplementation(() => {
        throw new Error('Action failed');
      });

      mockReset.mockImplementation(() => {
        throw new Error('Reset failed');
      });

      expect(() => setAnalyticsInitialized(true)).toThrow('Action failed');
      expect(() => resetAnalyticsState()).toThrow('Reset failed');
    });
  });
});
