import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { DataSource } from '@/types/gateway.types';

import { todoRepository } from '../../repositories/todo';
import { useTodoActions } from '../../stores/todo.store.actions';

/**
 * Hook for managing data source switching
 * Allows runtime switching between HTTP and localStorage
 */
export const useDataSource = (initialSource: DataSource = 'http') => {
  const queryClient = useQueryClient();
  const [dataSource, setDataSource] = useState<DataSource>(initialSource);

  const { clearFilters } = useTodoActions();

  const switchDataSource = useCallback(
    (newDataSource: DataSource) => {
      if (newDataSource !== dataSource) {
        setDataSource(newDataSource);
        clearFilters();
        // Invalidate all todos queries to refetch with new source
        queryClient.invalidateQueries({ queryKey: [todoRepository.queryKeys.lists(newDataSource)] });
      }
    },
    [dataSource, queryClient, clearFilters],
  );

  const getDataSourceInfo = useCallback(() => {
    switch (dataSource) {
      case 'http':
        return {
          type: 'http' as const,
          name: 'HTTP API Gateway',
          description: 'Remote server data',
          icon: '🌐',
          online: true,
          capabilities: {
            offline: false,
            realtime: true,
            persistence: true,
          },
        };
      case 'localStorage':
        return {
          type: 'localStorage' as const,
          name: 'Local Storage Gateway',
          description: 'Browser local storage',
          icon: '💾',
          online: false,
          capabilities: {
            offline: true,
            realtime: false,
            persistence: true,
          },
        };
      default:
        return {
          type: 'unknown' as const,
          name: 'Unknown',
          description: 'Unknown data source',
          icon: '❓',
          online: false,
          capabilities: {
            offline: false,
            realtime: false,
            persistence: false,
          },
        };
    }
  }, [dataSource]);

  return {
    dataSource,
    switchDataSource,
    getDataSourceInfo,
  };
};
