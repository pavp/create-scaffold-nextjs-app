// =============================================================================
// MAIN TEST UTILS ENTRY POINT
// =============================================================================

// Re-export everything from React Testing Library for convenience
export * from '@testing-library/react';

// Render functions (most commonly used)
export * from './render/render-functions';

// Zustand utilities
export * from './zustand/store-factories';
export * from './zustand/zustand-utils';

// React Query utilities
export * from './render/query-utils';

// Provider utilities (less commonly needed directly)
export * from './providers/all-providers';
export * from './providers/query-client';

// Type exports for convenience
export type {
  AllProvidersProps,
  ExtendedRenderHookOptions,
  ExtendedRenderOptions,
  InitialStoreStates,
  MockStoreFunction,
  TestQueryClientOptions,
} from './test-utils.types';
