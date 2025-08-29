import type { OpenDialog } from '../dialog.types';

import { useDialogStore } from './dialog.store';

// Export actions for use outside React components
export const openDialog = (params: OpenDialog) => {
  useDialogStore.getState().actions.openDialog(params);
};

export const closeDialog = () => {
  useDialogStore.getState().actions.closeDialog();
};

export const resetDialogState = () => {
  useDialogStore.getState().actions.resetDialogState();
};

export const clearDialog = () => {
  useDialogStore.getState().actions.clearDialog();
};

// Hook for use inside React components
export const useDialogActions = () => {
  const actions = useDialogStore((state) => state.actions);

  return actions;
};
