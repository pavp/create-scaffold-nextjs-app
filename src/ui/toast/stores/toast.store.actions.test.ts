import { act, renderHook } from '@testing-library/react';

import { useToastStore } from './toast.store';
import { clearToast, closeToast, resetToastState, showToast, useToastActions } from './toast.store.actions';

describe('Toast Store Actions', () => {
  beforeEach(() => {
    // Reset store before each test
    clearToast();
  });

  describe('Non-hook actions', () => {
    it('should show toast with all parameters', () => {
      const mockOnConfirmation = jest.fn();
      const toastParams = {
        snackbarMessage: 'Test message',
        severity: 'SUCCESS' as const,
        needTranslation: true,
        translationParams: { key: 'value' },
        onConfirmation: mockOnConfirmation,
      };

      act(() => {
        showToast(toastParams);
      });

      const state = useToastStore.getState();

      expect(state.snackbarOpen).toBe(true);
      expect(state.snackbarMessage).toBe('Test message');
      expect(state.severity).toBe('SUCCESS');
      expect(state.needTranslation).toBe(true);
      expect(state.translationParams).toEqual({ key: 'value' });
      expect(state.onConfirmation).toBe(mockOnConfirmation);
    });

    it('should show toast with minimal parameters', () => {
      const toastParams = {
        snackbarMessage: 'Simple message',
        severity: 'ERROR' as const,
      };

      act(() => {
        showToast(toastParams);
      });

      const state = useToastStore.getState();

      expect(state.snackbarOpen).toBe(true);
      expect(state.snackbarMessage).toBe('Simple message');
      expect(state.severity).toBe('ERROR');
      expect(state.needTranslation).toBe(false);
      expect(state.translationParams).toBeUndefined();
      expect(state.onConfirmation).toBeUndefined();
    });

    it('should close toast', () => {
      // First show a toast
      act(() => {
        showToast({
          snackbarMessage: 'Test message',
          severity: 'INFO',
        });
      });

      // Verify it's open
      expect(useToastStore.getState().snackbarOpen).toBe(true);

      // Close it
      act(() => {
        closeToast();
      });

      const state = useToastStore.getState();

      expect(state.snackbarOpen).toBe(false);
      // Other properties should remain unchanged
      expect(state.snackbarMessage).toBe('Test message');
      expect(state.severity).toBe('INFO');
    });

    it('should reset toast state while preserving open status', () => {
      // First show a toast
      act(() => {
        showToast({
          snackbarMessage: 'Test message',
          severity: 'WARNING',
          needTranslation: true,
          translationParams: { test: 'value' },
          onConfirmation: jest.fn(),
        });
      });

      // Reset state
      act(() => {
        resetToastState();
      });

      const state = useToastStore.getState();

      // snackbarOpen should be preserved
      expect(state.snackbarOpen).toBe(true);
      // Other properties should be reset to initial values
      expect(state.snackbarMessage).toBe('');
      expect(state.severity).toBe('INFO');
      expect(state.needTranslation).toBe(false);
      expect(state.translationParams).toBeUndefined();
      expect(state.onConfirmation).toBeUndefined();
    });

    it('should clear toast completely', () => {
      // First show a toast
      act(() => {
        showToast({
          snackbarMessage: 'Test message',
          severity: 'SUCCESS',
          needTranslation: true,
          translationParams: { test: 'value' },
          onConfirmation: jest.fn(),
        });
      });

      // Clear everything
      act(() => {
        clearToast();
      });

      const state = useToastStore.getState();

      // All properties should be reset to initial values
      expect(state.snackbarOpen).toBe(false);
      expect(state.snackbarMessage).toBe('');
      expect(state.severity).toBe('INFO');
      expect(state.needTranslation).toBe(false);
      expect(state.translationParams).toBeUndefined();
      expect(state.onConfirmation).toBeUndefined();
    });
  });

  describe('useToastActions hook', () => {
    it('should return all actions', () => {
      const { result } = renderHook(() => useToastActions());

      expect(result.current).toHaveProperty('showToast');
      expect(result.current).toHaveProperty('closeToast');
      expect(result.current).toHaveProperty('resetToastState');
      expect(result.current).toHaveProperty('clearToast');
      expect(typeof result.current.showToast).toBe('function');
      expect(typeof result.current.closeToast).toBe('function');
      expect(typeof result.current.resetToastState).toBe('function');
      expect(typeof result.current.clearToast).toBe('function');
    });

    it('should work with hook-based actions', () => {
      const { result } = renderHook(() => useToastActions());

      act(() => {
        result.current.showToast({
          snackbarMessage: 'Hook message',
          severity: 'SUCCESS',
        });
      });

      const state = useToastStore.getState();

      expect(state.snackbarOpen).toBe(true);
      expect(state.snackbarMessage).toBe('Hook message');
      expect(state.severity).toBe('SUCCESS');

      act(() => {
        result.current.closeToast();
      });

      expect(useToastStore.getState().snackbarOpen).toBe(false);
    });

    it('should handle all severity types', () => {
      const severityTypes = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'] as const;

      severityTypes.forEach((severity) => {
        act(() => {
          showToast({
            snackbarMessage: `Test ${severity}`,
            severity,
          });
        });

        const state = useToastStore.getState();

        expect(state.severity).toBe(severity);
        expect(state.snackbarMessage).toBe(`Test ${severity}`);

        // Clear for next iteration
        act(() => {
          clearToast();
        });
      });
    });

    it('should handle translation parameters correctly', () => {
      const translationParams = {
        count: 5,
        name: 'John',
        items: ['a', 'b', 'c'],
      };

      act(() => {
        showToast({
          snackbarMessage: 'translation.key',
          severity: 'INFO',
          needTranslation: true,
          translationParams,
        });
      });

      const state = useToastStore.getState();

      expect(state.needTranslation).toBe(true);
      expect(state.translationParams).toEqual(translationParams);
    });

    it('should handle confirmation callback', () => {
      const mockConfirmation = jest.fn();

      act(() => {
        showToast({
          snackbarMessage: 'Confirm action?',
          severity: 'WARNING',
          onConfirmation: mockConfirmation,
        });
      });

      const state = useToastStore.getState();

      expect(state.onConfirmation).toBe(mockConfirmation);

      // Test that the function can be called
      if (state.onConfirmation) {
        state.onConfirmation();
        expect(mockConfirmation).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Store state management', () => {
    it('should maintain state across multiple show/close cycles', () => {
      // Show first toast
      act(() => {
        showToast({
          snackbarMessage: 'First message',
          severity: 'INFO',
        });
      });

      expect(useToastStore.getState().snackbarOpen).toBe(true);

      // Close and show another
      act(() => {
        closeToast();
      });

      expect(useToastStore.getState().snackbarOpen).toBe(false);

      act(() => {
        showToast({
          snackbarMessage: 'Second message',
          severity: 'ERROR',
        });
      });

      const state = useToastStore.getState();

      expect(state.snackbarOpen).toBe(true);
      expect(state.snackbarMessage).toBe('Second message');
      expect(state.severity).toBe('ERROR');
    });

    it('should preserve open state during reset', () => {
      act(() => {
        showToast({
          snackbarMessage: 'Initial message',
          severity: 'SUCCESS',
          needTranslation: true,
        });
      });

      // Close the toast
      act(() => {
        closeToast();
      });

      expect(useToastStore.getState().snackbarOpen).toBe(false);

      // Reset state
      act(() => {
        resetToastState();
      });

      const state = useToastStore.getState();

      expect(state.snackbarOpen).toBe(false); // Should preserve the closed state
      expect(state.snackbarMessage).toBe('');
      expect(state.severity).toBe('INFO');
      expect(state.needTranslation).toBe(false);
    });
  });
});
