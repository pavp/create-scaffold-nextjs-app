import { createSlice } from '@reduxjs/toolkit';

import { User, UserResponse } from '@/api/user';

interface AppContext {
  applicationName: string;
  user: User;
  client: {
    firstName: string;
    lastName: string;
  };
  company: { name: string };
}

export const initialState: AppContext = {
  applicationName: '',
  user: {
    id: '',
    username: '',
    isAdmin: false,
    applicationName: '',
  },
  client: {
    firstName: '',
    lastName: '',
  },
  company: {
    name: '',
  },
};

export const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: UserResponse }) => {
      state.user.id = payload.id;
      state.user.username = payload.username;
      state.user.isAdmin = payload.isAdmin;
    },
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = contextSlice.actions;

export default contextSlice.reducer;
