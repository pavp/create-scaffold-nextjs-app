import { useGetSettingsQuery } from '@/api';

export const useFetchSettings = () => {
  return useGetSettingsQuery();
};
