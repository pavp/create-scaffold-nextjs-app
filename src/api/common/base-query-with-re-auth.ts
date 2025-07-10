import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { RootState } from '@/store';

import { handleOtherErrors, handleUnauthorizedError } from './api-handle-error';
import { handleExpiredToken } from './api-handle-expired-token';
import { baseQuery } from './base-query';

export const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const expirationDate = (api.getState() as RootState).auth.expirationDate;

  if (expirationDate) handleExpiredToken({ expirationDate, api, extraOptions });

  const response = await baseQuery(args, api, extraOptions);

  if (response.error) {
    if (response.error.status === 401) handleUnauthorizedError(api);
    else handleOtherErrors(response.error, api);
  }

  return response;
};
