import { createSlice } from '@reduxjs/toolkit';

import { User, UserResponse } from '@/api/user';

export const initialState: User = {
  id: '',
  username: '',
  applicationName: '',
  isAdmin: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: UserResponse }) => {
      state.id = payload.id;
      state.username = payload.username;
      state.isAdmin = payload.isAdmin;
      state.applicationName = payload.applicationName;
    },
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
