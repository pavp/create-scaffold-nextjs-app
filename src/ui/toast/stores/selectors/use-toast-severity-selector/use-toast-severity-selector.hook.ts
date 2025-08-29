import { useToastStore } from '../../toast.store';

export const useToastSeveritySelector = () => {
  const severity = useToastStore((state) => state.severity);

  return { severity };
};
