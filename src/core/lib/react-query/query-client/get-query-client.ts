import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a new QueryClient instance with consistent configuration
 * for both server and client environments
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Key: staleTime > 0 to prevent immediate refetch on hydration
        staleTime: 60 * 1000, // 1 minute
        retry: 3,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Unified QueryClient following React Query v5 Advanced SSR official pattern
 * - Server: Always creates a new QueryClient
 * - Browser: Creates singleton QueryClient (reuses existing one)
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This MUST be created only once and reused
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
}
