import type { UseMutationOptions } from '@tanstack/react-query';

// Configuration types for repository patterns
export type QueryOptions = {
  enabled?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: number;
  select?: (data: any) => any;
};

export type MutationOptions = Partial<Omit<UseMutationOptions<any, any, any, any>, 'mutationFn'>>;

// API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// Error response type
export interface ApiError {
  message: string;
  code?: string | number;
  details?: unknown;
}
