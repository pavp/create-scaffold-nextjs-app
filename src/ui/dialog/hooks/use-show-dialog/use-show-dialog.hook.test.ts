import { renderHook } from '@test/utils';

import { DialogSeverity, OpenDialog } from '../../dialog.types';
import { useDialog } from '../use-dialog/use-dialog.hook';

import { useShowDialog } from './use-show-dialog.hook';

// Mock the useDialog hook
jest.mock('../use-dialog/use-dialog.hook');

const mockUseDialog = useDialog as jest.MockedFunction<typeof useDialog>;

describe('useShowDialog', () => {
  const mockOpenDialog = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseDialog.mockReturnValue({
      openDialog: mockOpenDialog,
      isVisible: false,
      severity: 'ERROR',
      title: undefined,
      message: '',
      acceptText: undefined,
      cancelText: undefined,
      closeDialog: jest.fn(),
      handleAccept: jest.fn(),
      handleCancel: undefined,
    });
  });

  describe('Hook Interface', () => {
    it('should return showDialog function', () => {
      const { result } = renderHook(() => useShowDialog());

      expect(typeof result.current.showDialog).toBe('function');
      expect(result.current.showDialog).toBe(mockOpenDialog);
    });
  });

  describe('Integration with useDialog', () => {
    it('should use openDialog from useDialog hook', () => {
      renderHook(() => useShowDialog());

      expect(mockUseDialog).toHaveBeenCalled();
    });

    it('should pass through calls to openDialog', () => {
      const { result } = renderHook(() => useShowDialog());
      const dialogConfig: OpenDialog = {
        severity: 'WARNING' as keyof typeof DialogSeverity,
        message: 'Test message',
        handleAccept: jest.fn(),
      };

      result.current.showDialog(dialogConfig);

      expect(mockOpenDialog).toHaveBeenCalledWith(dialogConfig);
    });

    it('should handle all dialog configuration options', () => {
      const { result } = renderHook(() => useShowDialog());
      const fullDialogConfig: OpenDialog = {
        severity: 'ERROR' as keyof typeof DialogSeverity,
        title: 'Error Title',
        message: 'Error message',
        acceptText: 'OK',
        cancelText: 'Cancel',
        handleAccept: jest.fn(),
        handleCancel: jest.fn(),
      };

      result.current.showDialog(fullDialogConfig);

      expect(mockOpenDialog).toHaveBeenCalledWith(fullDialogConfig);
    });
  });

  describe('Hook Stability', () => {
    it('should maintain showDialog reference stability', () => {
      const { result, rerender } = renderHook(() => useShowDialog());

      const firstRenderShowDialog = result.current.showDialog;

      rerender();

      expect(result.current.showDialog).toBe(firstRenderShowDialog);
    });
  });
});
