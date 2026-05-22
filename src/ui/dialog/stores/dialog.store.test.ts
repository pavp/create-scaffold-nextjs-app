import { act, renderHook } from '@test/utils';

import { DialogSeverity, OpenDialog } from '../dialog.types';

import { useDialogStore } from './dialog.store';
import { clearDialog, closeDialog, openDialog, resetDialogState, useDialogActions } from './dialog.store.actions';

describe('Dialog Store', () => {
  const mockDialogConfig: OpenDialog = {
    severity: 'ERROR',
    title: 'Test Dialog',
    message: 'This is a test dialog message',
    acceptText: 'Accept',
    cancelText: 'Cancel',
    handleAccept: jest.fn(),
    handleCancel: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset store to initial state before each test
    act(() => {
      useDialogStore.getState().actions.clearDialog();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useDialogStore());

      expect(result.current.isVisible).toBe(false);
      expect(result.current.severity).toBe('ERROR');
      expect(result.current.message).toBe('');
      expect(result.current.title).toBeUndefined();
      expect(result.current.acceptText).toBeUndefined();
      expect(result.current.cancelText).toBeUndefined();
      expect(result.current.handleAccept).toBeInstanceOf(Function);
      expect(result.current.handleCancel).toBeUndefined();
      expect(result.current.actions).toBeDefined();
    });

    it('should have all required actions', () => {
      const { result } = renderHook(() => useDialogStore());
      const { actions } = result.current;

      expect(actions.openDialog).toBeInstanceOf(Function);
      expect(actions.closeDialog).toBeInstanceOf(Function);
      expect(actions.resetDialogState).toBeInstanceOf(Function);
      expect(actions.clearDialog).toBeInstanceOf(Function);
    });
  });

  describe('Actions', () => {
    describe('openDialog', () => {
      it('should open dialog with correct configuration', () => {
        const { result } = renderHook(() => useDialogStore());

        act(() => {
          result.current.actions.openDialog(mockDialogConfig);
        });

        expect(result.current.isVisible).toBe(true);
        expect(result.current.severity).toBe(mockDialogConfig.severity);
        expect(result.current.title).toBe(mockDialogConfig.title);
        expect(result.current.message).toBe(mockDialogConfig.message);
        expect(result.current.acceptText).toBe(mockDialogConfig.acceptText);
        expect(result.current.cancelText).toBe(mockDialogConfig.cancelText);
        expect(result.current.handleAccept).toBe(mockDialogConfig.handleAccept);
        expect(result.current.handleCancel).toBe(mockDialogConfig.handleCancel);
      });

      it('should handle optional properties correctly', () => {
        const { result } = renderHook(() => useDialogStore());
        const minimalConfig: OpenDialog = {
          severity: 'WARNING' as keyof typeof DialogSeverity,
          message: 'Warning message',
          handleAccept: jest.fn(),
        };

        act(() => {
          result.current.actions.openDialog(minimalConfig);
        });

        expect(result.current.isVisible).toBe(true);
        expect(result.current.severity).toBe('WARNING');
        expect(result.current.message).toBe('Warning message');
        expect(result.current.title).toBeUndefined();
        expect(result.current.acceptText).toBeUndefined();
        expect(result.current.cancelText).toBeUndefined();
        expect(result.current.handleCancel).toBeUndefined();
      });
    });

    describe('closeDialog', () => {
      it('should close dialog but keep other properties', () => {
        const { result } = renderHook(() => useDialogStore());

        // First open dialog
        act(() => {
          result.current.actions.openDialog(mockDialogConfig);
        });

        expect(result.current.isVisible).toBe(true);

        // Then close it
        act(() => {
          result.current.actions.closeDialog();
        });

        expect(result.current.isVisible).toBe(false);
        // Other properties should remain
        expect(result.current.message).toBe(mockDialogConfig.message);
        expect(result.current.title).toBe(mockDialogConfig.title);
      });
    });

    describe('resetDialogState', () => {
      it('should reset dialog state but preserve visibility', () => {
        const { result } = renderHook(() => useDialogStore());

        // First open dialog
        act(() => {
          result.current.actions.openDialog(mockDialogConfig);
        });

        const currentVisibility = result.current.isVisible;

        // Reset state
        act(() => {
          result.current.actions.resetDialogState();
        });

        expect(result.current.isVisible).toBe(currentVisibility);
        expect(result.current.severity).toBe('ERROR'); // Back to initial
        expect(result.current.message).toBe(''); // Back to initial
        expect(result.current.title).toBeUndefined();
        expect(result.current.acceptText).toBeUndefined();
        expect(result.current.cancelText).toBeUndefined();
      });
    });

    describe('clearDialog', () => {
      it('should completely reset dialog to initial state', () => {
        const { result } = renderHook(() => useDialogStore());

        // First open dialog
        act(() => {
          result.current.actions.openDialog(mockDialogConfig);
        });

        expect(result.current.isVisible).toBe(true);

        // Clear everything
        act(() => {
          result.current.actions.clearDialog();
        });

        expect(result.current.isVisible).toBe(false);
        expect(result.current.severity).toBe('ERROR');
        expect(result.current.message).toBe('');
        expect(result.current.title).toBeUndefined();
        expect(result.current.acceptText).toBeUndefined();
        expect(result.current.cancelText).toBeUndefined();
      });
    });
  });

  describe('useDialogActions hook', () => {
    it('should return the same actions as the store', () => {
      const { result: storeResult } = renderHook(() => useDialogStore());
      const { result: actionsResult } = renderHook(() => useDialogActions());

      expect(actionsResult.current).toBe(storeResult.current.actions);
    });

    it('should allow calling actions directly', () => {
      const { result } = renderHook(() => useDialogActions());

      expect(() => {
        act(() => {
          result.current.openDialog(mockDialogConfig);
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.closeDialog();
        });
      }).not.toThrow();
    });
  });

  describe('Standalone action functions', () => {
    it('should openDialog function work correctly', () => {
      // Call standalone function
      act(() => {
        openDialog(mockDialogConfig);
      });

      const state = useDialogStore.getState();

      expect(state.isVisible).toBe(true);
      expect(state.severity).toBe(mockDialogConfig.severity);
      expect(state.title).toBe(mockDialogConfig.title);
      expect(state.message).toBe(mockDialogConfig.message);
    });

    it('should closeDialog function work correctly', () => {
      // First open dialog
      act(() => {
        openDialog(mockDialogConfig);
      });

      expect(useDialogStore.getState().isVisible).toBe(true);

      // Then close it
      act(() => {
        closeDialog();
      });

      expect(useDialogStore.getState().isVisible).toBe(false);
    });

    it('should resetDialogState function work correctly', () => {
      // First open dialog
      act(() => {
        openDialog(mockDialogConfig);
      });

      expect(useDialogStore.getState().title).toBe(mockDialogConfig.title);

      // Reset state
      act(() => {
        resetDialogState();
      });

      const state = useDialogStore.getState();

      expect(state.title).toBeUndefined();
      expect(state.message).toBe('');
      expect(state.severity).toBe('ERROR'); // Back to initial
    });

    it('should clearDialog function work correctly', () => {
      // First open dialog
      act(() => {
        openDialog(mockDialogConfig);
      });

      expect(useDialogStore.getState().isVisible).toBe(true);

      // Clear everything
      act(() => {
        clearDialog();
      });

      const state = useDialogStore.getState();

      expect(state.isVisible).toBe(false);
      expect(state.title).toBeUndefined();
      expect(state.message).toBe('');
    });

    it('should all standalone functions be available', () => {
      expect(typeof openDialog).toBe('function');
      expect(typeof closeDialog).toBe('function');
      expect(typeof resetDialogState).toBe('function');
      expect(typeof clearDialog).toBe('function');
    });
  });
});
