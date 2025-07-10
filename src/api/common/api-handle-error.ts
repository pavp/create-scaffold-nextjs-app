import { BaseQueryApi, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ZodError } from 'zod';

import { redirectTo401 } from '@/actions';
import { setToast } from '@/ui/toast/store';

import { BackendError } from '../types';

import { ErrorResponseProps } from './types';

export const handleUnauthorizedError = (api: BaseQueryApi) => {
  // api.dispatch(removeCurrentSession(role)); // TODO: implement remove current session
  api.dispatch(
    setToast({
      severity: 'ERROR',
      snackbarMessage: 'common.notAuthenticatedMessage',
      needTranslation: true,
      onConfirmation: redirectTo401,
    }),
  );
};

export const handleOtherErrors = (error: FetchBaseQueryError, api: BaseQueryApi) => {
  const { message, translate, translationParams } = (error?.data as BackendError) ?? {};

  api.dispatch(
    setToast({
      severity: 'ERROR',
      snackbarMessage: message || 'common.unknownError',
      needTranslation: !message || translate,
      translationParams,
    }),
  );
};

export const handleZodError = (error: ZodError, args: string | FetchArgs, message: string) => {
  const url = typeof args === 'string' ? args : args.url;
  const errors = error.errors.map((e) => `${e.path.join('.')} - ${e.message}`).join(', ');

  const errorResponse = createErrorResponse({
    message,
    status: 400,
    translate: true,
    translationParams: { url, errors },
  });

  return { error: errorResponse };
};

export const createErrorResponse = ({
  message,
  title = '',
  status = 400,
  translate = false,
  translationParams,
}: ErrorResponseProps): FetchBaseQueryError => ({
  status,
  data: {
    message,
    translate,
    title,
    statusCode: status.toString(),
    translationParams,
  } satisfies BackendError,
});
