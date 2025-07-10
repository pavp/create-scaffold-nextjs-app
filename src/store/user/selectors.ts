import Cookies from 'js-cookie';

import { COOKIES_NAME } from '@/types';

import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user;

export const selectUserId = (state: RootState) => state.user.id;

export const selectUsername = (state: RootState) => state.user.username;

export const selectIsAdmin = (state: RootState) => state.user.isAdmin;

export const selectUserFromCookies = () => {
  const userCookie = Cookies.get(COOKIES_NAME.USER);

  if (userCookie) {
    return JSON.parse(userCookie);
  }
};
