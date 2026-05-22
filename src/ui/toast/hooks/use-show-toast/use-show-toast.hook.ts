'use client';

import { useToastVisibilitySelector } from '../../stores/selectors';
import { useToastActions } from '../../stores/toast.store.actions';

export const useShowToast = () => {
  const { snackbarOpen } = useToastVisibilitySelector();
  const { showToast, closeToast } = useToastActions();

  return {
    isToastVisible: snackbarOpen,
    showToast,
    closeToast,
  };
};
