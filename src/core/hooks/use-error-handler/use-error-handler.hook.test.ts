import { act, renderHook } from '@test/utils';

import type { ApiError } from '@/core/lib/react-query/react-query.types';
import { useShowToast } from '@/ui/toast/hooks';

import { useErrorHandler } from './use-error-handler.hook';

// Mock useShowToast hook (already mocked globally in jest.setup.tsx)
const mockShowToast = useShowToast as jest.MockedFunction<typeof useShowToast>;
const mockDisplayToast = jest.fn();

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowToast.mockReturnValue({
      isToastVisible: false,
      showToast: mockDisplayToast,
      closeToast: jest.fn(),
    });
  });

  it('should handle ApiError with message and details', () => {
    const { result } = renderHook(() => useErrorHandler());

    const apiError: ApiError = {
      message: 'API request failed',
      details: { statusCode: 500, endpoint: '/api/test' },
    };

    let handleResult;

    act(() => {
      handleResult = result.current.handleError(apiError);
    });

    expect(handleResult).toEqual({
      message: 'API request failed',
      details: { statusCode: 500, endpoint: '/api/test' },
    });

    expect(mockDisplayToast).toHaveBeenCalledWith({
      snackbarMessage: 'API request failed',
      severity: 'ERROR',
      needTranslation: false,
    });
  });

  it('should handle Error instances', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = new Error('Something went wrong');

    let handleResult;

    act(() => {
      handleResult = result.current.handleError(error);
    });

    expect(handleResult).toEqual({
      message: 'Something went wrong',
      details: undefined,
    });

    expect(mockDisplayToast).toHaveBeenCalledWith({
      snackbarMessage: 'Something went wrong',
      severity: 'ERROR',
      needTranslation: false,
    });
  });

  it('should handle string errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    const errorString = 'Network connection failed';

    let handleResult;

    act(() => {
      handleResult = result.current.handleError(errorString);
    });

    expect(handleResult).toEqual({
      message: 'Network connection failed',
      details: undefined,
    });

    expect(mockDisplayToast).toHaveBeenCalledWith({
      snackbarMessage: 'Network connection failed',
      severity: 'ERROR',
      needTranslation: false,
    });
  });

  it('should handle unknown error types with fallback message', () => {
    const { result } = renderHook(() => useErrorHandler());

    const unknownError = { someProperty: 'value' };

    let handleResult;

    act(() => {
      handleResult = result.current.handleError(unknownError);
    });

    expect(handleResult).toEqual({
      message: 'An unexpected error occurred',
      details: undefined,
    });

    expect(mockDisplayToast).toHaveBeenCalledWith({
      snackbarMessage: 'An unexpected error occurred',
      severity: 'ERROR',
      needTranslation: false,
    });
  });

  it('should not show toast when showToast option is false', () => {
    const { result } = renderHook(() => useErrorHandler({ showToast: false }));

    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(mockDisplayToast).not.toHaveBeenCalled();
  });

  it('should show toast when showToast option is true (default)', () => {
    const { result } = renderHook(() => useErrorHandler({ showToast: true }));

    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(mockDisplayToast).toHaveBeenCalledWith({
      snackbarMessage: 'Test error',
      severity: 'ERROR',
      needTranslation: false,
    });
  });

  it('should work with default options', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = new Error('Default options test');

    let handleResult;

    act(() => {
      handleResult = result.current.handleError(error);
    });

    expect(handleResult).toEqual({
      message: 'Default options test',
      details: undefined,
    });

    expect(mockDisplayToast).toHaveBeenCalled();
  });

  it('should handle null and undefined errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(null);
    });

    expect(mockDisplayToast).toHaveBeenCalledWith({
      snackbarMessage: 'An unexpected error occurred',
      severity: 'ERROR',
      needTranslation: false,
    });

    act(() => {
      result.current.handleError(undefined);
    });

    expect(mockDisplayToast).toHaveBeenCalledWith({
      snackbarMessage: 'An unexpected error occurred',
      severity: 'ERROR',
      needTranslation: false,
    });
  });

  it('should handle multiple error handling calls', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError('First error');
      result.current.handleError('Second error');
    });

    expect(mockDisplayToast).toHaveBeenCalledTimes(2);
    expect(mockDisplayToast).toHaveBeenNthCalledWith(1, {
      snackbarMessage: 'First error',
      severity: 'ERROR',
      needTranslation: false,
    });
    expect(mockDisplayToast).toHaveBeenNthCalledWith(2, {
      snackbarMessage: 'Second error',
      severity: 'ERROR',
      needTranslation: false,
    });
  });
});
