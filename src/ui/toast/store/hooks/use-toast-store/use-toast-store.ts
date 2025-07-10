'use client';

import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ShowToast } from '@/ui/toast/types';

import { selectSnackbar } from '../../selectors';
import { closeToast as closeCurrentToast, resetToastState, setToast } from '../../slice';

export const useToastStore = () => {
  const state = useAppSelector(selectSnackbar);
  const dispatch = useAppDispatch();

  const updateToast = useCallback(
    ({ snackbarMessage, severity, needTranslation = false, onConfirmation }: ShowToast) => {
      dispatch(
        setToast({
          severity,
          snackbarMessage,
          onConfirmation,
          needTranslation,
        }),
      );
    },
    [dispatch],
  );

  const closeToast = useCallback(() => {
    dispatch(closeCurrentToast());
  }, [dispatch]);

  const resetToastToInitialState = useCallback(() => {
    dispatch(resetToastState());
  }, [dispatch]);

  return { ...state, updateToast, closeToast, resetToastToInitialState };
};
