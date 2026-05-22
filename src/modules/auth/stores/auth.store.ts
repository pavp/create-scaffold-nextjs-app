import Cookies from 'js-cookie';

import { createStoreWithMiddleware } from '@/core/lib/zustand';
import { COOKIES_NAME } from '@/types/cookies.types';

import type { AuthState, AuthStoreState } from './auth.store.types';

const initialState: AuthState = {
  token: '',
  expirationDate: '',
  isAuthenticated: false,
};

export const useAuthStore = createStoreWithMiddleware<AuthStoreState>(
  (set, get) => ({
    ...initialState,
    actions: {
      setToken: (token) => set({ token }),
      setSession: (session) => {
        set({
          ...session,
          isAuthenticated: Boolean(session.token),
        });

        if (session.token && session.expirationDate) {
          Cookies.set(
            COOKIES_NAME.SESSION,
            JSON.stringify({
              token: session.token,
              expirationDate: session.expirationDate,
            }),
          );
        }
      },
      clearSession: () => {
        set(initialState);
        Cookies.remove(COOKIES_NAME.SESSION);
      },
      validateSession: () => {
        const state = get();

        if (!state.token || !state.expirationDate) {
          return false;
        }

        const isExpired = new Date() >= new Date(state.expirationDate);

        if (isExpired) {
          state.actions.clearSession();

          return false;
        }

        return true;
      },
    },
  }),
  'auth-store',
  {
    persist: true,
  },
);
