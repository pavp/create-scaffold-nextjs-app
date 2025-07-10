'use client';

import { useDialogStore } from '../../store/hooks';

export const useShowDialog = () => {
  const { handleOpenDialog: showDialog } = useDialogStore();

  return { showDialog };
};
