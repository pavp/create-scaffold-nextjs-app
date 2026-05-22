import { queryOptions, useQuery } from '@tanstack/react-query';

import { createPrefetchFunction } from './prefetch.helpers';

export const createPrefetchableQuery = <TParams extends any[]>(
  optionsFactory: (...params: TParams) => ReturnType<typeof queryOptions>,
) => {
  return {
    // Hook that uses queryOptions directly
    useQuery: (...params: TParams) => {
      return useQuery(optionsFactory(...params));
    },

    // Prefetch that reuses the same queryOptions
    prefetch: createPrefetchFunction((...params: TParams) => {
      const options = optionsFactory(...params);

      return {
        queryKey: [...options.queryKey],
        queryFn: options.queryFn as () => Promise<unknown>,
      };
    }),

    // Bonus: function to get queryOptions directly
    getQueryOptions: optionsFactory,
  };
};
