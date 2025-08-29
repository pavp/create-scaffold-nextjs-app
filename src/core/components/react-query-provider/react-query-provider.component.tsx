'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { config } from '@/config';
import { getQueryClient } from '@/core/lib/react-query/query-client';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {config.isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
