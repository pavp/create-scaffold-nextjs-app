import type { Draft } from 'immer';

import { config } from '@/config';
import { createStoreWithMiddleware } from '@/core/lib/zustand';
import type { SettingsResponse } from '@/shared/settings/settings.types';

import type { SettingsState, SettingsStoreState } from './settings.store.types';

export const initialSettingsState: SettingsState = {
  muiApiKey: '',
};

export const useSettingsStore = createStoreWithMiddleware<SettingsStoreState>(
  (set, _get) => ({
    ...initialSettingsState,
    actions: {
      persistSettings: (settingsResponse: SettingsResponse) =>
        set((draft: Draft<SettingsStoreState>) => {
          draft.muiApiKey = config.muiLicense || settingsResponse.muiKey;
        }),

      clearSettings: () => set({ ...initialSettingsState }),
    },
  }),
  'settings-store',
  {
    persist: true,
    exclude: [],
  },
);
