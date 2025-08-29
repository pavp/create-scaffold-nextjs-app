import type { TodoFilters } from '@/modules/todo/todo.types';

/**
 * Utility function to build query parameters from todo filters
 * @param filters - Todo filters object
 * @returns Query parameters object ready for HTTP requests
 */
export const buildQueryParams = (filters?: TodoFilters): Record<string, any> => {
  if (!filters) return {};

  const params: Record<string, any> = {};

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.completed !== undefined) {
    params.completed = filters.completed;
  }

  if (filters.priority) {
    params.priority = filters.priority;
  }

  if (filters.dueBefore) {
    params.dueBefore = filters.dueBefore;
  }

  if (filters.dueAfter) {
    params.dueAfter = filters.dueAfter;
  }

  if (filters.sortBy) {
    params.sortBy = filters.sortBy;
  }

  if (filters.sortOrder) {
    params.sortOrder = filters.sortOrder;
  }

  return params;
};
