'use client';

import { useCallback, useMemo } from 'react';

import { todoRepository } from '@/modules/todo/repositories/todo';
import { createTodoGateway } from '@/modules/todo/repositories/todo/gateways';
import {
  useCompletedTodosSelector,
  useFiltersSelector,
  useSelectedTodoSelector,
  useTodoStatsSelector,
} from '@/modules/todo/selectors';
import { useTodoActions } from '@/modules/todo/stores/todo.store.actions';
import type { CreateTodoRequest, TodoFilters, UpdateTodoRequest } from '@/modules/todo/todo.types';
import { formatRelativeDate } from '@/modules/todo/views/todo-management/helpers/date-format/date-format.helper';
import { getMotivationalMessage } from '@/modules/todo/views/todo-management/helpers/motivational-message/motivational-message.helper';
import { getPriorityColor } from '@/modules/todo/views/todo-management/helpers/priority-color/priority-color.helper';
import type { DataSource } from '@/types/gateway.types';

/**
 * Business logic hook specific to TodoManagement component
 * Handles React Query operations, data transformations, and business rules for the todo management view
 */
export const useTodoManagementBusiness = (dataSource: DataSource = 'http') => {
  const { filters } = useFiltersSelector();
  const { selectedTodo } = useSelectedTodoSelector();
  const { setSelectedTodo, setFilters } = useTodoActions();

  // Data fetching via selectors and repository
  const allTodosQuery = todoRepository.queries.useTodos(filters, dataSource);
  const completedTodosQuery = useCompletedTodosSelector(dataSource);
  const todoStatsQuery = useTodoStatsSelector(dataSource);

  // Mutations
  const createTodoMutation = todoRepository.mutations.useCreateTodo(dataSource);
  const updateTodoMutation = todoRepository.mutations.useUpdateTodo(dataSource);
  const deleteTodoMutation = todoRepository.mutations.useDeleteTodo(dataSource);

  // Business actions with individual useCallback
  const createTodo = useCallback(
    async (data: CreateTodoRequest) => {
      if (!data.title?.trim()) {
        throw new Error('Todo title is required');
      }

      const todoData = {
        ...data,
        title: data.title.trim(),
        createdAt: new Date().toISOString(),
        priority: data.priority || 'medium',
      };

      return createTodoMutation.mutate(todoData);
    },
    [createTodoMutation],
  );

  const updateTodo = useCallback(
    (id: string | number, data: UpdateTodoRequest) => {
      return updateTodoMutation.mutate({ id, data });
    },
    [updateTodoMutation],
  );

  const deleteTodo = useCallback(
    (id: string | number) => {
      return deleteTodoMutation.mutate(id);
    },
    [deleteTodoMutation],
  );

  const toggleTodoComplete = useCallback(
    (id: string | number, completed: boolean) => {
      const updateData = {
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      };

      return updateTodo(id, updateData);
    },
    [updateTodo],
  );

  const applyFilters = useCallback(
    (newFilters: Partial<TodoFilters>) => {
      setFilters({ ...filters, ...newFilters });
    },
    [filters, setFilters],
  );

  // Presentation data - formatted for display
  const formattedTodos = useMemo(() => {
    if (!allTodosQuery.data) return [];

    return allTodosQuery.data.map((todo: any) => ({
      ...todo,
      displayTitle: todo.title.length > 50 ? `${todo.title.slice(0, 50)}...` : todo.title,
      priorityColor: getPriorityColor(todo.priority),
      statusIcon: todo.completed ? '✅' : '⏳',
      dueDateDisplay: todo.dueDate ? formatRelativeDate(todo.dueDate) : null,
      isOverdue: todo.dueDate ? new Date(todo.dueDate) < new Date() : false,
    }));
  }, [allTodosQuery.data]);

  const summary = useMemo(() => {
    if (!allTodosQuery.data) return null;

    return {
      total: allTodosQuery.data.length,
      completed: completedTodosQuery.data?.length || 0,
      pending: allTodosQuery.data.length - (completedTodosQuery.data?.length || 0),
      completionRate: todoStatsQuery.data?.completionRate || 0,
      motivationalMessage: getMotivationalMessage(allTodosQuery.data),
    };
  }, [allTodosQuery.data, completedTodosQuery.data, todoStatsQuery.data]);

  // Gateway info helper
  const getSourceInfo = useCallback(() => {
    const gateway = createTodoGateway(dataSource);

    return gateway.getSourceInfo();
  }, [dataSource]);

  // Simple computed values
  const isEmpty = !allTodosQuery.isLoading && (!allTodosQuery.data || allTodosQuery.data.length === 0);
  const isLoading = allTodosQuery.isLoading;
  const hasError = !!(
    allTodosQuery.error ||
    createTodoMutation.error ||
    updateTodoMutation.error ||
    deleteTodoMutation.error
  );

  return {
    // Business actions
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    applyFilters,
    setSelectedTodo,

    // Presentation data
    todos: formattedTodos,
    completedTodos: completedTodosQuery.data || [],
    summary,
    selectedTodo,
    filters,

    // States
    isEmpty,
    isLoading,
    hasError,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    error: allTodosQuery.error || createTodoMutation.error || updateTodoMutation.error || deleteTodoMutation.error,

    // Utilities
    refetch: allTodosQuery.refetch,
    getSourceInfo,
  };
};
