import { renderHook } from '@test/utils';

import { useFirstRender } from './use-first-render.hook';

describe('useFirstRender', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true on first render', () => {
    const { result } = renderHook(() => useFirstRender());

    expect(result.current.isFirstRender).toBe(true);
  });

  it('should return false on subsequent renders', () => {
    const { result, rerender } = renderHook(() => useFirstRender());

    expect(result.current.isFirstRender).toBe(true);

    rerender();

    expect(result.current.isFirstRender).toBe(false);
  });

  it('should consistently return false after first render', () => {
    const { result, rerender } = renderHook(() => useFirstRender());

    expect(result.current.isFirstRender).toBe(true);

    rerender();
    expect(result.current.isFirstRender).toBe(false);

    rerender();
    expect(result.current.isFirstRender).toBe(false);

    rerender();
    expect(result.current.isFirstRender).toBe(false);
  });

  it('should work correctly with multiple instances', () => {
    const { result: result1 } = renderHook(() => useFirstRender());
    const { result: result2, rerender: rerender2 } = renderHook(() => useFirstRender());

    expect(result1.current.isFirstRender).toBe(true);
    expect(result2.current.isFirstRender).toBe(true);

    rerender2();

    expect(result1.current.isFirstRender).toBe(true);
    expect(result2.current.isFirstRender).toBe(false);
  });
});
