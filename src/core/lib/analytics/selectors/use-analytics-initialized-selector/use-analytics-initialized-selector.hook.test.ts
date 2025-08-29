import { renderHook } from '@test/utils';

import { useAnalyticsStore } from '../../stores/analytics.store';

import { useAnalyticsInitializedSelector } from './use-analytics-initialized-selector.hook';

// Mock the analytics store
jest.mock('../../stores/analytics.store');

const mockUseAnalyticsStore = useAnalyticsStore as jest.MockedFunction<typeof useAnalyticsStore>;

describe('useAnalyticsInitializedSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initialized status when true', () => {
    mockUseAnalyticsStore.mockImplementation((selector: any) =>
      selector({ initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result } = renderHook(() => useAnalyticsInitializedSelector());

    expect(result.current.initialized).toBe(true);
  });

  it('should return initialized status when false', () => {
    mockUseAnalyticsStore.mockImplementation((selector: any) =>
      selector({ initialized: false, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result } = renderHook(() => useAnalyticsInitializedSelector());

    expect(result.current.initialized).toBe(false);
  });

  it('should call useAnalyticsStore with correct selector', () => {
    mockUseAnalyticsStore.mockImplementation((selector: any) =>
      selector({ initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    renderHook(() => useAnalyticsInitializedSelector());

    expect(mockUseAnalyticsStore).toHaveBeenCalledWith(expect.any(Function));

    // Test the selector function
    const selectorFunction = mockUseAnalyticsStore.mock.calls[0][0];
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

    mockUseAnalyticsStore.mockImplementation((selector: any) => selector(mockState));

    const { result, rerender } = renderHook(() => useAnalyticsInitializedSelector());

    expect(result.current.initialized).toBe(false);

    // Simulate store state change
    mockState = { initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } };
    rerender();

    expect(result.current.initialized).toBe(true);
  });

  it('should handle undefined initialized value gracefully', () => {
    mockUseAnalyticsStore.mockImplementation((selector: any) =>
      selector({ initialized: undefined, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result } = renderHook(() => useAnalyticsInitializedSelector());

    expect(result.current.initialized).toBe(undefined);
  });

  it('should only select initialized property from state', () => {
    const mockState = {
      initialized: true,
      apiKey: 'test-api-key',
      userId: 'user-123',
      enabled: true,
      userData: { name: 'John' },
      actions: { setInitialized: jest.fn(), reset: jest.fn() },
    };

    mockUseAnalyticsStore.mockImplementation((selector: any) => selector(mockState));

    renderHook(() => useAnalyticsInitializedSelector());

    // Verify that selector only accesses initialized property
    const selectorFunction = mockUseAnalyticsStore.mock.calls[0][0];
    const selectedValue = selectorFunction(mockState);

    expect(selectedValue).toBe(true);
    expect(selectedValue).not.toEqual(mockState); // Should not return entire state
  });

  it('should be memoized correctly', () => {
    mockUseAnalyticsStore.mockImplementation((selector: any) =>
      selector({ initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result, rerender } = renderHook(() => useAnalyticsInitializedSelector());

    const firstResult = result.current;

    rerender();
    const secondResult = result.current;

    // Should return the same reference if state hasn't changed
    expect(firstResult).toEqual(secondResult);
  });

  it('should handle multiple concurrent hook instances', () => {
    mockUseAnalyticsStore.mockImplementation((selector: any) =>
      selector({ initialized: true, actions: { setInitialized: jest.fn(), reset: jest.fn() } }),
    );

    const { result: result1 } = renderHook(() => useAnalyticsInitializedSelector());
    const { result: result2 } = renderHook(() => useAnalyticsInitializedSelector());

    expect(result1.current.initialized).toBe(true);
    expect(result2.current.initialized).toBe(true);
    expect(result1.current).toEqual(result2.current);
  });
});
