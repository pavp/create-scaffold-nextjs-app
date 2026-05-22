import { act } from '@testing-library/react';

import type { MockStoreFunction } from '../test-utils.types';

// =============================================================================
// ZUSTAND TESTING SETUP
// =============================================================================

// Store reset functions registry for Zustand stores
export const storeResetFns = new Set<() => void>();

/**
 * Reset all Zustand stores to their initial state
 */
export const resetZustandStores = (): void => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
};

/**
 * Global setup function that should be called in your test setup file
 * This will automatically reset all Zustand stores after each test
 */
export const setupZustandTesting = (): void => {
  afterEach(() => {
    resetZustandStores();
  });
};

/**
 * Mock/set state for a specific Zustand store
 * @param store - The Zustand store to modify
 * @param state - The partial state to set
 */
export const mockZustandStore: MockStoreFunction = <T extends unknown>(store: any, state: Partial<T>): void => {
  act(() => {
    store.setState(state);
  });
};
