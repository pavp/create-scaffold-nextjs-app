import { act, renderHook } from '@test/utils';

import { useDebounce } from './use-debounce.hook';

jest.useFakeTimers();

describe('useDebounce', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should debounce the callback execution', () => {
    const callback = jest.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith('test3');
  });

  it('should update callback without changing debounce behavior', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const delay = 300;

    const { result, rerender } = renderHook(({ callback }) => useDebounce(callback, delay), {
      initialProps: { callback: callback1 },
    });

    act(() => {
      result.current('test1');
    });

    rerender({ callback: callback2 });

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith('test1');
  });

  it('should cancel debounce on unmount', () => {
    const callback = jest.fn();
    const delay = 500;

    const { result, unmount } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current('test');
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle different delay values', () => {
    const callback = jest.fn();
    let delay = 200;

    const { result, rerender } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current('test1');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test1');

    delay = 500;
    rerender();

    act(() => {
      result.current('test2');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('test2');
  });
});
