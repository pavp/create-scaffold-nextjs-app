import { QueryClient } from '@tanstack/react-query';

import type { TestQueryClientOptions } from '../test-utils.types';

/**
 * Creates an isolated QueryClient optimized for testing
 */
export const createTestQueryClient = (options: TestQueryClientOptions = {}): QueryClient => {
  const { retry = false, gcTime = 0, staleTime = 0, refetchOnWindowFocus = false } = options;

  return new QueryClient({
    defaultOptions: {
      queries: {
        retry,
        gcTime,
        staleTime,
        refetchOnWindowFocus,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry,
      },
    },
  });
};
