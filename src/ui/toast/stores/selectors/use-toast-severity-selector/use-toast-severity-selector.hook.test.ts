import { act, renderHook } from '@testing-library/react';

import { clearToast, showToast } from '../../toast.store.actions';

import { useToastSeveritySelector } from './use-toast-severity-selector.hook';

describe('useToastSeveritySelector', () => {
  beforeEach(() => {
    // Reset store before each test
    clearToast();
  });

  it('should return INFO by default', () => {
    const { result } = renderHook(() => useToastSeveritySelector());

    expect(result.current.severity).toBe('INFO');
  });

  it('should return current severity when toast is shown', () => {
    const severityTypes = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'] as const;

    severityTypes.forEach((severity) => {
      act(() => {
        showToast({
          snackbarMessage: `Test ${severity}`,
          severity,
        });
      });

      const { result } = renderHook(() => useToastSeveritySelector());

      expect(result.current.severity).toBe(severity);

      // Clear for next iteration
      act(() => {
        clearToast();
      });
    });
  });

  it('should update when severity changes', () => {
    const { result, rerender } = renderHook(() => useToastSeveritySelector());

    expect(result.current.severity).toBe('INFO');

    act(() => {
      showToast({
        snackbarMessage: 'Error message',
        severity: 'ERROR',
      });
    });

    rerender();
    expect(result.current.severity).toBe('ERROR');

    act(() => {
      showToast({
        snackbarMessage: 'Success message',
        severity: 'SUCCESS',
      });
    });

    rerender();
    expect(result.current.severity).toBe('SUCCESS');
  });

  it('should persist severity after closing toast', () => {
    act(() => {
      showToast({
        snackbarMessage: 'Warning message',
        severity: 'WARNING',
      });
    });

    const { result } = renderHook(() => useToastSeveritySelector());

    expect(result.current.severity).toBe('WARNING');

    const { closeToast } = require('../../toast.store.actions');

    act(() => {
      closeToast();
    });

    // Severity should still be there after closing
    expect(result.current.severity).toBe('WARNING');
  });

  it('should reset severity when clearing toast', () => {
    act(() => {
      showToast({
        snackbarMessage: 'Error to clear',
        severity: 'ERROR',
      });
    });

    const { result, rerender } = renderHook(() => useToastSeveritySelector());

    expect(result.current.severity).toBe('ERROR');

    act(() => {
      clearToast();
    });

    rerender();
    expect(result.current.severity).toBe('INFO');
  });
});
