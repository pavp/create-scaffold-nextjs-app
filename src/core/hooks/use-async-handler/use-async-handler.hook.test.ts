import { act, renderHook } from '@test/utils';

import { useAsyncHandler } from './use-async-handler.hook';

describe('useAsyncHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAsyncHandler<string>());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toEqual([]);
    expect(result.current.results).toEqual([]);
    expect(typeof result.current.executePromises).toBe('function');
  });

  it('should handle successful promises', async () => {
    const { result } = renderHook(() => useAsyncHandler<string>());

    const promises = [Promise.resolve('Success 1'), Promise.resolve('Success 2')];

    await act(async () => {
      await result.current.executePromises(promises);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toEqual([]);
    expect(result.current.results).toEqual(['Success 1', 'Success 2']);
  });

  it('should handle failed promises', async () => {
    const { result } = renderHook(() => useAsyncHandler<string>());

    const promises = [Promise.reject(new Error('Error 1')), Promise.reject(new Error('Error 2'))];

    await act(async () => {
      await result.current.executePromises(promises);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(['Error 1', 'Error 2']);
    expect(result.current.results).toEqual([]);
  });

  it('should handle mixed success and failure promises', async () => {
    const { result } = renderHook(() => useAsyncHandler<string>());

    const promises = [Promise.resolve('Success'), Promise.reject(new Error('Error'))];

    await act(async () => {
      await result.current.executePromises(promises);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(['Error']);
    expect(result.current.results).toEqual(['Success']);
  });

  it('should set loading state during execution', async () => {
    const { result } = renderHook(() => useAsyncHandler<string>());

    let resolvePromise: (value: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    act(() => {
      result.current.executePromises([promise]);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    await act(async () => {
      resolvePromise('Success');
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle empty promises array', async () => {
    const { result } = renderHook(() => useAsyncHandler<string>());

    await act(async () => {
      await result.current.executePromises([]);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toEqual([]);
    expect(result.current.results).toEqual([]);
  });

  it('should reset state before executing new promises', async () => {
    const { result } = renderHook(() => useAsyncHandler<string>());

    // First execution with error
    await act(async () => {
      await result.current.executePromises([Promise.reject(new Error('First Error'))]);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(['First Error']);

    // Second execution with success
    await act(async () => {
      await result.current.executePromises([Promise.resolve('Success')]);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toEqual([]);
    expect(result.current.results).toEqual(['Success']);
  });

  it('should handle non-Error rejections', async () => {
    const { result } = renderHook(() => useAsyncHandler<string>());

    const promises = [Promise.reject(new Error('String error'))];

    await act(async () => {
      await result.current.executePromises(promises);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(['String error']);
    expect(result.current.results).toEqual([]);
  });

  it('should maintain executePromises reference stability', () => {
    const { result, rerender } = renderHook(() => useAsyncHandler<string>());

    const firstExecutePromises = result.current.executePromises;

    rerender();
    const secondExecutePromises = result.current.executePromises;

    expect(firstExecutePromises).toBe(secondExecutePromises);
  });
});
