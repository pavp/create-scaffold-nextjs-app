import { ZodError } from 'zod';

import type { BackendError } from '../api.types';

import { createErrorResponse, handleZodError } from './error.helper';

export interface ValidationResult<T> {
  success: true;
  data: T;
}

export interface ValidationError {
  success: false;
  error: BackendError;
  zodError?: ZodError;
}

export const validateData = <T>(schema: any, data: unknown, context: string): ValidationResult<T> | ValidationError => {
  if (!schema) return { success: true, data: data as T };

  try {
    const validatedData = schema.parse(data);

    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      // Determine if this is request/argument validation or response validation
      const isRequestValidation = context.includes('request') || context.includes('params');
      const translationKey = isRequestValidation
        ? 'common.api.invalidArgumentsWithParams'
        : 'common.api.invalidExpectedDataWithParams';

      const zodErrorResult = handleZodError(error, { url: context }, translationKey);

      return { success: false, error: zodErrorResult.error, zodError: error };
    }

    // eslint-disable-next-line no-console
    console.error(`Validation failed for ${context}:`, error);

    const errorResponse = createErrorResponse({
      message: `Validation failed for ${context}`,
      status: 400,
      translate: false,
    });

    return { success: false, error: errorResponse };
  }
};
