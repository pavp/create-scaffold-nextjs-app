import type { ShowToast } from '../toast.types';

import { useToastStore } from './toast.store';

// Export actions for use outside React components
export const showToast = (params: ShowToast) => {
  useToastStore.getState().actions.showToast(params);
};

export const closeToast = () => {
  useToastStore.getState().actions.closeToast();
};

export const resetToastState = () => {
  useToastStore.getState().actions.resetToastState();
};

export const clearToast = () => {
  useToastStore.getState().actions.clearToast();
};

// Hook for use inside React components
export const useToastActions = () => {
  const actions = useToastStore((state) => state.actions);

  return actions;
};
