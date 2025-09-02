'use client';

import {
  DataSourceSwitcher,
  ErrorBoundary,
  ErrorTestButton,
  TodoFiltersComponent,
  TodoForm,
  TodoList,
} from '@/modules/todo/components';
import { useDataSource } from '@/modules/todo/hooks';
import tokens from '@/styles/tokens';
import { Box, Typography } from '@/ui';

import { useTodoManagementBusiness, useTodoManagementController } from './hooks';

export const TodoManagementView = () => {
  // Data source management
  const { dataSource, switchDataSource, getDataSourceInfo } = useDataSource('http');

  // Business logic hook specific to TodoManagement
  const {
    todos,
    filters,
    isLoading,
    isCreating,
    isDeleting,
    error,
    createTodo,
    deleteTodo,
    toggleTodoComplete,
    applyFilters,
    refetch,
  } = useTodoManagementBusiness(dataSource);

  // UI controller hook (handles UI patterns including dialogs)
  const { handleCreateSubmit, handleDeleteClick, handleToggleComplete, handleFilterChange } =
    useTodoManagementController();

  if (error) {
    return <ErrorBoundary error={error} onRetry={refetch} />;
  }

  return (
    <Box sx={{ p: tokens.spacing.scale6 }}>
      <Typography gutterBottom variant="h4">
        Todo Management
      </Typography>
      <Typography gutterBottom color="text.secondary" variant="body1">
        Testing React Query + Zustand architecture with Gateway Pattern
      </Typography>

      <DataSourceSwitcher
        currentSource={dataSource}
        isLoading={isLoading}
        sourceInfo={getDataSourceInfo()}
        onSourceChange={switchDataSource}
      />

      <ErrorTestButton className="mb-4" />

      <TodoForm isCreating={isCreating} onSubmit={handleCreateSubmit(createTodo)} />

      <TodoFiltersComponent filters={filters} onFiltersChange={handleFilterChange(applyFilters)} />

      <TodoList
        isDeleting={isDeleting}
        isLoading={isLoading}
        todos={todos}
        onDelete={handleDeleteClick(deleteTodo)}
        onRefresh={refetch}
        onToggleComplete={handleToggleComplete(toggleTodoComplete)}
      />
    </Box>
  );
};
