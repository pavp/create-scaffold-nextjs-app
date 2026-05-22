'use client';

import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogContentText as MuiDialogContentText,
  DialogTitle as MuiDialogTitle,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui';

import { useDialog } from './hooks';

const Dialog = () => {
  const t = useTranslations('common');
  const { isVisible, severity, title, message, acceptText, cancelText, handleAccept, handleCancel } = useDialog();
  const dialogTitle = title ?? t('dialog.title');
  const dialogAcceptText = acceptText ?? t('dialog.accept');
  const dialogCancelText = cancelText ?? t('dialog.cancel');
  const severityClass = severity === 'WARNING' ? 'warningDialog' : 'errorDialog';

  return (
    <MuiDialog
      aria-describedby="child-dialog-description"
      aria-labelledby="child-dialog-title"
      classes={{ root: severityClass }}
      data-testid="dialog-mui"
      open={isVisible}
    >
      <MuiDialogTitle>
        {severity === 'WARNING' ? <WarningIcon /> : <CancelIcon />}
        {dialogTitle}
      </MuiDialogTitle>
      <MuiDialogContent dividers>
        <MuiDialogContentText id="alert-dialog-description">{message}</MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button color="primary" variant="outlined" onClick={handleAccept}>
          {dialogAcceptText}
        </Button>
        {handleCancel && (
          <Button color="primary" variant="contained" onClick={handleCancel}>
            {dialogCancelText}
          </Button>
        )}
      </MuiDialogActions>
    </MuiDialog>
  );
};

const MemoizedComponent = React.memo(Dialog);

export { MemoizedComponent as Dialog };
