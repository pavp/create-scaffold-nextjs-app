import { useTodoStore } from '@/modules/todo/stores/todo.store';

/**
 * Selector for todo filters with computed properties
 * Optimized for components that only need filter-related data
 */
export const useFiltersSelector = () => {
  const filters = useTodoStore((state) => state.filters);

  return { filters };
};
