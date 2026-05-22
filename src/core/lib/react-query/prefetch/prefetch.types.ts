import type { QueryClient } from '@tanstack/react-query';

import type { DataSource } from '@/types/gateway.types';

// Simple prefetch options without strategy complexity
export type PrefetchOptions = {
  dataSource?: DataSource;
  staleTime?: number;
};

// Factory interface for prefetch functions
export interface PrefetchFactory<TData = unknown> {
  queryKey: any[];
  queryFn: () => Promise<TData>;
}

// Base interface that repositories can extend for prefetch and cancellation
export interface BaseRepository {
  prefetch?: Record<string, (queryClient: QueryClient, ...args: any[]) => Promise<void>>;
  cancel?: Record<string, (...args: any[]) => Promise<void>>;
}
