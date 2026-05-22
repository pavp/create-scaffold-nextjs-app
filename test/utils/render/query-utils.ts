import { QueryClient } from '@tanstack/react-query';

// =============================================================================
// REACT QUERY UTILITIES
// =============================================================================

/**
 * Setup mock query data in the QueryClient cache
 * @param queryClient - The QueryClient instance
 * @param queryKey - The query key array
 * @param data - The mock data to set
 */
export const setupMockQueryData = (queryClient: QueryClient, queryKey: unknown[], data: unknown): void => {
  queryClient.setQueryData(queryKey, data);
};

/**
 * Clear all queries from the QueryClient cache
 * @param queryClient - The QueryClient instance
 */
export const clearAllQueries = (queryClient: QueryClient): void => {
  queryClient.clear();
};

/**
 * Wait for all queries in the cache to settle (resolve or reject)
 * @param queryClient - The QueryClient instance
 */
export const waitForQueriesToSettle = async (queryClient: QueryClient): Promise<void> => {
  await Promise.all(
    queryClient
      .getQueryCache()
      .findAll()
      .map((query) => {
        if (query.state.status === 'pending') {
          query.setState({ ...query.state, status: 'success' });
        }
      }),
  );
};
