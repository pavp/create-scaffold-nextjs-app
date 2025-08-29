/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@test/utils';

import { useLogoutController } from './use-logout-controller.hook';

describe('useLogoutController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with showConfirmation false', () => {
    const { result } = renderHook(() => useLogoutController());

    expect(result.current.showConfirmation).toBe(false);
  });

  it('should set showConfirmation true on handleLogoutClick', () => {
    const { result } = renderHook(() => useLogoutController());

    act(() => {
      result.current.handleLogoutClick();
    });

    expect(result.current.showConfirmation).toBe(true);
  });

  it('should call logoutFn and hide confirmation on confirm', () => {
    const mockLogoutFn = jest.fn();
    const { result } = renderHook(() => useLogoutController());

    // Show confirmation first
    act(() => {
      result.current.handleLogoutClick();
    });

    expect(result.current.showConfirmation).toBe(true);

    act(() => {
      const confirmHandler = result.current.handleConfirmLogout(mockLogoutFn);

      confirmHandler();
    });

    expect(mockLogoutFn).toHaveBeenCalled();
    expect(result.current.showConfirmation).toBe(false);
  });

  it('should hide confirmation on cancel', () => {
    const { result } = renderHook(() => useLogoutController());

    // Show confirmation first
    act(() => {
      result.current.handleLogoutClick();
    });

    expect(result.current.showConfirmation).toBe(true);

    act(() => {
      result.current.handleCancelLogout();
    });

    expect(result.current.showConfirmation).toBe(false);
  });

  it('should have stable handlers (memoization)', () => {
    const { result, rerender } = renderHook(() => useLogoutController());

    const clickHandler = result.current.handleLogoutClick;
    const cancelHandler = result.current.handleCancelLogout;

    rerender();

    expect(result.current.handleLogoutClick).toBe(clickHandler);
    expect(result.current.handleCancelLogout).toBe(cancelHandler);
  });
});
