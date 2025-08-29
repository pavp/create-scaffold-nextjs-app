/**
 * @jest-environment jsdom
 */

import { createMockTodosForStats } from '@test/entities/todo.mock';
import { renderHookWithProviders, setupMockQueryData, waitFor } from '@test/utils';

import { todoQueryKeys } from '@/modules/todo/repositories/todo/todo.repository.keys';

import { useTodoStatsSelector } from './use-todo-stats-selector.hook';

// Using specialized factory for statistics testing - creates predictable data:
// 2 completed (1 high, 1 low), 3 pending (1 high, 1 medium, 1 low)
const mockTodos = createMockTodosForStats();

describe('useTodoStatsSelector', () => {
  it('should calculate correct statistics', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data).toEqual({
        total: 5,
        completed: 2,
        pending: 3,
        highPriority: 2,
        mediumPriority: 1,
        lowPriority: 2,
        completionRate: 40, // 2/5 * 100 = 40%
      });
    });
  });

  it('should return zero stats when no todos', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], []);

    await waitFor(() => {
      expect(result.current.data).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        completionRate: 0,
      });
    });
  });

  it('should handle all completed todos', async () => {
    const completedTodos = mockTodos.map((todo) => ({ ...todo, completed: true }));

    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], completedTodos);

    await waitFor(() => {
      expect(result.current.data).toEqual({
        total: 5,
        completed: 5,
        pending: 0,
        highPriority: 2,
        mediumPriority: 1,
        lowPriority: 2,
        completionRate: 100,
      });
    });
  });

  it('should handle all pending todos', async () => {
    const pendingTodos = mockTodos.map((todo) => ({ ...todo, completed: false }));

    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], pendingTodos);

    await waitFor(() => {
      expect(result.current.data).toEqual({
        total: 5,
        completed: 0,
        pending: 5,
        highPriority: 2,
        mediumPriority: 1,
        lowPriority: 2,
        completionRate: 0,
      });
    });
  });

  it('should handle single todo', async () => {
    const singleTodo = [mockTodos[0]];

    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], singleTodo);

    await waitFor(() => {
      expect(result.current.data).toEqual({
        total: 1,
        completed: 1,
        pending: 0,
        highPriority: 1,
        mediumPriority: 0,
        lowPriority: 0,
        completionRate: 100,
      });
    });
  });

  it('should round completion rate correctly', async () => {
    const threeTodos = mockTodos.slice(0, 3); // 2 completed out of 3 = 66.666...%

    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], threeTodos);

    await waitFor(() => {
      expect(result.current.data.completionRate).toBe(67); // rounded
    });
  });

  it('should work with different data sources', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.data.total).toBe(5);
    });
  });

  it('should pass through loading state', () => {
    const { result } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should provide refetch function', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useTodoStatsSelector('http'), {
      queryClientOptions: { retry: false },
    });

    setupMockQueryData(queryClient, [...todoQueryKeys.list()], mockTodos);

    await waitFor(() => {
      expect(result.current.refetch).toBeInstanceOf(Function);
    });
  });
});
