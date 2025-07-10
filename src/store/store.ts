import { combineReducers, configureStore } from '@reduxjs/toolkit';

// import logger from 'redux-logger';
import { api } from '@/api';
import { config } from '@/config';
import { trackingSlice } from '@/core/components/tracking/store';
import { dialogSlice } from '@/ui/dialog/store/slice';
import { toastSlice } from '@/ui/toast/store';

import { authSlice, removeSession } from './auth/slice';
import { contextSlice } from './context/slice';
import { settingsSlice } from './settings/slice';
import { userSlice } from './user/slice';

const combinedReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [authSlice.name]: authSlice.reducer,
  [contextSlice.name]: contextSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [trackingSlice.name]: trackingSlice.reducer,
  [toastSlice.name]: toastSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [dialogSlice.name]: dialogSlice.reducer,
});

const rootReducer: typeof combinedReducer = (state, action) => {
  // Reset all slices when the user logs out
  if (action.type === removeSession.type && state) {
    const newState = {
      ...state,
      [authSlice.name]: authSlice.getInitialState(),
      [contextSlice.name]: contextSlice.getInitialState(),
      [settingsSlice.name]: settingsSlice.getInitialState(),
      [trackingSlice.name]: trackingSlice.getInitialState(),
      [toastSlice.name]: toastSlice.getInitialState(),
      [userSlice.name]: userSlice.getInitialState(),
      [dialogSlice.name]: dialogSlice.getInitialState(),
    };

    return combinedReducer(newState, action);
  }

  return combinedReducer(state, action);
};

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: config.isDev,
    middleware: (gDM) =>
      gDM({ serializableCheck: false })
        .concat([api.middleware])
        .concat(config.isDev ? [] : []),
  });
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore['dispatch'];
