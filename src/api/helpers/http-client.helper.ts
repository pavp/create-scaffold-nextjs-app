import { showValidationErrorToast } from './error.helper';
import { validateData } from './validation.helper';

// Helper to extract data from response - supports both formats:
// 1. Wrapped: { data: T }
// 2. Direct: T
export const extractResponseData = <T>(responseData: any): T => {
  // If response has a 'data' property, extract it; otherwise use the response directly
  return responseData && typeof responseData === 'object' && 'data' in responseData ? responseData.data : responseData;
};

// Helper function to handle validation errors consistently
export const handleValidationError = (validation: any): never => {
  showValidationErrorToast(validation.error);
  throw new Error(`Validation failed: ${validation.error.message}`);
};

// Helper function to validate and handle request data/params
export const validateAndProcessRequest = (schema: any, data: unknown, context: string) => {
  if (!schema) return data;

  const validation = validateData(schema, data, context);

  if (!validation.success) {
    handleValidationError(validation);
  }

  return (validation as { success: true; data: any }).data;
};

// Helper function to validate and handle response data
export const validateAndProcessResponse = <T>(schema: any, data: unknown, context: string): T => {
  const validation = validateData<T>(schema, data, context);

  if (!validation.success) {
    handleValidationError(validation);
  }

  return (validation as { success: true; data: T }).data;
};
