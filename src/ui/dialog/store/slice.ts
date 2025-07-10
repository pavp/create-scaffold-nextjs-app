import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DialogState, OpenDialog } from './types';

export const initialState: DialogState = {
  isVisible: false,
  severity: 'ERROR',
  message: '',
  handleAccept: () => {},
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: initialState,
  reducers: {
    openDialog: (
      state,
      {
        payload: { severity, title, message, acceptText, cancelText, handleAccept, handleCancel },
      }: PayloadAction<OpenDialog>,
    ) => {
      state.isVisible = true;
      state.severity = severity;
      state.title = title;
      state.message = message;
      state.acceptText = acceptText;
      state.cancelText = cancelText;
      state.handleAccept = handleAccept;
      state.handleCancel = handleCancel;
    },
    closeDialog: (state) => {
      state.isVisible = false;
    },
    resetDialogState: (state) => {
      return {
        ...initialState,
        isVisible: state.isVisible,
      };
    },
    clearDialog: () => initialState,
  },
});

export const { openDialog, closeDialog, resetDialogState, clearDialog } = dialogSlice.actions;

export const dialogReducer = dialogSlice.reducer;
