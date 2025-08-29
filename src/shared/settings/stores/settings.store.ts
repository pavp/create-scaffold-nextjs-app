import type { Draft } from 'immer';

import { config } from '@/config';
import { createStoreWithMiddleware } from '@/core/lib/zustand';
import type { SettingsResponse } from '@/shared/settings/settings.types';

import type { SettingsState, SettingsStoreState } from './settings.store.types';

// Initial state (only data, no status)
export const initialSettingsState: SettingsState = {
  mixpanelApiKey: '',
  screebWebsiteId: '',
  muiApiKey: '',
};

export const useSettingsStore = createStoreWithMiddleware<SettingsStoreState>(
  (set, _get) => ({
    ...initialSettingsState,
    actions: {
      persistSettings: (settingsResponse: SettingsResponse) =>
        set((draft: Draft<SettingsStoreState>) => {
          // Prioritize config variables, if empty, use server config
          draft.mixpanelApiKey = config.mixpanelToken || settingsResponse.mixPanelKey;
          draft.screebWebsiteId = config.screebWebsiteId || settingsResponse.screeb_website_id;
          draft.muiApiKey = config.muiLicense || settingsResponse.muiKey;
        }),

      clearSettings: () => set({ ...initialSettingsState }),
    },
  }),
  'settings-store',
  {
    persist: true,
    exclude: [], // All settings should persist
  },
);
