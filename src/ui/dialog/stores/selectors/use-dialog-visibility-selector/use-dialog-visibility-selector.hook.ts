import { useDialogStore } from '../../dialog.store';

export const useDialogVisibilitySelector = () => {
  const isVisible = useDialogStore((state) => state.isVisible);

  return { isVisible };
};
