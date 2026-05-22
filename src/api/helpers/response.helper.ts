import type { ApiResponse } from '../api.types';

// Helper function to wrap API responses
export const createApiResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  success: true,
});
