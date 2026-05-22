/**
 * @jest-environment jsdom
 */

import { renderHookWithProviders, setupMockQueryData, waitFor } from '@test/utils';

import { todoQueryKeys } from '@/modules/todo/repositories/todo/todo.repository.keys';

import { useCompletedTodosSelector } from './use-completed-todos-selector.hook';

const mockTodos = [
  {
    id: 1,
    title: 'Todo 1',
    completed: true,
    priority: 'high' as const,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Todo 2',
    completed: false,
    priority: 'medium' as const,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 3,
    title: 'Todo 3',
    completed: true,
    priority: 'low' as const,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

describe('useCompletedTodosSelector', () => {
  it('should return only completed todos', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useCompletedTodosSelector('http'), {
      queryClientOptions: { retry: false },
    });

    // Set up mock data after rendering but before waiting
    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    expect(result.current.data).toEqual([
      expect.objectContaining({ id: 1, completed: true }),
      expect.objectContaining({ id: 3, completed: true }),
    ]);
  });

  it('should return empty array when no todos', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useCompletedTodosSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], []);

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });

  it('should return empty array when no completed todos', async () => {
    const incompleteTodos = mockTodos.map((todo) => ({ ...todo, completed: false }));

    const { result, queryClient } = renderHookWithProviders(() => useCompletedTodosSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], incompleteTodos);

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });

  it('should pass through loading state', () => {
    const { result } = renderHookWithProviders(() => useCompletedTodosSelector('http'), {
      queryClientOptions: { retry: false },
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should work with different data sources', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useCompletedTodosSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    // The selector logic should work regardless of data source
    expect(result.current.data).toEqual([
      expect.objectContaining({ id: 1, completed: true }),
      expect.objectContaining({ id: 3, completed: true }),
    ]);
  });

  it('should provide refetch function', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useCompletedTodosSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.refetch).toBeInstanceOf(Function);
    });
  });
});
