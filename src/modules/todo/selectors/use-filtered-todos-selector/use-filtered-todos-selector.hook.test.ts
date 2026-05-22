/**
 * @jest-environment jsdom
 */

import { createMockTodo } from '@test/entities/todo.mock';
import { renderHookWithProviders, setupMockQueryData, waitFor } from '@test/utils';

import { todoQueryKeys } from '@/modules/todo/repositories/todo/todo.repository.keys';

import { useFilteredTodosSelector } from './use-filtered-todos-selector.hook';

// Create test todos with specific data for filtering tests
const mockTodos = [
  createMockTodo({
    id: 1,
    title: 'Buy groceries',
    description: 'Need to buy milk and bread',
    completed: false,
    priority: 'high',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  }),
  createMockTodo({
    id: 2,
    title: 'Walk the dog',
    description: 'Evening walk in the park',
    completed: true,
    priority: 'medium',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  }),
  createMockTodo({
    id: 3,
    title: 'Study React',
    description: undefined, // Test missing description
    completed: false,
    priority: 'low',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  }),
];

describe('useFilteredTodosSelector', () => {
  it('should return all todos when no search term', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFilteredTodosSelector('', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(3);
    });

    expect(result.current.data).toEqual(mockTodos);
    expect(result.current.hasSearchTerm).toBe(false);
  });

  it('should return filtered todos by title', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFilteredTodosSelector('buy', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(result.current.data).toEqual([expect.objectContaining({ id: 1, title: 'Buy groceries' })]);
    expect(result.current.hasSearchTerm).toBe(true);
  });

  it('should return filtered todos by description', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFilteredTodosSelector('park', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(result.current.data).toEqual([expect.objectContaining({ id: 2, title: 'Walk the dog' })]);
    expect(result.current.hasSearchTerm).toBe(true);
  });

  it('should be case insensitive', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFilteredTodosSelector('REACT', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(result.current.data).toEqual([expect.objectContaining({ id: 3, title: 'Study React' })]);
  });

  it('should return empty array when no matches', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFilteredTodosSelector('nonexistent', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });

    expect(result.current.hasSearchTerm).toBe(true);
  });

  it('should handle whitespace-only search terms', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFilteredTodosSelector('   ', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(3);
    });

    expect(result.current.data).toEqual(mockTodos);
    expect(result.current.hasSearchTerm).toBe(false);
  });

  it('should return empty array when no todos data', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFilteredTodosSelector('test', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], []);

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });

  it('should work with different data sources', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useFilteredTodosSelector('walk', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(result.current.data).toEqual([expect.objectContaining({ id: 2, title: 'Walk the dog' })]);
  });

  it('should pass through loading and error states', () => {
    const { result } = renderHookWithProviders(() => useFilteredTodosSelector('test', 'http'), {
      queryClientOptions: { retry: false },
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.refetch).toBeInstanceOf(Function);
  });
});
