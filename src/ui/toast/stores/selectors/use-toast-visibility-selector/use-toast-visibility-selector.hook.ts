import { useToastStore } from '../../toast.store';

export const useToastVisibilitySelector = () => {
  const snackbarOpen = useToastStore((state) => state.snackbarOpen);

  return { snackbarOpen };
};
