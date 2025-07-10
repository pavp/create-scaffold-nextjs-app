'use client';

import { useAppSelector } from '@/store/hooks';
import { selectSettings, selectSettingsLoaded } from '@/store/settings';

export const useSettingsStore = () => {
  const settings = useAppSelector(selectSettings);
  const isSettingsLoaded = useAppSelector(selectSettingsLoaded);

  return { ...settings, isSettingsLoaded };
};
