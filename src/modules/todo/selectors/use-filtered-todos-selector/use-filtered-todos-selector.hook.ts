import { useMemo } from 'react';

import { todoRepository } from '@/modules/todo/repositories/todo';
import type { DataSource } from '@/types/gateway.types';

/**
 * Selector hook for searching todos by term
 * Uses repository data and filters with useMemo
 */
export const useFilteredTodosSelector = (searchTerm: string, dataSource: DataSource = 'http') => {
  const todosQuery = todoRepository.queries.useTodos({}, dataSource);

  const filteredTodos = useMemo(() => {
    if (!todosQuery.data || !searchTerm.trim()) return todosQuery.data || [];

    const term = searchTerm.toLowerCase();

    return todosQuery.data.filter(
      (todo) => todo.title.toLowerCase().includes(term) || todo.description?.toLowerCase().includes(term),
    );
  }, [todosQuery.data, searchTerm]);

  return {
    data: filteredTodos,
    isLoading: todosQuery.isLoading,
    error: todosQuery.error,
    refetch: todosQuery.refetch,
    hasSearchTerm: searchTerm.trim().length > 0,
  };
};
