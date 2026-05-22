import { useCallback } from 'react';

import type { ApiError } from '@/core/lib/react-query/react-query.types';
import { useShowToast } from '@/ui/toast/hooks';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { showToast = true, logError = true } = options;
  const { showToast: displayToast } = useShowToast();

  const handleError = useCallback(
    (error: ApiError | Error | unknown) => {
      let message: string;
      let details: unknown;

      // Extract error message and details
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;

        message = apiError.message;
        details = apiError.details;
      } else if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = 'An unexpected error occurred';
      }

      // Log error if enabled
      if (logError) {
        //TODO: implement logging logic here
      }

      // Show error toast
      if (showToast) {
        displayToast({
          snackbarMessage: message,
          severity: 'ERROR',
          needTranslation: false,
        });
      }

      return { message, details };
    },
    [showToast, logError, displayToast],
  );

  return { handleError };
};
