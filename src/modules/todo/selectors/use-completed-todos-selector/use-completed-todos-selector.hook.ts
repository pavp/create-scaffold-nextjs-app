import { useMemo } from 'react';

import { todoRepository } from '@/modules/todo/repositories/todo';
import type { DataSource } from '@/types/gateway.types';

/**
 * Selector hook for completed todos
 * Uses repository data and transforms with useMemo
 */
export const useCompletedTodosSelector = (dataSource: DataSource = 'http') => {
  const todosQuery = todoRepository.queries.useTodos({}, dataSource);

  const completedTodos = useMemo(() => {
    if (!todosQuery.data) return [];

    return todosQuery.data.filter((todo) => todo.completed);
  }, [todosQuery.data]);

  return {
    data: completedTodos,
    isLoading: todosQuery.isLoading,
    error: todosQuery.error,
    refetch: todosQuery.refetch,
  };
};
