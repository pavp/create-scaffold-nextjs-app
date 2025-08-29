import { act, renderHook } from '@testing-library/react';

import { clearToast, showToast } from '../../toast.store.actions';

import { useToastConfirmationSelector } from './use-toast-confirmation-selector.hook';

describe('useToastConfirmationSelector', () => {
  beforeEach(() => {
    // Reset store before each test
    clearToast();
  });

  it('should return undefined when no confirmation callback is set', () => {
    const { result } = renderHook(() => useToastConfirmationSelector());

    expect(result.current).toEqual({ onConfirmation: undefined });
  });

  it('should return confirmation callback when set', () => {
    const mockConfirmation = jest.fn();

    act(() => {
      showToast({
        snackbarMessage: 'Confirm action?',
        severity: 'WARNING',
        onConfirmation: mockConfirmation,
      });
    });

    const { result } = renderHook(() => useToastConfirmationSelector());

    expect(result.current).toEqual({ onConfirmation: mockConfirmation });
  });

  it('should update when confirmation callback changes', () => {
    const { result, rerender } = renderHook(() => useToastConfirmationSelector());

    expect(result.current.onConfirmation).toBeUndefined();

    const firstCallback = jest.fn();

    act(() => {
      showToast({
        snackbarMessage: 'First confirmation',
        severity: 'INFO',
        onConfirmation: firstCallback,
      });
    });

    rerender();
    expect(result.current.onConfirmation).toBe(firstCallback);

    const secondCallback = jest.fn();

    act(() => {
      showToast({
        snackbarMessage: 'Second confirmation',
        severity: 'WARNING',
        onConfirmation: secondCallback,
      });
    });

    rerender();
    expect(result.current.onConfirmation).toBe(secondCallback);
  });

  it('should be callable when set', () => {
    const mockConfirmation = jest.fn();

    act(() => {
      showToast({
        snackbarMessage: 'Test confirmation',
        severity: 'ERROR',
        onConfirmation: mockConfirmation,
      });
    });

    const { result } = renderHook(() => useToastConfirmationSelector());

    if (result.current.onConfirmation) {
      result.current.onConfirmation();
      expect(mockConfirmation).toHaveBeenCalledTimes(1);
    } else {
      fail('Confirmation callback should be defined');
    }
  });
});
