/**
 * @jest-environment jsdom
 */

import { createMockTodosForPriority } from '@test/entities/todo.mock';
import { renderHookWithProviders, setupMockQueryData, waitFor } from '@test/utils';

import { todoQueryKeys } from '@/modules/todo/repositories/todo/todo.repository.keys';

import { useTodosByPrioritySelector } from './use-todos-by-priority-selector.hook';

// Use specialized factory for priority testing - creates: 2 high, 2 medium, 1 low priority todos
const mockTodos = createMockTodosForPriority();

describe('useTodosByPrioritySelector', () => {
  it('should return high priority todos', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodosByPrioritySelector('high', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    expect(result.current.data).toEqual([
      expect.objectContaining({ id: 1, priority: 'high' }),
      expect.objectContaining({ id: 2, priority: 'high' }),
    ]);
  });

  it('should return medium priority todos', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodosByPrioritySelector('medium', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    expect(result.current.data).toEqual([
      expect.objectContaining({ id: 3, priority: 'medium' }),
      expect.objectContaining({ id: 4, priority: 'medium' }),
    ]);
  });

  it('should return low priority todos', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodosByPrioritySelector('low', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(result.current.data).toEqual([expect.objectContaining({ id: 5, priority: 'low' })]);
  });

  it('should return empty array when no todos match priority', async () => {
    const noHighPriorityTodos = mockTodos.filter((todo) => todo.priority !== 'high');

    const { result, queryClient } = renderHookWithProviders(() => useTodosByPrioritySelector('high', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, ['todos', 'list'], noHighPriorityTodos);

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });

  it('should return empty array when no todos', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodosByPrioritySelector('high', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], []);

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });

  it('should work with different data sources', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodosByPrioritySelector('medium', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    expect(result.current.data).toEqual([
      expect.objectContaining({ id: 3, priority: 'medium' }),
      expect.objectContaining({ id: 4, priority: 'medium' }),
    ]);
  });

  it('should pass through loading state', () => {
    const { result } = renderHookWithProviders(() => useTodosByPrioritySelector('high', 'http'), {
      queryClientOptions: { retry: false },
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should provide refetch function', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodosByPrioritySelector('high', 'http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.refetch).toBeInstanceOf(Function);
    });
  });

  it('should update when priority filter changes', async () => {
    let priority: 'high' | 'medium' | 'low' = 'high';

    const { result, queryClient, rerender } = renderHookWithProviders(
      () => useTodosByPrioritySelector(priority, 'http'),
      {
        queryClientOptions: { retry: false },
      },
    );

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    // Change priority filter
    priority = 'medium';
    rerender();

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    expect(result.current.data).toEqual([
      expect.objectContaining({ id: 3, priority: 'medium' }),
      expect.objectContaining({ id: 4, priority: 'medium' }),
    ]);
  });
});
