import React, { PropsWithChildren, ReactElement } from 'react';
import { render, renderHook } from '@testing-library/react';

import { AllProviders } from '../providers/all-providers';
import { createTestQueryClient } from '../providers/query-client';
import type { ExtendedRenderHookOptions, ExtendedRenderOptions } from '../test-utils.types';
import { applyInitialStoreStates } from '../zustand/store-factories';

// =============================================================================
// RENDER FUNCTIONS
// =============================================================================

/**
 * Render a React component with all necessary providers (QueryClient, Theme, etc.)
 * @param ui - React element to render
 * @param options - Render options including store states and query client config
 * @returns Render result with queryClient exposed
 */
export const renderWithProviders = (
  ui: ReactElement,
  { queryClient, queryClientOptions = {}, initialStoreStates = {}, ...renderOptions }: ExtendedRenderOptions = {},
) => {
  // Create QueryClient if not provided
  const testQueryClient = queryClient || createTestQueryClient(queryClientOptions);

  // Apply initial Zustand store states
  applyInitialStoreStates(initialStoreStates);

  const Wrapper = ({ children }: PropsWithChildren) => (
    <AllProviders queryClient={testQueryClient}>{children}</AllProviders>
  );

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    queryClient: testQueryClient,
    ...result,
  };
};

/**
 * Render a React hook with all necessary providers (QueryClient, Theme, etc.)
 * @param hook - Hook function to render
 * @param options - Render options including store states and query client config
 * @returns Render result with queryClient exposed
 */
export const renderHookWithProviders = <TResult, TProps>(
  hook: (initialProps: TProps) => TResult,
  {
    queryClient,
    queryClientOptions = {},
    initialStoreStates = {},
    ...renderHookOptions
  }: ExtendedRenderHookOptions<TProps> = {},
) => {
  // Create QueryClient if not provided
  const testQueryClient = queryClient || createTestQueryClient(queryClientOptions);

  // Apply initial Zustand store states
  applyInitialStoreStates(initialStoreStates);

  const wrapper = ({ children }: PropsWithChildren) => (
    <AllProviders queryClient={testQueryClient}>{children}</AllProviders>
  );

  const result = renderHook(hook, { wrapper, ...renderHookOptions });

  return {
    queryClient: testQueryClient,
    ...result,
  };
};
