import type { QueryClient } from '@tanstack/react-query';

import type { PrefetchFactory, PrefetchOptions } from './prefetch.types';

/**
 * Base helper to create reusable prefetch functions
 * Any repository can use this within their definitions
 */
export const createPrefetchFunction = <TData = unknown>(getFactory: (...args: any[]) => PrefetchFactory<TData>) => {
  return async (queryClient: QueryClient, ...args: any[]): Promise<void> => {
    const lastArg = args[args.length - 1];
    const hasOptions = lastArg && typeof lastArg === 'object' && ('staleTime' in lastArg || 'dataSource' in lastArg);

    const options = hasOptions ? (lastArg as PrefetchOptions) : {};
    const factoryArgs = hasOptions ? args.slice(0, -1) : args;

    const staleTime = options.staleTime || 5 * 60 * 1000; // 5 min default

    const { queryKey, queryFn } = getFactory(...factoryArgs);

    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime,
    });
  };
};
