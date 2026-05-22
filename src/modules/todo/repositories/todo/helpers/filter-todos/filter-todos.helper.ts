import type { TodoFilters } from '@/modules/todo/todo.types';

/**
 * Utility function to filter todos in memory (used by mock and localStorage repositories)
 * @param todos - Array of todos to filter
 * @param filters - Filters to apply
 * @returns Filtered array of todos
 */
export const applyFiltersToTodos = <
  T extends { title: string; description?: string; completed: boolean; priority: string },
>(
  todos: T[],
  filters?: TodoFilters,
): T[] => {
  let result = [...todos];

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();

    result = result.filter(
      (todo) => todo.title.toLowerCase().includes(searchTerm) || todo.description?.toLowerCase().includes(searchTerm),
    );
  }

  if (filters?.completed !== undefined) {
    result = result.filter((todo) => todo.completed === filters.completed);
  }

  if (filters?.priority) {
    result = result.filter((todo) => todo.priority === filters.priority);
  }

  // Sorting
  if (filters?.sortBy) {
    result.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof T] as any;
      const bValue = b[filters.sortBy as keyof T] as any;

      if (filters.sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }

      return aValue > bValue ? 1 : -1;
    });
  }

  return result;
};
