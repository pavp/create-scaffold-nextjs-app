// Import types for store factories
import { act } from '@testing-library/react';

// =============================================================================
// STORE SETUP UTILITIES
// =============================================================================
// Import your actual stores here
import type { AuthState } from '@/modules/auth/stores/auth.store.types';
import { useTodoStore } from '@/modules/todo/stores/todo.store';
import type { TodoState } from '@/modules/todo/stores/todo.store.types';
import { useToastStore } from '@/ui/toast/stores/toast.store';
import type { Toast } from '@/ui/toast/toast.types';

import type { InitialStoreStates } from '../test-utils.types';

// =============================================================================
// STORE STATE FACTORY FUNCTIONS
// =============================================================================

/**
 * Factory function to create Auth store initial state
 * @param overrides - Partial state to override defaults
 * @returns Complete AuthState with defaults + overrides
 */
export const setupAuthStoreState = (overrides: Partial<AuthState> = {}): Partial<AuthState> => ({
  token: '',
  expirationDate: '',
  isAuthenticated: false,
  ...overrides,
});

/**
 * Factory function to create Todo store initial state
 * @param overrides - Partial state to override defaults
 * @returns Complete TodoState with defaults + overrides
 */
export const setupTodoStoreState = (overrides: Partial<TodoState> = {}): Partial<TodoState> => ({
  selectedTodo: null,
  filters: {},
  isCreating: false,
  isEditing: false,
  ...overrides,
});

/**
 * Factory function to create Toast store initial state
 * @param overrides - Partial state to override defaults
 * @returns Complete Toast state with defaults + overrides
 */
export const setupToastStoreState = (overrides: Partial<Toast> = {}): Partial<Toast> => ({
  snackbarOpen: false,
  snackbarMessage: '',
  severity: 'INFO',
  needTranslation: false,
  translationParams: undefined,
  onConfirmation: undefined,
  ...overrides,
});

/**
 * Apply initial state to all specified Zustand stores
 * @param initialStoreStates - Object with initial states for each store
 */
export const applyInitialStoreStates = (initialStoreStates: InitialStoreStates = {}): void => {
  act(() => {
    // Apply Todo store state
    if (initialStoreStates.todo) {
      useTodoStore.setState(initialStoreStates.todo);
    }

    // Apply Toast store state
    if (initialStoreStates.toast) {
      useToastStore.setState(initialStoreStates.toast);
    }
  });
};
