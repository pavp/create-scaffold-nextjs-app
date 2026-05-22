import { act, renderHook } from '@testing-library/react';

import { clearDialog, closeDialog, openDialog } from '../../dialog.store.actions';

import { useDialogVisibilitySelector } from './use-dialog-visibility-selector.hook';

describe('useDialogVisibilitySelector', () => {
  beforeEach(() => {
    // Reset store before each test
    clearDialog();
  });

  it('should return false by default', () => {
    const { result } = renderHook(() => useDialogVisibilitySelector());

    expect(result.current.isVisible).toBe(false);
  });

  it('should return true when dialog is opened', () => {
    act(() => {
      openDialog({
        severity: 'ERROR',
        title: 'Visibility Test',
        message: 'Test visibility',
        handleAccept: jest.fn(),
      });
    });

    const { result } = renderHook(() => useDialogVisibilitySelector());

    expect(result.current.isVisible).toBe(true);
  });

  it('should return false when dialog is closed', () => {
    act(() => {
      openDialog({
        severity: 'ERROR',
        title: 'Close Test',
        message: 'Test closing',
        handleAccept: jest.fn(),
      });
    });

    const { result, rerender } = renderHook(() => useDialogVisibilitySelector());

    expect(result.current.isVisible).toBe(true);

    act(() => {
      closeDialog();
    });

    rerender();
    expect(result.current.isVisible).toBe(false);
  });

  it('should return false when dialog is cleared', () => {
    act(() => {
      openDialog({
        severity: 'ERROR',
        title: 'Clear Visibility Test',
        message: 'Test clearing visibility',
        handleAccept: jest.fn(),
      });
    });

    const { result, rerender } = renderHook(() => useDialogVisibilitySelector());

    expect(result.current.isVisible).toBe(true);

    act(() => {
      clearDialog();
    });

    rerender();
    expect(result.current.isVisible).toBe(false);
  });

  it('should handle multiple show/hide cycles', () => {
    const { result, rerender } = renderHook(() => useDialogVisibilitySelector());

    // Initially false
    expect(result.current.isVisible).toBe(false);

    // Show first dialog
    act(() => {
      openDialog({
        severity: 'ERROR',
        title: 'First Dialog',
        message: 'First message',
        handleAccept: jest.fn(),
      });
    });

    rerender();
    expect(result.current.isVisible).toBe(true);

    // Close it
    act(() => {
      closeDialog();
    });

    rerender();
    expect(result.current.isVisible).toBe(false);

    // Show second dialog
    act(() => {
      openDialog({
        severity: 'WARNING',
        title: 'Second Dialog',
        message: 'Second message',
        handleAccept: jest.fn(),
      });
    });

    rerender();
    expect(result.current.isVisible).toBe(true);

    // Clear it
    act(() => {
      clearDialog();
    });

    rerender();
    expect(result.current.isVisible).toBe(false);
  });

  it('should update visibility immediately when state changes', () => {
    const { result, rerender } = renderHook(() => useDialogVisibilitySelector());

    expect(result.current.isVisible).toBe(false);

    act(() => {
      openDialog({
        severity: 'ERROR',
        title: 'Immediate Visibility Test',
        message: 'Test immediate visibility change',
        handleAccept: jest.fn(),
      });
    });

    rerender();
    expect(result.current.isVisible).toBe(true);
  });
});
