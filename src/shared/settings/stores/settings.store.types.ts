import type { SettingsResponse } from '@/shared/settings/settings.types';

// Settings store state (only data, no status - React Query handles status)
export interface SettingsState {
  mixpanelApiKey: string;
  screebWebsiteId: string;
  muiApiKey: string;
}

// Settings store actions
export interface SettingsActions {
  persistSettings: (settingsResponse: SettingsResponse) => void;
  clearSettings: () => void;
}

// Combined settings store state
export interface SettingsStoreState extends SettingsState {
  actions: SettingsActions;
}
