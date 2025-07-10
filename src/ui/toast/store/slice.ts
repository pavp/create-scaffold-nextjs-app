import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ShowToast, Toast } from '../types';

export const initialState: Toast = {
  snackbarOpen: false,
  snackbarMessage: '',
  severity: 'INFO',
  needTranslation: false,
  translationParams: undefined,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState: initialState,
  reducers: {
    setToast: (
      state,
      {
        payload: { snackbarMessage, severity, needTranslation = false, onConfirmation, translationParams },
      }: PayloadAction<ShowToast>,
    ) => {
      state.snackbarOpen = true;
      state.snackbarMessage = snackbarMessage;
      state.severity = severity;
      state.needTranslation = needTranslation;
      state.translationParams = translationParams;
      state.onConfirmation = onConfirmation;
    },
    closeToast: (state) => {
      state.snackbarOpen = false;
    },
    resetToastState: (state) => {
      return {
        ...initialState,
        snackbarOpen: state.snackbarOpen,
      };
    },
    clearToast: () => initialState,
  },
});

export const { setToast, clearToast, closeToast, resetToastState } = toastSlice.actions;

export const toastReducer = toastSlice.reducer;
