import { useCallback } from 'react';

import { useDialogStore } from '../../store/hooks';

export const useDialog = () => {
  const {
    isVisible,
    severity,
    title,
    message,
    acceptText,
    cancelText,
    handleAcceptDialog,
    handleCancelDialog,
    handleCloseDialog,
  } = useDialogStore();

  const handleAccept = useCallback(() => {
    handleAcceptDialog();
    handleCloseDialog();
  }, [handleAcceptDialog, handleCloseDialog]);

  const handleCancel = useCallback(() => {
    handleCancelDialog?.();
    handleCloseDialog();
  }, [handleCancelDialog, handleCloseDialog]);

  return {
    state: {
      isVisible,
      severity,
      title,
      message,
      acceptText,
      cancelText,
    },
    methods: {
      handleAccept,
      handleCancel: handleCancelDialog ? handleCancel : undefined,
    },
  };
};
