import { act, renderHook } from '@test/utils';

import { delayCallback } from '@/core/helpers';

import { DialogSeverity } from '../../dialog.types';
import { useDialogActions } from '../../stores/dialog.store.actions';
import { useDialogStateSelector } from '../../stores/selectors';

import { useDialog } from './use-dialog.hook';

// Mock the dependencies
jest.mock('../../stores/dialog.store.actions');
jest.mock('../../stores/selectors');
jest.mock('@/core/helpers');
jest.mock('@/ui/dialog/constants', () => ({
  DIALOG_RESET_STATE_DURATION: 100,
}));

const mockUseDialogActions = useDialogActions as jest.MockedFunction<typeof useDialogActions>;
const mockUseDialogStateSelector = useDialogStateSelector as jest.MockedFunction<typeof useDialogStateSelector>;
const mockDelayCallback = delayCallback as jest.MockedFunction<typeof delayCallback>;

describe('useDialog', () => {
  const mockActions = {
    openDialog: jest.fn(),
    closeDialog: jest.fn(),
    resetDialogState: jest.fn(),
    clearDialog: jest.fn(),
  };

  const mockState = {
    isVisible: false,
    severity: 'ERROR' as keyof typeof DialogSeverity,
    title: 'Test Title',
    message: 'Test Message',
    acceptText: 'Accept',
    cancelText: 'Cancel',
    handleAccept: jest.fn(),
    handleCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    mockUseDialogActions.mockReturnValue(mockActions);
    mockUseDialogStateSelector.mockReturnValue(mockState);
    mockDelayCallback.mockImplementation((ms, callback) => {
      callback();

      return Promise.resolve();
    });
  });

  describe('State and Actions', () => {
    it('should return all state properties correctly', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current.isVisible).toBe(mockState.isVisible);
      expect(result.current.severity).toBe(mockState.severity);
      expect(result.current.title).toBe(mockState.title);
      expect(result.current.message).toBe(mockState.message);
      expect(result.current.acceptText).toBe(mockState.acceptText);
      expect(result.current.cancelText).toBe(mockState.cancelText);
    });

    it('should return dialog actions', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current.openDialog).toBeInstanceOf(Function);
      expect(result.current.closeDialog).toBeInstanceOf(Function);
    });

    it('should return dialog handlers', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current.handleAccept).toBeInstanceOf(Function);
      expect(result.current.handleCancel).toBeInstanceOf(Function);
    });
  });

  describe('Dialog Actions', () => {
    it('should call openDialog action with correct parameters', () => {
      const { result } = renderHook(() => useDialog());
      const dialogConfig: import('../../dialog.types').OpenDialog = {
        severity: 'WARNING' as keyof typeof DialogSeverity,
        message: 'Warning message',
        handleAccept: jest.fn(),
      };

      act(() => {
        result.current.openDialog(dialogConfig);
      });

      expect(mockActions.openDialog).toHaveBeenCalledWith(dialogConfig);
    });

    it('should call closeDialog and resetDialogState when closeDialog is called', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeDialog();
      });

      expect(mockActions.closeDialog).toHaveBeenCalled();
      expect(mockDelayCallback).toHaveBeenCalledWith(100, expect.any(Function));
    });
  });

  describe('Dialog Handlers', () => {
    it('should call handleAccept and close dialog when handleAccept is called', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.handleAccept();
      });

      expect(mockState.handleAccept).toHaveBeenCalled();
      expect(mockActions.closeDialog).toHaveBeenCalled();
    });

    it('should call handleCancel and close dialog when handleCancel is called', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.handleCancel?.();
      });

      expect(mockState.handleCancel).toHaveBeenCalled();
      expect(mockActions.closeDialog).toHaveBeenCalled();
    });

    it('should return undefined for handleCancel when no cancel handler is provided', () => {
      const stateWithoutCancel = {
        ...mockState,
        handleCancel: undefined,
      };

      mockUseDialogStateSelector.mockReturnValue(stateWithoutCancel);

      const { result } = renderHook(() => useDialog());

      expect(result.current.handleCancel).toBeUndefined();
    });
  });

  describe('Handler Stability', () => {
    it('should maintain handler reference stability', () => {
      const { result, rerender } = renderHook(() => useDialog());

      const firstRenderHandlers = {
        openDialog: result.current.openDialog,
        closeDialog: result.current.closeDialog,
        handleAccept: result.current.handleAccept,
        handleCancel: result.current.handleCancel,
      };

      rerender();

      expect(result.current.openDialog).toBe(firstRenderHandlers.openDialog);
      expect(result.current.closeDialog).toBe(firstRenderHandlers.closeDialog);
      expect(result.current.handleAccept).toBe(firstRenderHandlers.handleAccept);
      expect(result.current.handleCancel).toBe(firstRenderHandlers.handleCancel);
    });
  });
});
