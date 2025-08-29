import { useToastStore } from '../../toast.store';

export const useToastConfirmationSelector = () => {
  const onConfirmation = useToastStore((state) => state.onConfirmation);

  return { onConfirmation };
};
