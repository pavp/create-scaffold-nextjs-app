import type { ErrorType, TodoFilters } from '@/modules/todo/todo.types';
import type { DataSource } from '@/types/gateway.types';

// Query Keys Factory for Todo Repository
export const todoQueryKeys = {
  all: ['todos'] as const,
  lists: (dataSource: DataSource = 'http') => [...todoQueryKeys.all, 'list', dataSource] as const,
  list: (filters: TodoFilters = {}, dataSource: DataSource = 'http') =>
    [...todoQueryKeys.lists(dataSource), filters] as const,
  details: (dataSource: DataSource = 'http') => [...todoQueryKeys.all, 'detail', dataSource] as const,
  detail: (id: string | number, dataSource: DataSource = 'http') => [...todoQueryKeys.details(dataSource), id] as const,
  testError: (type: ErrorType, dataSource: DataSource = 'http') =>
    [...todoQueryKeys.all, 'testError', dataSource, type] as const,
} as const;
