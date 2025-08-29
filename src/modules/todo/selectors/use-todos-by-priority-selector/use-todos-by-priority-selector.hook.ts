import { useMemo } from 'react';

import { todoRepository } from '@/modules/todo/repositories/todo';
import type { TodoPriority } from '@/modules/todo/todo.types';
import type { DataSource } from '@/types/gateway.types';

/**
 * Selector hook for todos filtered by priority
 * Uses repository data and transforms with useMemo
 */
export const useTodosByPrioritySelector = (priority: TodoPriority, dataSource: DataSource = 'http') => {
  const todosQuery = todoRepository.queries.useTodos({}, dataSource);

  const todosByPriority = useMemo(() => {
    if (!todosQuery.data) return [];

    return todosQuery.data.filter((todo) => todo.priority === priority);
  }, [todosQuery.data, priority]);

  return {
    data: todosByPriority,
    isLoading: todosQuery.isLoading,
    error: todosQuery.error,
    refetch: todosQuery.refetch,
  };
};
