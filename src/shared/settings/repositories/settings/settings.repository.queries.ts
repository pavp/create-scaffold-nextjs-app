import { useQuery } from '@tanstack/react-query';

import { createPrefetchFunction, getQueryClient } from '@/core/lib/react-query';

import { createSettingsGateway } from './gateways';
import { settingsQueryOptions } from './settings.query-options';
import { settingsQueryKeys } from './settings.repository.keys';
import type { SettingsQueriesRepository } from './settings.repository.types';

// Repository Object with React Query hooks for data fetching
export const settingsQueriesRepository: SettingsQueriesRepository = {
  /**
   * Hook to fetch settings
   * Uses queryOptions for consistency with prefetch
   */
  useSettings: (dataSource = 'http', options) => {
    const baseOptions = settingsQueryOptions.settings(dataSource);

    return useQuery({
      ...baseOptions,
      ...options,
    });
  },

  // Prefetch methods
  prefetch: {
    prefetchSettings: createPrefetchFunction((dataSource = 'http') => ({
      queryKey: [...settingsQueryKeys.detail(dataSource)],
      queryFn: () => createSettingsGateway(dataSource).getSettings(),
    })),
  },

  // Cancellation methods
  cancel: {
    cancelSettings: async (dataSource) => {
      await getQueryClient().cancelQueries({ queryKey: settingsQueryKeys.detail(dataSource) });
    },
    cancelAll: async () => {
      await getQueryClient().cancelQueries({ queryKey: settingsQueryKeys.all });
    },
  },
};
