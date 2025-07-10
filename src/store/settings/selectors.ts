import { createSelector } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';

import { RootState } from '../store';

const selectLoadSettingsStatus = (state: RootState) => state.settings.status;

export const selectSettings = (state: RootState) => state.settings;

export const selectSettingsLoaded = createSelector(
  [selectLoadSettingsStatus],
  (status) => status === QueryStatus.fulfilled,
);
