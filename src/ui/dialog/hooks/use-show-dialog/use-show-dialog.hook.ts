'use client';

import { useDialog } from '../use-dialog/use-dialog.hook';

export const useShowDialog = () => {
  const { openDialog: showDialog } = useDialog();

  return { showDialog };
};
