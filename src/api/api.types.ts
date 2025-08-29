import { AxiosError } from 'axios';
import type { z } from 'zod';
import { ZodError } from 'zod';

// API options for supporting cancellation (shared across all APIs)
export interface ApiOptions {
  signal?: AbortSignal;
}

// Base API Error interface
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Backend Error format
export interface BackendError {
  message: string;
  translate?: boolean;
  title?: string;
  statusCode: string;
  translationParams?: Record<string, any>;
}

// Error handling options
export interface ErrorHandlingOptions {
  showToast?: boolean;
  logError?: boolean;
  logLevel?: 'error' | 'warn' | 'info';
}

// HTTP Client Contract
export interface HttpClientContract {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

// Request configuration interface
export interface RequestConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal; // Support for AbortController cancellation
  // Zod validation schemas (optional)
  requestSchema?: z.ZodType<any>;
  responseSchema?: z.ZodType<any>;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// Error response props for createErrorResponse
export interface ErrorResponseProps {
  message: string;
  title?: string;
  status?: number;
  translate?: boolean;
  translationParams?: Record<string, any>;
}

// Types for error creation
export type ErrorSource = 'validation' | 'network' | 'server' | 'client' | 'unknown';

export interface ApiErrorContext {
  source: ErrorSource;
  originalError: AxiosError | ZodError | Error | unknown;
  endpoint?: string;
  method?: string;
}

// Base entity interface for common fields
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}

// Base filters interface
export interface BaseFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Pagination interfaces
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Validation error
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}
