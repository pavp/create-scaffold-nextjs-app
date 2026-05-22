import { useCallback, useEffect } from 'react';

import { settingsRepository } from '@/shared/settings/repositories/settings';
import { useMuiApiKeySelector } from '@/shared/settings/selectors';
import { useSettingsActions } from '@/shared/settings/stores/settings.store.actions';
import type { DataSource } from '@/types/gateway.types';

export const useSettingsBusiness = (dataSource: DataSource = 'http') => {
  const { muiApiKey } = useMuiApiKeySelector();
  const { persistSettings, clearSettings } = useSettingsActions();
  const settingsQuery = settingsRepository.queries.useSettings(dataSource);

  useEffect(() => {
    if (settingsQuery.isSuccess && settingsQuery.data) persistSettings(settingsQuery.data);
  }, [settingsQuery.isSuccess, settingsQuery.data, persistSettings]);

  const refreshSettings = useCallback(async () => {
    await settingsQuery.refetch();
  }, [settingsQuery]);

  const resetSettings = useCallback(() => {
    clearSettings();
    settingsRepository.queries.cancel.cancelAll();
  }, [clearSettings]);

  return {
    muiApiKey,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    isSuccess: settingsQuery.isSuccess,
    error: settingsQuery.error?.message || null,
    refreshSettings,
    resetSettings,
    dataSource,
  };
};
