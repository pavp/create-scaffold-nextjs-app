import { RefObject } from 'react';
import { act, renderHook } from '@test/utils/test-utils';

import { useParentSize } from './use-parent-size';

describe('useParentSize', () => {
  it('should return initial dimension object with null width and height', () => {
    const parentRef = { current: null };

    const { result } = renderHook(() => useParentSize(parentRef as any));

    expect(result.current).toEqual({ width: null, height: null });
  });

  it('should update dimension object when parent size changes', async () => {
    const parentRef = { current: { getBoundingClientRect: jest.fn(() => ({ width: 100, height: 200 })) } };

    const { result, rerender } = renderHook((props: RefObject<Element>) => useParentSize(props), {
      initialProps: parentRef as any,
    });

    expect(result.current).toEqual({ width: 100, height: 200 });

    parentRef.current.getBoundingClientRect = jest.fn(() => ({ width: 150, height: 250 }));

    rerender({ ...parentRef } as any);

    expect(result.current).toEqual({ width: 150, height: 250 });
  });

  it('should handle resizing event', () => {
    const parentRef = { current: { getBoundingClientRect: jest.fn(() => ({ width: 100, height: 200 })) } };

    const { result } = renderHook(() => useParentSize(parentRef as any));

    expect(result.current).toEqual({ width: 100, height: 200 });

    act(() => window.dispatchEvent(new Event('resize')));

    expect(parentRef.current.getBoundingClientRect).toHaveBeenCalledTimes(2);
  });

  it('should remove resize event listener on unmount', () => {
    const parentRef = { current: { getBoundingClientRect: jest.fn(() => ({ width: 100, height: 200 })) } };

    const { unmount } = renderHook(() => useParentSize(parentRef as any));

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
