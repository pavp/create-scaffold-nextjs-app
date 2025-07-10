import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const getBackendErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
): string | undefined => {
  if (error) {
    if ('status' in error) {
      if (error.data && typeof error.data === 'object' && 'message' in error.data) {
        return (error.data as any).message;
      }

      const errMsg = 'error' in error ? error.error : (error.data as any)?.error;

      return errMsg || JSON.stringify(error);
    }

    return error.message;
  }

  return undefined;
};
