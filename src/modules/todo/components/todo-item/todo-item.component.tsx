'use client';

import { memo } from 'react';
import { Delete } from '@mui/icons-material';

import type { Todo, TodoPriority } from '@/modules/todo/todo.types';
import tokens from '@/styles/tokens';
import { Box, Card, CardContent, Checkbox, Chip, IconButton, Typography } from '@/ui';

interface TodoItemProps {
  todo: Todo;
  isDeleting: boolean;
  onToggleComplete: (id: string | number, completed: boolean) => void;
  onDelete: (todo: Todo) => void;
}

export const TodoItem = memo(({ todo, isDeleting, onToggleComplete, onDelete }: TodoItemProps) => {
  const getPriorityColor = (
    priority: TodoPriority,
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {/* Header with actions */}
        <Box alignItems="flex-start" display="flex" justifyContent="space-between" sx={{ mb: tokens.spacing.scale4 }}>
          <Checkbox checked={todo.completed} label="" onChange={() => onToggleComplete(todo.id, !todo.completed)} />
          <Box display="flex" gap={1}>
            <IconButton color="error" disabled={isDeleting} size="small" onClick={() => onDelete(todo)}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        {/* Title */}
        <Typography
          gutterBottom
          sx={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            opacity: todo.completed ? 0.7 : 1,
            fontSize: '1.1rem',
            fontWeight: 500,
          }}
          variant="h6"
        >
          {todo.title}
        </Typography>

        {/* Description */}
        {todo.description && (
          <Typography
            gutterBottom
            color="text.secondary"
            sx={{ opacity: todo.completed ? 0.7 : 1, mt: tokens.spacing.scale2 }}
            variant="body2"
          >
            {todo.description}
          </Typography>
        )}

        {/* Footer with priority and date */}
        <Box alignItems="center" display="flex" justifyContent="space-between" sx={{ mt: tokens.spacing.scale4 }}>
          <Chip color={getPriorityColor(todo.priority)} label={todo.priority} size="small" />
          {todo.dueDate && (
            <Typography color="text.secondary" variant="caption">
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Typography color="text.secondary" display="block" sx={{ mt: tokens.spacing.scale2 }} variant="caption">
          Updated: {new Date(todo.updatedAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
});

TodoItem.displayName = 'TodoItem';
