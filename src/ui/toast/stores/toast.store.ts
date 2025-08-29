import type { Draft } from 'immer';

import { createStoreWithMiddleware } from '@/core/lib/zustand';

import type { ShowToast, Toast } from '../toast.types';

import type { ToastStoreState } from './toast.store.types';

const initialState: Toast = {
  snackbarOpen: false,
  snackbarMessage: '',
  severity: 'INFO' as const,
  needTranslation: false,
  translationParams: undefined,
  onConfirmation: undefined,
};

export const useToastStore = createStoreWithMiddleware<ToastStoreState>(
  (set, _get) => ({
    ...initialState,
    actions: {
      showToast: (params: ShowToast) =>
        set((draft: Draft<ToastStoreState>) => {
          draft.snackbarOpen = true;
          draft.snackbarMessage = params.snackbarMessage;
          draft.severity = params.severity;
          draft.needTranslation = params.needTranslation ?? false;
          draft.translationParams = params.translationParams;
          draft.onConfirmation = params.onConfirmation;
        }),

      closeToast: () =>
        set((draft: Draft<ToastStoreState>) => {
          draft.snackbarOpen = false;
        }),

      resetToastState: () =>
        set((draft: Draft<ToastStoreState>) => {
          const currentOpen = draft.snackbarOpen;

          Object.assign(draft, initialState);
          draft.snackbarOpen = currentOpen;
        }),

      clearToast: () =>
        set((draft: Draft<ToastStoreState>) => {
          Object.assign(draft, initialState);
        }),
    },
  }),
  'toast-store',
  { persist: false },
);
