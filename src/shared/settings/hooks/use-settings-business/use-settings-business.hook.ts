import { useCallback, useEffect } from 'react';

import { settingsRepository } from '@/shared/settings/repositories/settings';
import {
  useMixpanelApiKeySelector,
  useMuiApiKeySelector,
  useScreebWebsiteIdSelector,
} from '@/shared/settings/selectors';
import { useSettingsActions } from '@/shared/settings/stores/settings.store.actions';
import type { DataSource } from '@/types/gateway.types';

/**
 * Settings Business Hook
 * Hybrid approach: React Query for status/fetching + Zustand store for persistence
 * Uses granular selectors for optimal performance
 */
export const useSettingsBusiness = (dataSource: DataSource = 'http') => {
  // Store state using granular selectors
  const { mixpanelApiKey } = useMixpanelApiKeySelector();
  const { screebWebsiteId } = useScreebWebsiteIdSelector();
  const { muiApiKey } = useMuiApiKeySelector();

  // Store actions
  const { persistSettings, clearSettings } = useSettingsActions();

  // React Query for status and fetching
  const settingsQuery = settingsRepository.queries.useSettings(dataSource);

  // Sync successful data with store for persistence
  useEffect(() => {
    if (settingsQuery.isSuccess && settingsQuery.data) persistSettings(settingsQuery.data);
  }, [settingsQuery.isSuccess, settingsQuery.data, persistSettings]);

  // Business methods
  const refreshSettings = useCallback(async () => {
    await settingsQuery.refetch();
  }, [settingsQuery]);

  const resetSettings = useCallback(() => {
    clearSettings();
    settingsRepository.queries.cancel.cancelAll();
  }, [clearSettings]);

  return {
    // Settings data (from persisted store)
    mixpanelApiKey,
    screebWebsiteId,
    muiApiKey,

    // Status from React Query (no duplication)
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    isSuccess: settingsQuery.isSuccess,
    error: settingsQuery.error?.message || null,

    // Actions
    refreshSettings,
    resetSettings,

    // Query info
    dataSource,
  };
};
