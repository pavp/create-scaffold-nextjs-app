import { useShallow } from 'zustand/react/shallow';

import { useToastStore } from '../../toast.store';

export const useToastMessageSelector = () => {
  const { snackbarMessage, needTranslation, translationParams } = useToastStore(
    useShallow((state) => ({
      snackbarMessage: state.snackbarMessage,
      needTranslation: state.needTranslation,
      translationParams: state.translationParams,
    })),
  );

  return { snackbarMessage, needTranslation, translationParams };
};
