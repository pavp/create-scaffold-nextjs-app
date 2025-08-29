import { act, renderHookWithProviders } from '@test/utils';

import { todoRepository } from '@/modules/todo/repositories/todo';

import { useErrorTestBusiness } from './use-error-test-business.hook';

// Mock the todo repository
jest.mock('../../../../repositories/todo', () => ({
  todoRepository: {
    queries: {
      useTestError: jest.fn(() => ({
        isFetching: false,
        refetch: jest.fn(),
      })),
    },
    mutations: {
      useTestError: jest.fn(() => ({
        isPending: false,
        mutate: jest.fn(),
      })),
    },
  },
}));

describe('useErrorTestBusiness', () => {
  const mockRefetch = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (todoRepository.queries.useTestError as jest.Mock).mockReturnValue({
      isFetching: false,
      refetch: mockRefetch,
    });

    (todoRepository.mutations.useTestError as jest.Mock).mockReturnValue({
      isPending: false,
      mutate: mockMutate,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.triggerErrorTest).toBe('function');
  });

  it('should initialize with localStorage data source', () => {
    const { result } = renderHookWithProviders(() => useErrorTestBusiness('localStorage'));

    expect(result.current.isLoading).toBe(false);

    // Verify repository hooks were called with localStorage
    expect(todoRepository.queries.useTestError).toHaveBeenCalledWith('validation', 'localStorage', { enabled: false });
    expect(todoRepository.mutations.useTestError).toHaveBeenCalledWith('localStorage');
  });

  it('should use mutation for zod-request error type', () => {
    const { result } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    act(() => {
      result.current.triggerErrorTest('zod-request');
    });

    expect(mockMutate).toHaveBeenCalledWith('zod-request');
    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it('should use query for non-zod-request error types', () => {
    jest.useFakeTimers();
    const { result } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    act(() => {
      result.current.triggerErrorTest('validation');
    });

    // Fast-forward timer to trigger refetch
    act(() => {
      jest.runAllTimers();
    });

    expect(mockRefetch).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should handle different error types with query', () => {
    jest.useFakeTimers();
    const { result } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    const errorTypes = ['validation', 'unauthorized', 'forbidden', 'notfound', 'server', 'network', 'generic'] as const;

    errorTypes.forEach((errorType) => {
      act(() => {
        result.current.triggerErrorTest(errorType);
      });
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockRefetch).toHaveBeenCalledTimes(errorTypes.length);

    jest.useRealTimers();
  });

  it('should return loading state from query', () => {
    (todoRepository.queries.useTestError as jest.Mock).mockReturnValue({
      isFetching: true,
      refetch: mockRefetch,
    });

    const { result } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    expect(result.current.isLoading).toBe(true);
  });

  it('should return loading state from mutation', () => {
    (todoRepository.mutations.useTestError as jest.Mock).mockReturnValue({
      isPending: true,
      mutate: mockMutate,
    });

    const { result } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    expect(result.current.isLoading).toBe(true);
  });

  it('should return loading state when both query and mutation are loading', () => {
    (todoRepository.queries.useTestError as jest.Mock).mockReturnValue({
      isFetching: true,
      refetch: mockRefetch,
    });

    (todoRepository.mutations.useTestError as jest.Mock).mockReturnValue({
      isPending: true,
      mutate: mockMutate,
    });

    const { result } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    expect(result.current.isLoading).toBe(true);
  });

  it('should have stable function references', () => {
    const { result, rerender } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    const initialTriggerErrorTest = result.current.triggerErrorTest;

    rerender();

    expect(result.current.triggerErrorTest).toBe(initialTriggerErrorTest);
  });

  it('should update current error type when triggering test', () => {
    jest.useFakeTimers();
    const { result } = renderHookWithProviders(() => useErrorTestBusiness('http'));

    act(() => {
      result.current.triggerErrorTest('server');
    });

    act(() => {
      jest.runAllTimers();
    });

    // Verify the query was called with the new error type
    expect(todoRepository.queries.useTestError).toHaveBeenCalledWith('server', 'http', { enabled: false });

    jest.useRealTimers();
  });
});
