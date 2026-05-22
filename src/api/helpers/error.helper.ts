import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { redirectTo401 } from '@/actions';
import { showToast } from '@/ui/toast/stores/toast.store.actions';

import type {
  ApiError,
  ApiErrorContext,
  BackendError,
  ErrorHandlingOptions,
  ErrorResponseProps,
  ErrorSource,
} from '../api.types';

// Helper to show validation error toast using BackendError structure
export const showValidationErrorToast = (backendError: BackendError) => {
  showToast({
    snackbarMessage: backendError.message || 'Validation error',
    severity: 'ERROR',
    needTranslation: backendError.translate || false,
    translationParams: backendError.translationParams,
  });
};

// Handler for 401 unauthorized errors (automatic from interceptor)
export const handleUnauthorizedError = (_error: ApiError) => {
  // TODO: implement removeCurrentSession(role) cuando esté disponible
  showToast({
    severity: 'ERROR',
    snackbarMessage: 'common.notAuthenticatedMessage',
    needTranslation: true,
    onConfirmation: () => {
      redirectTo401();
    },
  });
};

// Handler for other errors (automatic from interceptor)
export const handleOtherErrors = (error: ApiError, originalError: AxiosError) => {
  // Si es un BackendError estructurado del servidor
  if (originalError.response?.data && typeof originalError.response.data === 'object') {
    const backendError = originalError.response.data as BackendError;

    showToast({
      severity: 'ERROR',
      snackbarMessage: backendError.message || 'common.unknownError',
      needTranslation: !backendError.message || backendError.translate,
      translationParams: backendError.translationParams,
    });
  } else {
    // Generic error
    showToast({
      snackbarMessage: error.message,
      severity: 'ERROR',
      needTranslation: false,
    });
  }
};

// Manual error handler (for use in components/hooks)
export const handleApiError = (error: ApiError, options: ErrorHandlingOptions = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { showToast: shouldShowToast = true, logError = true, logLevel = 'error' } = options;

  if (logError) {
    // Log the error to console or a logging service
  }

  if (shouldShowToast) {
    showToast({
      snackbarMessage: error.message,
      severity: 'ERROR',
      needTranslation: false,
    });
  }
};

// Validation error handler (for Zod errors)
export const handleValidationError = (error: ZodError, context: string, options: ErrorHandlingOptions = {}) => {
  const errors = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
  const apiError: ApiError = {
    message: `Validation failed in ${context}: ${errors}`,
    code: 'VALIDATION_ERROR',
    details: error.issues,
  };

  handleApiError(apiError, options);
};

// Create ApiError from different sources
export const createApiError = (error: AxiosError, context?: Partial<ApiErrorContext>): ApiError => {
  let message = error.message || 'An unexpected error occurred';
  let source: ErrorSource = 'unknown';

  // Determine error source and improve message
  if (error.response) {
    source = 'server';
    const status = error.response.status;

    // If it's a BackendError from the server, use its message
    if (error.response.data && typeof error.response.data === 'object') {
      const backendError = error.response.data as BackendError;

      if (backendError.message) {
        message = backendError.message;
      }
    } else {
      // Mejorar mensajes genéricos según status code
      if (status === 403) {
        message = 'Access forbidden.';
      } else if (status === 404) {
        message = 'Resource not found.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }
    }
  } else if (error.request) {
    source = 'network';
    message = 'Network connection failed. Please check your internet connection.';
  } else {
    source = 'client';
  }

  return {
    message,
    code: error.code || error.response?.status?.toString(),
    details: {
      source,
      originalError: error,
      response: error.response?.data,
      status: error.response?.status,
      endpoint: context?.endpoint,
      method: context?.method,
    },
  };
};

// Create error response (for API endpoints)
export const createErrorResponse = ({
  message,
  title = '',
  status = 400,
  translate = false,
  translationParams,
}: ErrorResponseProps): BackendError => ({
  message,
  translate,
  title,
  statusCode: status.toString(),
  translationParams,
});

// Handle Zod validation errors (for API endpoints)
export const handleZodError = (
  error: ZodError,
  context: { url?: string; args?: unknown },
  message: string,
): { error: BackendError } => {
  const url = typeof context.args === 'string' ? context.args : context.url || 'unknown';
  const errors = error.issues.map((e) => `${e.path.join('.')} - ${e.message}`).join(', ');

  const errorResponse = createErrorResponse({
    message,
    status: 400,
    translate: true,
    translationParams: { url, errors },
  });

  return { error: errorResponse };
};
