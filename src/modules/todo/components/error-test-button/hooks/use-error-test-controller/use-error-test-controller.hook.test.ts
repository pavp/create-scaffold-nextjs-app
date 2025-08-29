import { act, renderHookWithProviders } from '@test/utils';

import type { ErrorType } from '@/modules/todo/todo.types';

import { useErrorTestController } from './use-error-test-controller.hook';

describe('useErrorTestController', () => {
  it('should initialize with default error type', () => {
    const { result } = renderHookWithProviders(() => useErrorTestController());

    expect(result.current.selectedErrorType).toBe('validation');
    expect(typeof result.current.handleErrorTypeChange).toBe('function');
    expect(typeof result.current.handleTestClick).toBe('function');
    expect(typeof result.current.handleReset).toBe('function');
  });

  it('should update selected error type when handleErrorTypeChange is called', () => {
    const { result } = renderHookWithProviders(() => useErrorTestController());

    act(() => {
      result.current.handleErrorTypeChange('server');
    });

    expect(result.current.selectedErrorType).toBe('server');
  });

  it('should handle all error types', () => {
    const { result } = renderHookWithProviders(() => useErrorTestController());

    const errorTypes: ErrorType[] = [
      'validation',
      'unauthorized',
      'forbidden',
      'notfound',
      'server',
      'network',
      'generic',
      'zod-request',
    ];

    errorTypes.forEach((errorType) => {
      act(() => {
        result.current.handleErrorTypeChange(errorType);
      });

      expect(result.current.selectedErrorType).toBe(errorType);
    });
  });

  it('should call triggerErrorTestFn with selected error type in handleTestClick', async () => {
    const mockTriggerErrorTest = jest.fn().mockResolvedValue('success');
    const { result } = renderHookWithProviders(() => useErrorTestController());

    // Set error type first
    act(() => {
      result.current.handleErrorTypeChange('server');
    });

    // Call handleTestClick
    await act(async () => {
      await result.current.handleTestClick(mockTriggerErrorTest);
    });

    expect(mockTriggerErrorTest).toHaveBeenCalledWith('server');
  });

  it('should call resetFn when handleReset is called', () => {
    const mockResetFn = jest.fn();
    const { result } = renderHookWithProviders(() => useErrorTestController());

    act(() => {
      result.current.handleReset(mockResetFn);
    });

    expect(mockResetFn).toHaveBeenCalledTimes(1);
  });

  it('should maintain state consistency across function calls', () => {
    const { result } = renderHookWithProviders(() => useErrorTestController());

    // Change error type
    act(() => {
      result.current.handleErrorTypeChange('unauthorized');
    });

    expect(result.current.selectedErrorType).toBe('unauthorized');

    // Change again
    act(() => {
      result.current.handleErrorTypeChange('forbidden');
    });

    expect(result.current.selectedErrorType).toBe('forbidden');
  });

  it('should have stable function references', () => {
    const { result, rerender } = renderHookWithProviders(() => useErrorTestController());

    const initialHandleErrorTypeChange = result.current.handleErrorTypeChange;
    const initialHandleTestClick = result.current.handleTestClick;
    const initialHandleReset = result.current.handleReset;

    rerender();

    expect(result.current.handleErrorTypeChange).toBe(initialHandleErrorTypeChange);
    expect(result.current.handleTestClick).toBe(initialHandleTestClick);
    expect(result.current.handleReset).toBe(initialHandleReset);
  });

  it('should handle async triggerErrorTestFn in handleTestClick', async () => {
    const mockAsyncTriggerErrorTest = jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('async success'), 100)));

    const { result } = renderHookWithProviders(() => useErrorTestController());

    act(() => {
      result.current.handleErrorTypeChange('network');
    });

    await act(async () => {
      const promise = result.current.handleTestClick(mockAsyncTriggerErrorTest);

      expect(promise).toBeInstanceOf(Promise);
      await promise;
    });

    expect(mockAsyncTriggerErrorTest).toHaveBeenCalledWith('network');
  });

  it('should handle triggerErrorTestFn that throws error', async () => {
    const mockErrorTriggerErrorTest = jest.fn().mockRejectedValue(new Error('Test error'));
    const { result } = renderHookWithProviders(() => useErrorTestController());

    act(() => {
      result.current.handleErrorTypeChange('validation');
    });

    await act(async () => {
      try {
        await result.current.handleTestClick(mockErrorTriggerErrorTest);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Test error');
      }
    });

    expect(mockErrorTriggerErrorTest).toHaveBeenCalledWith('validation');
  });

  it('should work with multiple rapid error type changes', () => {
    const { result } = renderHookWithProviders(() => useErrorTestController());

    act(() => {
      result.current.handleErrorTypeChange('server');
      result.current.handleErrorTypeChange('network');
      result.current.handleErrorTypeChange('validation');
    });

    expect(result.current.selectedErrorType).toBe('validation');
  });
});
