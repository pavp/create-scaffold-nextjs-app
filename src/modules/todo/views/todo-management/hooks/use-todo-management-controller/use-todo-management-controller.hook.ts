'use client';

import { useCallback, useState } from 'react';

import type { CreateTodoRequest, Todo, TodoFilters, UpdateTodoRequest } from '@/modules/todo/todo.types';
import { useShowDialog } from '@/ui/dialog/hooks';

/**
 * UI controller hook - handles UI interactions, state, and UI patterns like dialogs
 */
export const useTodoManagementController = () => {
  // UI-only state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // UI patterns
  const { showDialog } = useShowDialog();

  // Pure UI handlers - receive business logic as parameters
  const handleCreateClick = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const handleCreateCancel = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  const handleCreateSubmit = useCallback(
    (createTodoFn: (data: CreateTodoRequest) => Promise<void>) => async (todoData: CreateTodoRequest) => {
      await createTodoFn(todoData);
      setShowCreateForm(false);
    },
    [],
  );

  const handleEditClick = useCallback(
    (todoId: string | number, setSelectedTodoFn: (todo: any) => void, todos: any[]) => {
      setEditingTodo(todoId);
      const todo = todos.find((t) => t.id === todoId);

      if (todo) {
        setSelectedTodoFn(todo);
      }
    },
    [],
  );

  const handleEditCancel = useCallback((setSelectedTodoFn: (todo: any) => void) => {
    setEditingTodo(null);
    setSelectedTodoFn(null);
  }, []);

  const handleEditSubmit = useCallback(
    async (params: {
      updateTodoFn: (id: string | number, data: UpdateTodoRequest) => Promise<void>;
      todoId: string | number;
      updates: UpdateTodoRequest;
      setSelectedTodoFn: (todo: any) => void;
    }) => {
      await params.updateTodoFn(params.todoId, params.updates);
      setEditingTodo(null);
      params.setSelectedTodoFn(null);
    },
    [],
  );

  const handleDelete = useCallback((deleteTodoFn: (id: string | number) => void, todoId: string | number) => {
    deleteTodoFn(todoId);
  }, []);

  const handleToggleComplete = useCallback(
    (toggleCompleteFn: (id: string | number, completed: boolean) => void) =>
      (todoId: string | number, completed: boolean) => {
        toggleCompleteFn(todoId, completed);
      },
    [],
  );

  const handleFilterChange = useCallback(
    (applyFiltersFn: (filters: Partial<TodoFilters>) => void) => (newFilters: Partial<TodoFilters>) => {
      applyFiltersFn(newFilters);
    },
    [],
  );

  const handleSearchChange = useCallback((applyFiltersFn: (filters: Partial<TodoFilters>) => void, term: string) => {
    setSearchTerm(term);
    applyFiltersFn({ search: term });
  }, []);

  const handleDeleteClick = useCallback(
    (deleteTodoFn: (id: string | number) => void) => (todo: Todo) => {
      showDialog({
        title: 'Delete Todo',
        message: `Are you sure you want to delete "${todo.title}"?`,
        severity: 'WARNING',
        acceptText: 'Delete',
        cancelText: 'Cancel',
        handleAccept: () => deleteTodoFn(todo.id),
      });
    },
    [showDialog],
  );

  return {
    // UI handlers (receive business logic as params)
    handleCreateClick,
    handleCreateCancel,
    handleCreateSubmit,
    handleEditClick,
    handleEditCancel,
    handleEditSubmit,
    handleDelete,
    handleDeleteClick,
    handleToggleComplete,
    handleFilterChange,
    handleSearchChange,

    // UI state
    showCreateForm,
    editingTodo,
    searchTerm,
    isEditing: editingTodo !== null,
  };
};
