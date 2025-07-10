import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';

import { COOKIES_NAME } from '@/types';

type AuthData = {
  token: string;
  expirationDate: string;
};

type AuthState = AuthData & {
  loginStatus: QueryStatus;
  sessionStatus?: QueryStatus;
};

const initialState: AuthState = {
  token: '',
  expirationDate: '',
  loginStatus: QueryStatus.uninitialized,
  sessionStatus: QueryStatus.uninitialized,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, { payload: { token, expirationDate } }: PayloadAction<AuthData>) => {
      state.token = token;
      state.expirationDate = expirationDate;
      Cookies.set(COOKIES_NAME.SESSION, JSON.stringify({ token, expirationDate }));
    },
    removeSession: () => {
      Cookies.remove(COOKIES_NAME.SESSION);
    },
    resetAuth: () => initialState,
  },
});

export const { setSession, removeSession, resetAuth } = authSlice.actions;

export default authSlice.reducer;
