import { renderHook } from '@test/utils';

import { useFeedbackStore } from '../../stores/feedback.store';

import { useFeedbackInitializedSelector } from './use-feedback-initialized-selector.hook';

// Mock the feedback store
jest.mock('../../stores/feedback.store');

const mockUseFeedbackStore = useFeedbackStore as jest.MockedFunction<typeof useFeedbackStore>;

describe('useFeedbackInitializedSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initialized status when true', () => {
    mockUseFeedbackStore.mockImplementation((selector: any) =>
      selector({ initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result } = renderHook(() => useFeedbackInitializedSelector());

    expect(result.current.initialized).toBe(true);
  });

  it('should return initialized status when false', () => {
    mockUseFeedbackStore.mockImplementation((selector: any) =>
      selector({ initialized: false, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result } = renderHook(() => useFeedbackInitializedSelector());

    expect(result.current.initialized).toBe(false);
  });

  it('should call useFeedbackStore with correct selector', () => {
    mockUseFeedbackStore.mockImplementation((selector: any) =>
      selector({ initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    renderHook(() => useFeedbackInitializedSelector());

    expect(mockUseFeedbackStore).toHaveBeenCalledWith(expect.any(Function));

    // Test the selector function
    const selectorFunction = mockUseFeedbackStore.mock.calls[0][0];
    const mockState = {
      initialized: true,
      otherProp: 'ignored',
      actions: { setInitialized: jest.fn(), reset: jest.fn() },
    };
    const result = selectorFunction(mockState);

    expect(result).toBe(true);
  });

  it('should update when store state changes', () => {
    let mockState = { initialized: false, actions: { setInitialized: jest.fn(), reset: jest.fn() } };

    mockUseFeedbackStore.mockImplementation((selector: any) => selector(mockState));

    const { result, rerender } = renderHook(() => useFeedbackInitializedSelector());

    expect(result.current.initialized).toBe(false);

    // Simulate store state change
    mockState = { initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } };
    rerender();

    expect(result.current.initialized).toBe(true);
  });

  it('should handle undefined initialized value gracefully', () => {
    mockUseFeedbackStore.mockImplementation((selector: any) =>
      selector({ initialized: undefined, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result } = renderHook(() => useFeedbackInitializedSelector());

    expect(result.current.initialized).toBe(undefined);
  });

  it('should only select initialized property from state', () => {
    const mockState = {
      initialized: true,
      userId: 'user-123',
      websiteId: 'site-456',
      enabled: true,
      otherData: { complex: 'object' },
      actions: { setInitialized: jest.fn(), reset: jest.fn() },
    };

    mockUseFeedbackStore.mockImplementation((selector: any) => selector(mockState));

    renderHook(() => useFeedbackInitializedSelector());

    // Verify that selector only accesses initialized property
    const selectorFunction = mockUseFeedbackStore.mock.calls[0][0];
    const selectedValue = selectorFunction(mockState);

    expect(selectedValue).toBe(true);
    expect(selectedValue).not.toEqual(mockState); // Should not return entire state
  });

  it('should be memoized correctly', () => {
    mockUseFeedbackStore.mockImplementation((selector: any) =>
      selector({ initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result, rerender } = renderHook(() => useFeedbackInitializedSelector());

    const firstResult = result.current;

    rerender();
    const secondResult = result.current;

    // Should return the same reference if state hasn't changed
    expect(firstResult).toEqual(secondResult);
  });
});
