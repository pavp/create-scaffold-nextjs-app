import { useSettingsStore } from '@/shared/settings/stores/settings.store';

/**
 * Selector for mixpanel API key
 * Optimized for components that only need mixpanel configuration
 */
export const useMixpanelApiKeySelector = () => {
  const mixpanelApiKey = useSettingsStore((state) => state.mixpanelApiKey);

  return {
    mixpanelApiKey,
  };
};
