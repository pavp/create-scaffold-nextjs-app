import type { ShowToast, Toast } from '../toast.types';

export interface ToastStoreState extends Toast {
  actions: {
    showToast: (params: ShowToast) => void;
    closeToast: () => void;
    resetToastState: () => void;
    clearToast: () => void;
  };
}

export interface ToastActions {
  showToast: (params: ShowToast) => void;
  closeToast: () => void;
  resetToastState: () => void;
  clearToast: () => void;
}
