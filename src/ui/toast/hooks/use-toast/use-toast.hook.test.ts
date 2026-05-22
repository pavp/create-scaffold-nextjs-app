import { act, renderHook } from '@testing-library/react';

import { delayCallback } from '@/core/helpers';

import { TOAST_RESET_STATE_DURATION, TOAST_SUCCESS_DURATION } from '../../constants';
import {
  useToastConfirmationSelector,
  useToastMessageSelector,
  useToastSeveritySelector,
  useToastVisibilitySelector,
} from '../../stores/selectors';
import { useToastActions } from '../../stores/toast.store.actions';

import { useToast } from './use-toast.hook';

// Mock dependencies
jest.mock('@/core/helpers');
jest.mock('next-intl');
jest.mock('../../stores/selectors');
jest.mock('../../stores/toast.store.actions');

const mockDelayCallback = delayCallback as jest.MockedFunction<typeof delayCallback>;
const mockUseToastVisibilitySelector = useToastVisibilitySelector as jest.MockedFunction<
  typeof useToastVisibilitySelector
>;
const mockUseToastSeveritySelector = useToastSeveritySelector as jest.MockedFunction<typeof useToastSeveritySelector>;
const mockUseToastConfirmationSelector = useToastConfirmationSelector as jest.MockedFunction<
  typeof useToastConfirmationSelector
>;
const mockUseToastMessageSelector = useToastMessageSelector as jest.MockedFunction<typeof useToastMessageSelector>;
const mockUseToastActions = useToastActions as jest.MockedFunction<typeof useToastActions>;

describe('useToast', () => {
  // Mock functions with proper types
  const mockCloseToast = jest.fn();
  const mockResetToastState = jest.fn();
  const mockOnConfirmation = jest.fn();
  const mockUseTranslations = jest.fn((key: string, _params?: any) => key);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Mock next-intl useTranslations
    jest.mocked(jest.requireMock('next-intl').useTranslations).mockReturnValue(mockUseTranslations);

    // Default mock implementations
    mockUseToastVisibilitySelector.mockReturnValue({
      snackbarOpen: false,
    });

    mockUseToastSeveritySelector.mockReturnValue({
      severity: 'INFO',
    });

    mockUseToastConfirmationSelector.mockReturnValue({
      onConfirmation: mockOnConfirmation,
    });

    mockUseToastMessageSelector.mockReturnValue({
      snackbarMessage: 'Test message',
      needTranslation: false,
      translationParams: undefined,
    });

    mockUseToastActions.mockReturnValue({
      showToast: jest.fn(),
      closeToast: mockCloseToast,
      resetToastState: mockResetToastState,
      clearToast: jest.fn(),
    });

    mockDelayCallback.mockImplementation(async (delay: number, callback: () => void) => {
      setTimeout(callback, delay);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('should return correct initial values', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.snackbarOpen).toBe(false);
      expect(result.current.severity).toBe('INFO');
      expect(result.current.message).toBe('Test message');
      expect(result.current.onConfirmation).toBe(mockOnConfirmation);
      expect(typeof result.current.handleClose).toBe('function');
    });
  });

  describe('Message Translation', () => {
    it('should return message as-is when needTranslation is false', () => {
      mockUseToastMessageSelector.mockReturnValue({
        snackbarMessage: 'Direct message',
        needTranslation: false,
        translationParams: undefined,
      });

      const { result } = renderHook(() => useToast());

      expect(result.current.message).toBe('Direct message');
      expect(mockUseTranslations).not.toHaveBeenCalled();
    });

    it('should translate message when needTranslation is true', () => {
      mockUseToastMessageSelector.mockReturnValue({
        snackbarMessage: 'message.key',
        needTranslation: true,
        translationParams: { name: 'John' },
      });

      const { result } = renderHook(() => useToast());

      expect(result.current.message).toBe('message.key');
      expect(mockUseTranslations).toHaveBeenCalledWith('message.key', { name: 'John' });
    });

    it('should handle translation with no parameters', () => {
      mockUseToastMessageSelector.mockReturnValue({
        snackbarMessage: 'simple.key',
        needTranslation: true,
        translationParams: undefined,
      });

      const { result } = renderHook(() => useToast());

      expect(result.current.message).toBe('simple.key');
      expect(mockUseTranslations).toHaveBeenCalledWith('simple.key', {});
    });
  });

  describe('Handle Close', () => {
    it('should call closeToast and resetToastState with delay when handleClose is called', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.handleClose();
      });

      expect(mockCloseToast).toHaveBeenCalled();
      expect(mockDelayCallback).toHaveBeenCalledWith(TOAST_RESET_STATE_DURATION, expect.any(Function));
    });
  });

  describe('Auto Close for Success Toast', () => {
    it('should auto close SUCCESS toast after timeout', () => {
      mockUseToastVisibilitySelector.mockReturnValue({
        snackbarOpen: true,
      });

      mockUseToastSeveritySelector.mockReturnValue({
        severity: 'SUCCESS',
      });

      const { result } = renderHook(() => useToast());

      expect(result.current.snackbarOpen).toBe(true);
      expect(result.current.severity).toBe('SUCCESS');

      // Fast-forward time to trigger the timeout
      act(() => {
        jest.advanceTimersByTime(TOAST_SUCCESS_DURATION);
      });

      expect(mockCloseToast).toHaveBeenCalled();
    });

    it('should not auto close non-SUCCESS toast', () => {
      mockUseToastVisibilitySelector.mockReturnValue({
        snackbarOpen: true,
      });

      mockUseToastSeveritySelector.mockReturnValue({
        severity: 'ERROR',
      });

      renderHook(() => useToast());

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(TOAST_SUCCESS_DURATION);
      });

      expect(mockCloseToast).not.toHaveBeenCalled();
    });

    it('should not auto close when snackbarOpen is false', () => {
      mockUseToastVisibilitySelector.mockReturnValue({
        snackbarOpen: false,
      });

      mockUseToastSeveritySelector.mockReturnValue({
        severity: 'SUCCESS',
      });

      renderHook(() => useToast());

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(TOAST_SUCCESS_DURATION);
      });

      expect(mockCloseToast).not.toHaveBeenCalled();
    });
  });

  describe('State Changes', () => {
    it('should reflect changes from selectors', () => {
      const { result, rerender } = renderHook(() => useToast());

      expect(result.current.snackbarOpen).toBe(false);
      expect(result.current.severity).toBe('INFO');

      // Change mock return values
      mockUseToastVisibilitySelector.mockReturnValue({
        snackbarOpen: true,
      });

      mockUseToastSeveritySelector.mockReturnValue({
        severity: 'ERROR',
      });

      mockUseToastMessageSelector.mockReturnValue({
        snackbarMessage: 'Error occurred',
        needTranslation: false,
        translationParams: undefined,
      });

      rerender();

      expect(result.current.snackbarOpen).toBe(true);
      expect(result.current.severity).toBe('ERROR');
      expect(result.current.message).toBe('Error occurred');
    });
  });

  describe('Handler Stability', () => {
    it('should maintain handleClose reference stability', () => {
      const { result, rerender } = renderHook(() => useToast());

      const initialHandleClose = result.current.handleClose;

      rerender();

      expect(result.current.handleClose).toBe(initialHandleClose);
    });
  });
});
