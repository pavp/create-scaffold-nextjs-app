import type { Draft } from 'immer';

import { createStoreWithMiddleware } from '@/core/lib/zustand';

import type { OpenDialog } from '../dialog.types';

import type { DialogSeverity, DialogState, DialogStoreState } from './dialog.store.types';

const initialState: DialogState = {
  isVisible: false,
  severity: 'ERROR' as keyof typeof DialogSeverity,
  message: '',
  title: undefined,
  acceptText: undefined,
  cancelText: undefined,
  handleAccept: () => {},
  handleCancel: undefined,
};

export const useDialogStore = createStoreWithMiddleware<DialogStoreState>(
  (set, _get) => ({
    ...initialState,
    actions: {
      openDialog: (params: OpenDialog) =>
        set((draft: Draft<DialogStoreState>) => {
          draft.isVisible = true;
          draft.severity = params.severity;
          draft.title = params.title;
          draft.message = params.message;
          draft.acceptText = params.acceptText;
          draft.cancelText = params.cancelText;
          draft.handleAccept = params.handleAccept;
          draft.handleCancel = params.handleCancel;
        }),

      closeDialog: () =>
        set((draft: Draft<DialogStoreState>) => {
          draft.isVisible = false;
        }),

      resetDialogState: () =>
        set((draft: Draft<DialogStoreState>) => {
          const currentVisible = draft.isVisible;

          draft.isVisible = currentVisible;
          draft.severity = initialState.severity;
          draft.message = initialState.message;
          draft.title = initialState.title;
          draft.acceptText = initialState.acceptText;
          draft.cancelText = initialState.cancelText;
          draft.handleAccept = initialState.handleAccept;
          draft.handleCancel = initialState.handleCancel;
        }),

      clearDialog: () =>
        set((draft: Draft<DialogStoreState>) => {
          draft.isVisible = initialState.isVisible;
          draft.severity = initialState.severity;
          draft.message = initialState.message;
          draft.title = initialState.title;
          draft.acceptText = initialState.acceptText;
          draft.cancelText = initialState.cancelText;
          draft.handleAccept = initialState.handleAccept;
          draft.handleCancel = initialState.handleCancel;
        }),
    },
  }),
  'dialog-store',
  { persist: false },
);
