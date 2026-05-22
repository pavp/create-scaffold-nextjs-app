import { type QueryClient, type UseQueryResult } from '@tanstack/react-query';

import type { BaseRepository, PrefetchOptions } from '@/core/lib/react-query';
import { QueryOptions } from '@/core/lib/react-query';
import type { SettingsResponse } from '@/shared/settings/settings.types';
import type { DataSource } from '@/types/gateway.types';

// Repository Object Interface for Queries
export interface SettingsQueriesRepository extends BaseRepository {
  useSettings: (dataSource?: DataSource, options?: QueryOptions) => UseQueryResult<SettingsResponse, Error>;

  // Prefetch methods
  prefetch: {
    prefetchSettings: (queryClient: QueryClient, dataSource?: DataSource, options?: PrefetchOptions) => Promise<void>;
  };

  // Cancellation methods
  cancel: {
    cancelSettings: (dataSource?: DataSource) => Promise<void>;
    cancelAll: () => Promise<void>;
  };
}

// Combined repository object interface
export interface SettingsRepository {
  queries: SettingsQueriesRepository;
  queryKeys: typeof import('./settings.repository.keys').settingsQueryKeys;
  queryOptions: typeof import('./settings.query-options').settingsQueryOptions;
}
