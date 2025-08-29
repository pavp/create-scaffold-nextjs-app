import { useSettingsStore } from '@/shared/settings/stores/settings.store';

/**
 * Selector for screeb website ID
 * Optimized for components that only need screeb configuration
 */
export const useScreebWebsiteIdSelector = () => {
  const screebWebsiteId = useSettingsStore((state) => state.screebWebsiteId);

  return {
    screebWebsiteId,
  };
};
