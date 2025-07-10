'use client';

import React, { useMemo } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import { Alert, Snackbar, ToastSeverity, Typography } from '..';

import { ConfirmationComponent } from './components';
import { TRANSITION_DURATION } from './constants';
import { useToast } from './hooks';

import styles from './styles.module.scss';

const { snackbar, hideAction, messageAlert } = styles;

const variantIcon = {
  SUCCESS: CheckCircleOutlineIcon,
  WARNING: ReportProblemIcon,
  ERROR: CancelIcon,
  INFO: InfoOutlinedIcon,
};

export const Toast = () => {
  const { snackbarOpen, severity, message, onConfirmation, handleClose } = useToast();

  const Icon = variantIcon[severity];
  const alertClass = useMemo(() => {
    return severity === 'SUCCESS' ? hideAction : '';
  }, [severity]);

  return (
    <Snackbar
      className={snackbar}
      data-testid="snackbar-toast"
      open={snackbarOpen}
      transitionDuration={TRANSITION_DURATION}
    >
      <Alert
        className={alertClass}
        data-testid="alert-toast"
        icon={<Icon />}
        severity={severity.toLowerCase() as ToastSeverity}
        variant="filled"
        onClose={handleClose}
      >
        {onConfirmation ? (
          <ConfirmationComponent message={message} onConfirmation={onConfirmation} />
        ) : (
          <Typography className={messageAlert}>{message}</Typography>
        )}
      </Alert>
    </Snackbar>
  );
};
