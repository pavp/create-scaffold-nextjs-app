import { act, renderHook } from '@testing-library/react';

import { clearToast, closeToast, showToast } from '../../toast.store.actions';

import { useToastMessageSelector } from './use-toast-message-selector.hook';

describe('useToastMessageSelector', () => {
  beforeEach(() => {
    // Reset store before each test
    clearToast();
  });

  it('should return empty string by default', () => {
    const { result } = renderHook(() => useToastMessageSelector());

    expect(result.current.snackbarMessage).toBe('');
  });

  it('should return current message when toast is shown', () => {
    act(() => {
      showToast({
        snackbarMessage: 'Test message',
        severity: 'INFO',
      });
    });

    const { result } = renderHook(() => useToastMessageSelector());

    expect(result.current.snackbarMessage).toBe('Test message');
  });

  it('should update when message changes', () => {
    const { result, rerender } = renderHook(() => useToastMessageSelector());

    expect(result.current.snackbarMessage).toBe('');

    act(() => {
      showToast({
        snackbarMessage: 'First message',
        severity: 'SUCCESS',
      });
    });

    rerender();
    expect(result.current.snackbarMessage).toBe('First message');

    act(() => {
      showToast({
        snackbarMessage: 'Second message',
        severity: 'ERROR',
      });
    });

    rerender();
    expect(result.current.snackbarMessage).toBe('Second message');
  });

  it('should handle special characters and long messages', () => {
    const longMessage =
      'This is a very long message with special characters: !@#$%^&*()_+{}|:<>?[]\\;\'\",./ and Unicode: 你好世界 🎉';

    act(() => {
      showToast({
        snackbarMessage: longMessage,
        severity: 'INFO',
      });
    });

    const { result } = renderHook(() => useToastMessageSelector());

    expect(result.current.snackbarMessage).toBe(longMessage);
  });

  it('should persist message after closing toast', () => {
    act(() => {
      showToast({
        snackbarMessage: 'Persistent message',
        severity: 'WARNING',
      });
    });

    const { result } = renderHook(() => useToastMessageSelector());

    expect(result.current.snackbarMessage).toBe('Persistent message');

    act(() => {
      closeToast();
    });

    // Message should still be there after closing
    expect(result.current.snackbarMessage).toBe('Persistent message');
  });

  it('should reset message when clearing toast', () => {
    act(() => {
      showToast({
        snackbarMessage: 'Message to clear',
        severity: 'SUCCESS',
      });
    });

    const { result, rerender } = renderHook(() => useToastMessageSelector());

    expect(result.current.snackbarMessage).toBe('Message to clear');

    act(() => {
      clearToast();
    });

    rerender();
    expect(result.current.snackbarMessage).toBe('');
  });
});
