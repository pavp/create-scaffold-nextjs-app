import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';

import { getSettings } from '@/api';
import { SettingsResponse } from '@/api/settings';
import { config } from '@/config';

export interface SettingsState {
  mixpanelApiKey: string;
  screebWebsiteId: string;
  muiApiKey: string;
  status: QueryStatus;
}

export const initialState: SettingsState = {
  mixpanelApiKey: '',
  screebWebsiteId: '',
  muiApiKey: '',
  status: QueryStatus.uninitialized,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettings: () => initialState,
  },
  //TODO: add tests for extraReducers addMatcher
  extraReducers: (builder) => {
    builder.addMatcher(getSettings.matchFulfilled, (state, { payload }: PayloadAction<SettingsResponse>) => {
      // Prioritize config variables, if empty, use server config (this allows local testing via .env.local file)
      state.mixpanelApiKey = config.mixpanelToken || payload.mixPanelKey;
      state.screebWebsiteId = config.screebWebsiteId || payload.screeb_website_id;
      state.muiApiKey = config.muiLicense || payload.muiKey;
      state.status = QueryStatus.fulfilled;
    });
    builder.addMatcher(getSettings.matchPending, (state) => {
      state.status = QueryStatus.pending;
    });
    builder.addMatcher(getSettings.matchRejected, (state) => {
      state.status = QueryStatus.rejected;
    });
  },
});

export const { clearSettings } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
