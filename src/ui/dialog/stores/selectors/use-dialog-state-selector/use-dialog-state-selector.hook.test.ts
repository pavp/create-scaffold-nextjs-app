import { act, renderHook } from '@testing-library/react';

import { clearDialog, closeDialog, openDialog, resetDialogState } from '../../dialog.store.actions';

import { useDialogStateSelector } from './use-dialog-state-selector.hook';

describe('useDialogStateSelector', () => {
  beforeEach(() => {
    // Reset store before each test
    clearDialog();
  });

  it('should return default state when no dialog is open', () => {
    const { result } = renderHook(() => useDialogStateSelector());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.severity).toBe('ERROR');
    expect(result.current.title).toBeUndefined();
    expect(result.current.message).toBe('');
    expect(result.current.acceptText).toBeUndefined();
    expect(result.current.cancelText).toBeUndefined();
    expect(typeof result.current.handleAccept).toBe('function');
    expect(result.current.handleCancel).toBeUndefined();
  });

  it('should return dialog state when dialog is opened', () => {
    const mockAccept = jest.fn();
    const mockCancel = jest.fn();

    act(() => {
      openDialog({
        severity: 'WARNING',
        title: 'Test Title',
        message: 'Test Message',
        acceptText: 'Accept',
        cancelText: 'Cancel',
        handleAccept: mockAccept,
        handleCancel: mockCancel,
      });
    });

    const { result } = renderHook(() => useDialogStateSelector());

    expect(result.current.isVisible).toBe(true);
    expect(result.current.severity).toBe('WARNING');
    expect(result.current.title).toBe('Test Title');
    expect(result.current.message).toBe('Test Message');
    expect(result.current.acceptText).toBe('Accept');
    expect(result.current.cancelText).toBe('Cancel');
    expect(result.current.handleAccept).toBe(mockAccept);
    expect(result.current.handleCancel).toBe(mockCancel);
  });

  it('should update when dialog state changes', () => {
    const { result, rerender } = renderHook(() => useDialogStateSelector());

    expect(result.current.isVisible).toBe(false);

    act(() => {
      openDialog({
        severity: 'ERROR',
        title: 'First Dialog',
        message: 'First Message',
        acceptText: 'OK',
        handleAccept: jest.fn(),
      });
    });

    rerender();
    expect(result.current.isVisible).toBe(true);
    expect(result.current.title).toBe('First Dialog');
    expect(result.current.severity).toBe('ERROR');

    act(() => {
      openDialog({
        severity: 'WARNING',
        title: 'Second Dialog',
        message: 'Second Message',
        acceptText: 'Confirm',
        handleAccept: jest.fn(),
      });
    });

    rerender();
    expect(result.current.title).toBe('Second Dialog');
    expect(result.current.severity).toBe('WARNING');
    expect(result.current.acceptText).toBe('Confirm');
  });

  it('should handle callbacks correctly', () => {
    const mockAccept = jest.fn();
    const mockCancel = jest.fn();

    act(() => {
      openDialog({
        severity: 'ERROR',
        title: 'Callback Test',
        message: 'Test callbacks',
        handleAccept: mockAccept,
        handleCancel: mockCancel,
      });
    });

    const { result } = renderHook(() => useDialogStateSelector());

    // Test accept callback
    if (result.current.handleAccept) {
      result.current.handleAccept();
      expect(mockAccept).toHaveBeenCalledTimes(1);
    } else {
      fail('handleAccept should be defined');
    }

    // Test cancel callback
    if (result.current.handleCancel) {
      result.current.handleCancel();
      expect(mockCancel).toHaveBeenCalledTimes(1);
    } else {
      fail('handleCancel should be defined');
    }
  });

  it('should persist state after closing dialog', () => {
    act(() => {
      openDialog({
        severity: 'WARNING',
        title: 'Persistent Test',
        message: 'Test persistence',
        handleAccept: jest.fn(),
      });
    });

    const { result } = renderHook(() => useDialogStateSelector());

    expect(result.current.isVisible).toBe(true);
    expect(result.current.title).toBe('Persistent Test');

    act(() => {
      closeDialog();
    });

    // State should persist after closing, only visibility changes
    expect(result.current.isVisible).toBe(false);
    expect(result.current.title).toBe('Persistent Test');
    expect(result.current.message).toBe('Test persistence');
    expect(result.current.severity).toBe('WARNING');
  });

  it('should reset state when clearing dialog', () => {
    act(() => {
      openDialog({
        severity: 'ERROR',
        title: 'Clear Test',
        message: 'Test clearing',
        handleAccept: jest.fn(),
      });
    });

    const { result, rerender } = renderHook(() => useDialogStateSelector());

    expect(result.current.isVisible).toBe(true);
    expect(result.current.title).toBe('Clear Test');

    act(() => {
      clearDialog();
    });

    rerender();
    expect(result.current.isVisible).toBe(false);
    expect(result.current.title).toBeUndefined();
    expect(result.current.message).toBe('');
    expect(result.current.severity).toBe('ERROR');
  });

  it('should reset state when resetting dialog state', () => {
    act(() => {
      openDialog({
        severity: 'WARNING',
        title: 'Reset Test',
        message: 'Test resetting',
        handleAccept: jest.fn(),
      });
    });

    const { result, rerender } = renderHook(() => useDialogStateSelector());

    expect(result.current.title).toBe('Reset Test');

    act(() => {
      resetDialogState();
    });

    rerender();
    expect(result.current.isVisible).toBe(true); // resetDialogState preserves visibility
    expect(result.current.title).toBeUndefined();
    expect(result.current.message).toBe('');
    expect(result.current.severity).toBe('ERROR');
  });
});
