import { act, renderHook } from '@testing-library/react';

import { clearToast, showToast } from '../../toast.store.actions';

import { useToastVisibilitySelector } from './use-toast-visibility-selector.hook';

describe('useToastVisibilitySelector', () => {
  beforeEach(() => {
    // Reset store before each test
    clearToast();
  });

  it('should return false by default', () => {
    const { result } = renderHook(() => useToastVisibilitySelector());

    expect(result.current.snackbarOpen).toBe(false);
  });

  it('should return true when toast is shown', () => {
    act(() => {
      showToast({
        snackbarMessage: 'Visible toast',
        severity: 'INFO',
      });
    });

    const { result } = renderHook(() => useToastVisibilitySelector());

    expect(result.current.snackbarOpen).toBe(true);
  });

  it('should return false when toast is closed', () => {
    act(() => {
      showToast({
        snackbarMessage: 'Toast to close',
        severity: 'SUCCESS',
      });
    });

    const { result, rerender } = renderHook(() => useToastVisibilitySelector());

    expect(result.current.snackbarOpen).toBe(true);

    const { closeToast } = require('../../toast.store.actions');

    act(() => {
      closeToast();
    });

    rerender();
    expect(result.current.snackbarOpen).toBe(false);
  });

  it('should return false when toast is cleared', () => {
    act(() => {
      showToast({
        snackbarMessage: 'Toast to clear',
        severity: 'ERROR',
      });
    });

    const { result, rerender } = renderHook(() => useToastVisibilitySelector());

    expect(result.current.snackbarOpen).toBe(true);

    act(() => {
      clearToast();
    });

    rerender();
    expect(result.current.snackbarOpen).toBe(false);
  });

  it('should handle multiple show/hide cycles', () => {
    const { result, rerender } = renderHook(() => useToastVisibilitySelector());

    // Initially false
    expect(result.current.snackbarOpen).toBe(false);

    // Show first toast
    act(() => {
      showToast({
        snackbarMessage: 'First toast',
        severity: 'INFO',
      });
    });

    rerender();
    expect(result.current.snackbarOpen).toBe(true);

    // Close it
    const { closeToast } = require('../../toast.store.actions');

    act(() => {
      closeToast();
    });

    rerender();
    expect(result.current.snackbarOpen).toBe(false);

    // Show second toast
    act(() => {
      showToast({
        snackbarMessage: 'Second toast',
        severity: 'WARNING',
      });
    });

    rerender();
    expect(result.current.snackbarOpen).toBe(true);

    // Clear it
    act(() => {
      clearToast();
    });

    rerender();
    expect(result.current.snackbarOpen).toBe(false);
  });

  it('should update visibility immediately when state changes', () => {
    const { result, rerender } = renderHook(() => useToastVisibilitySelector());

    expect(result.current.snackbarOpen).toBe(false);

    act(() => {
      showToast({
        snackbarMessage: 'Quick visibility test',
        severity: 'SUCCESS',
      });
    });

    rerender();
    expect(result.current.snackbarOpen).toBe(true);
  });
});
