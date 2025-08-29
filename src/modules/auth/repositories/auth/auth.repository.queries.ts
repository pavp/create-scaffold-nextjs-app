import { useQuery } from '@tanstack/react-query';

import { authQueryOptions } from './auth.query-options';
import type { AuthQueriesRepository } from './auth.repository.types';

// Repository Object with React Query hooks for data fetching
export const authQueriesRepository: AuthQueriesRepository = {
  /**
   * Hook to validate current session
   * Uses queryOptions for consistency with React Query
   */
  useValidateSession: (token, options) => {
    return useQuery({
      ...authQueryOptions.validateSession(token),
      ...options,
    });
  },
};
