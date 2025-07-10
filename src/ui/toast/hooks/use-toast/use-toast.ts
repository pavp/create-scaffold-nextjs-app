'use client';

import { RefObject, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { delayCallback } from '@/core/helpers';

import { TOAST_RESET_STATE_DURATION, TOAST_SUCCESS_DURATION } from '../../constants';
import { useToastStore } from '../../store/hooks';

export const useToast = () => {
  const t = useTranslations();
  const {
    snackbarOpen,
    severity,
    snackbarMessage,
    needTranslation,
    translationParams,
    onConfirmation,
    closeToast,
    resetToastToInitialState,
  } = useToastStore();

  const handleClose = useCallback(() => {
    closeToast();
    delayCallback(TOAST_RESET_STATE_DURATION, () => resetToastToInitialState);
  }, [closeToast, resetToastToInitialState]);

  const timer: RefObject<NodeJS.Timeout | undefined> = useRef(undefined);

  useEffect(() => {
    if (snackbarOpen && severity === 'SUCCESS') {
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        handleClose();
      }, TOAST_SUCCESS_DURATION);
    }
  }, [snackbarOpen, severity, handleClose]);

  return {
    snackbarOpen,
    severity,
    message: needTranslation ? t(snackbarMessage, { ...translationParams }) : snackbarMessage,
    onConfirmation,
    handleClose,
  };
};
