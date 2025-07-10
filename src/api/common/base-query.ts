import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { ZodError, ZodSchema } from 'zod';

import { config } from '@/config';
import { RootState } from '@/store';

import { createErrorResponse, handleZodError } from './api-handle-error';

const baseQueryFn = fetchBaseQuery({
  baseUrl: config.apiUrl,
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-type', 'application/json');
    headers.set('Accept', 'application/json');
    const token = (getState() as RootState).auth.token;

    if (token) headers.set('authorization', `Bearer ${token}`);

    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  { argumentSchema?: ZodSchema; dataSchema?: ZodSchema },
  FetchBaseQueryMeta
> = async (args, api, extraOptions = {}) => {
  if (extraOptions.argumentSchema) {
    try {
      extraOptions.argumentSchema.parse(args);
    } catch (error) {
      if (error instanceof ZodError) return handleZodError(error, args, 'common.api.invalidArgumentsWithParams');

      return {
        error: createErrorResponse({ message: 'common.api.invalidArguments', status: 400, translate: true }),
      };
    }
  }

  const result = await baseQueryFn(args, api, extraOptions);

  if ('data' in result && extraOptions.dataSchema) {
    try {
      extraOptions.dataSchema.parse(result.data);
    } catch (error) {
      if (error instanceof ZodError) return handleZodError(error, args, 'common.api.invalidExpectedDataWithParams');

      return {
        error: createErrorResponse({ message: 'common.api.invalidExpectedData', status: 400, translate: true }),
      };
    }
  }

  return result;
};
