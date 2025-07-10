'use client';

import { useCallback } from 'react';

import { delayCallback } from '@/core/helpers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DIALOG_RESET_STATE_DURATION } from '@/ui/dialog/constants';

import { selectDialog } from '../../selectors';
import { closeDialog, openDialog, resetDialogState } from '../../slice';
import { OpenDialog } from '../../types';

export const useDialogStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectDialog);
  const { handleAccept: handleAcceptDialog, handleCancel: handleCancelDialog, ...restState } = state;

  const handleCloseDialog = useCallback(() => {
    dispatch(closeDialog());
    delayCallback(DIALOG_RESET_STATE_DURATION, () => dispatch(resetDialogState()));
  }, [dispatch]);

  const handleOpenDialog = useCallback(
    ({ severity, title, message, acceptText, cancelText, handleAccept, handleCancel }: OpenDialog) => {
      dispatch(
        openDialog({
          severity,
          title,
          message,
          acceptText,
          cancelText,
          handleAccept,
          handleCancel,
        }),
      );
    },
    [dispatch],
  );

  return { ...restState, handleAcceptDialog, handleCancelDialog, handleCloseDialog, handleOpenDialog };
};
