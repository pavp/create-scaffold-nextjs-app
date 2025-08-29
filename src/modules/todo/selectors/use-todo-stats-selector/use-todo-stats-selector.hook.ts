import { useMemo } from 'react';

import { todoRepository } from '@/modules/todo/repositories/todo';
import type { DataSource } from '@/types/gateway.types';

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  completionRate: number;
}

/**
 * Selector hook for todo statistics
 * Uses repository data and computes stats with useMemo
 */
export const useTodoStatsSelector = (dataSource: DataSource = 'http') => {
  const todosQuery = todoRepository.queries.useTodos({}, dataSource);

  const stats = useMemo((): TodoStats => {
    if (!todosQuery.data || todosQuery.data.length === 0) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        completionRate: 0,
      };
    }

    const todos = todosQuery.data;
    const completed = todos.filter((t) => t.completed).length;

    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
      highPriority: todos.filter((t) => t.priority === 'high').length,
      mediumPriority: todos.filter((t) => t.priority === 'medium').length,
      lowPriority: todos.filter((t) => t.priority === 'low').length,
      completionRate: Math.round((completed / todos.length) * 100),
    };
  }, [todosQuery.data]);

  return {
    data: stats,
    isLoading: todosQuery.isLoading,
    error: todosQuery.error,
    refetch: todosQuery.refetch,
  };
};
