import { useCallback } from 'react';

import { delayCallback } from '@/core/helpers';
import { DIALOG_RESET_STATE_DURATION } from '@/ui/dialog/constants';

import { OpenDialog } from '../../dialog.types';
import { useDialogActions } from '../../stores/dialog.store.actions';
import { useDialogStateSelector } from '../../stores/selectors';

export const useDialog = () => {
  const state = useDialogStateSelector();
  const actions = useDialogActions();
  const { handleAccept: handleAcceptDialog, handleCancel: handleCancelDialog, ...restState } = state;

  const handleCloseDialog = useCallback(() => {
    actions.closeDialog();
    delayCallback(DIALOG_RESET_STATE_DURATION, () => actions.resetDialogState());
  }, [actions]);

  const handleOpenDialog = useCallback(
    ({ severity, title, message, acceptText, cancelText, handleAccept, handleCancel }: OpenDialog) => {
      actions.openDialog({
        severity,
        title,
        message,
        acceptText,
        cancelText,
        handleAccept,
        handleCancel,
      });
    },
    [actions],
  );

  const handleAccept = useCallback(() => {
    handleAcceptDialog();
    handleCloseDialog();
  }, [handleAcceptDialog, handleCloseDialog]);

  const handleCancel = useCallback(() => {
    handleCancelDialog?.();
    handleCloseDialog();
  }, [handleCancelDialog, handleCloseDialog]);

  return {
    // State
    isVisible: restState.isVisible,
    severity: restState.severity,
    title: restState.title,
    message: restState.message,
    acceptText: restState.acceptText,
    cancelText: restState.cancelText,

    // Actions
    openDialog: handleOpenDialog,
    closeDialog: handleCloseDialog,

    // Dialog handlers (for dialog component usage)
    handleAccept,
    handleCancel: handleCancelDialog ? handleCancel : undefined,
  };
};
