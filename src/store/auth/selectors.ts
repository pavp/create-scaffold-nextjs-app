import { createSelector } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';

import { COOKIES_NAME } from '@/types';

import { RootState } from '../store';

export const selectCurrentToken = (state: RootState) => state.auth.token;

export const selectLoginStatus = (state: RootState) => state.auth.loginStatus;

export const selectSessionStatus = (state: RootState) => state.auth.sessionStatus;

export const selectSessionFromCookies = () => Cookies.get(COOKIES_NAME.SESSION);

export const selectIsSessionReady = createSelector([selectSessionStatus], (status) => status === QueryStatus.fulfilled);

export const selectIsSessionLoading = createSelector(
  [selectSessionStatus],
  (status) => status === QueryStatus.pending || status === QueryStatus.uninitialized,
);

export const selectSessionError = createSelector([selectSessionStatus], (status) => status === QueryStatus.rejected);
