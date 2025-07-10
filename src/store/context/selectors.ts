import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const selectAppContext = (state: RootState) => state.context;

export const selectAppName = (state: RootState) => state.context.applicationName;

export const selectUser = (state: RootState) => state.context.user;

export const selectUserId = (state: RootState) => state.context.user.id;

export const selectUsername = (state: RootState) => state.context.user.username;

export const selectIsAdmin = (state: RootState) => state.context.user.isAdmin;

export const selectContextFilterCustomerData = createSelector(
  (state: RootState) => state.context.client?.firstName ?? '',
  (state: RootState) => state.context.client?.lastName ?? '',
  (state: RootState) => state.context.company?.name ?? '',
  (firstName, lastName, companyName) => ({
    customerName: `${firstName} ${lastName}`,
    companyName,
  }),
);
