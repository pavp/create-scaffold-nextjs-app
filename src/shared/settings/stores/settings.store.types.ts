import type { SettingsResponse } from '@/shared/settings/settings.types';

export interface SettingsState {
  muiApiKey: string;
}

export interface SettingsActions {
  persistSettings: (settingsResponse: SettingsResponse) => void;
  clearSettings: () => void;
}

export interface SettingsStoreState extends SettingsState {
  actions: SettingsActions;
}
