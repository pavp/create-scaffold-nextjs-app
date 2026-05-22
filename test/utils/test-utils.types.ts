import { QueryClient } from '@tanstack/react-query';
import { RenderHookOptions, RenderOptions } from '@testing-library/react';

// =============================================================================
// ZUSTAND STORE TYPES
// =============================================================================
// Import actual store types
import type { TodoStoreState } from '@/modules/todo/stores/todo.store.types';
import type { ToastStoreState } from '@/ui/toast/stores/toast.store.types';

// =============================================================================
// REACT QUERY TESTING TYPES
// =============================================================================

export interface TestQueryClientOptions {
  retry?: boolean;
  gcTime?: number;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}

// Initial store states interface
export interface InitialStoreStates {
  todo?: Partial<TodoStoreState>;
  toast?: Partial<ToastStoreState>;
  // Add other Zustand stores as needed
}

// =============================================================================
// RENDER OPTIONS INTERFACES
// =============================================================================

export interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // React Query options
  queryClient?: QueryClient;
  queryClientOptions?: TestQueryClientOptions;

  // Zustand store initial states
  initialStoreStates?: InitialStoreStates;
}

export interface ExtendedRenderHookOptions<TProps> extends Omit<RenderHookOptions<TProps>, 'wrapper'> {
  // React Query options
  queryClient?: QueryClient;
  queryClientOptions?: TestQueryClientOptions;

  // Zustand store initial states
  initialStoreStates?: InitialStoreStates;
}

// =============================================================================
// PROVIDERS TYPES
// =============================================================================

export interface AllProvidersProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

// =============================================================================
// UTILITY FUNCTION TYPES
// =============================================================================

export interface MockStoreFunction {
  <T>(store: any, state: Partial<T>): void;
}
