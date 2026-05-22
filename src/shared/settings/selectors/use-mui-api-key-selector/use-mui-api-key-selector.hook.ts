import { useSettingsStore } from '@/shared/settings/stores/settings.store';

/**
 * Selector for MUI API key
 * Optimized for components that only need MUI license configuration
 */
export const useMuiApiKeySelector = () => {
  const muiApiKey = useSettingsStore((state) => state.muiApiKey);

  return {
    muiApiKey,
  };
};
