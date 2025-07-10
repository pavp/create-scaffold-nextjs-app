'use client';

import { useToastStore } from '../../store/hooks';

export const useShowToast = () => {
  const { snackbarOpen: isToastVisible, updateToast, closeToast } = useToastStore();

  return { isToastVisible, showToast: updateToast, closeToast };
};
