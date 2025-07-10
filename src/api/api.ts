import { createApi } from '@reduxjs/toolkit/query/react';

import { AuthRequest, AuthResponse } from './auth/types';
import { SettingsResponse, SettingsResponseSchema } from './settings/types';
import { User } from './user/types';
import { baseQueryWithReAuth } from './common';
import { Endpoint } from './endpoint';
import { HttpMethods } from './types';

const API_REDUCER_PATH = 'api';

export const api = createApi({
  reducerPath: API_REDUCER_PATH,
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (body) => ({
        url: Endpoint.CoreAuthValidateToken,
        method: HttpMethods.POST,
        body,
      }),
    }),
    getSettings: builder.query<SettingsResponse, void>({
      query: () => ({
        url: Endpoint.Settings,
        method: HttpMethods.GET,
      }),
      extraOptions: {
        dataSchema: SettingsResponseSchema,
      },
    }),
    getMe: builder.query<User, void>({
      query: () => Endpoint.GetMe,
    }),
  }),
});
