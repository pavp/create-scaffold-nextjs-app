'use client';

import { memo } from 'react';
import { Refresh } from '@mui/icons-material';

import { TodoItem } from '@/modules/todo/components/todo-item/todo-item.component';
import type { Todo } from '@/modules/todo/todo.types';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@/ui';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  isDeleting: boolean;
  onRefresh: () => void;
  onToggleComplete: (id: string | number, completed: boolean) => void;
  onDelete: (todo: Todo) => void;
}

export const TodoList = memo(
  ({ todos, isLoading, isDeleting, onRefresh, onToggleComplete, onDelete }: TodoListProps) => {
    return (
      <>
        {/* Actions */}
        <Box alignItems="center" display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h6">Todos ({todos.length})</Typography>
          <Button
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Refresh fontSize="small" />}
            variant="outlined"
            onClick={onRefresh}
          >
            Refresh
          </Button>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Todo List */}
        {!isLoading && (
          <Box>
            {todos.length === 0 ? (
              <Card>
                <CardContent>
                  <Typography color="text.secondary" textAlign="center" variant="body1">
                    No todos found. Create your first todo above!
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box
                display="grid"
                gap={2}
                sx={{
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                }}
              >
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    isDeleting={isDeleting}
                    todo={todo}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </>
    );
  },
);

TodoList.displayName = 'TodoList';
