import { createSlice } from '@reduxjs/toolkit';
import * as Screeb from '@screeb/sdk-browser';

import { Analytics } from '@/core/lib';

type TrackingState = {
  initialized: boolean;
};

export const initialState: TrackingState = {
  initialized: false,
};

export const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setTrackingInitialized: (state) => {
      state.initialized = true;
    },
    resetTracking: () => {
      if (Screeb.isLoaded()) {
        Screeb.close();
      }
      Analytics.reset();
    },
  },
});

export const { setTrackingInitialized, resetTracking } = trackingSlice.actions;

export const trackingReducer = trackingSlice.reducer;
