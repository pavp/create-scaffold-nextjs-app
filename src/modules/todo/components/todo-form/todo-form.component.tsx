'use client';

import { memo, useState } from 'react';
import { Add } from '@mui/icons-material';

import type { CreateTodoRequest, TodoPriority } from '@/modules/todo/todo.types';
import tokens from '@/styles/tokens';
import { Box, Button, Card, CardContent, CircularProgress, Selector, TextField, Typography } from '@/ui';

interface TodoFormProps {
  isCreating: boolean;
  onSubmit: (todo: CreateTodoRequest) => void;
}

export const TodoForm = memo(({ isCreating, onSubmit }: TodoFormProps) => {
  const [newTodo, setNewTodo] = useState<CreateTodoRequest>({
    title: '',
    description: '',
    priority: 'medium',
  });

  const handleSubmit = () => {
    if (!newTodo.title.trim()) return;
    onSubmit(newTodo);
    setNewTodo({ title: '', description: '', priority: 'medium' });
  };

  return (
    <Card sx={{ mb: tokens.spacing.scale6 }}>
      <CardContent>
        <Typography gutterBottom variant="h6">
          Add New Todo
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} sx={{ gap: tokens.spacing.scale4 }}>
          <Box flex={3}>
            <TextField
              fullWidth
              required
              defaultValue={newTodo.title}
              label="Title"
              onChange={(value) => setNewTodo({ ...newTodo, title: value })}
            />
          </Box>
          <Box flex={2}>
            <Selector
              fullWidth
              defaultValues={[newTodo.priority || 'medium']}
              handleOnChange={(values) => setNewTodo({ ...newTodo, priority: values[0] as TodoPriority })}
              label="Priority"
              list={[
                { key: 'low', value: 'low', label: 'Low' },
                { key: 'medium', value: 'medium', label: 'Medium' },
                { key: 'high', value: 'high', label: 'High' },
              ]}
              name="priority-new"
            />
          </Box>
          <Box alignContent="flex-end" flex={1}>
            <Button
              fullWidth
              disabled={!newTodo.title.trim() || isCreating}
              startIcon={isCreating ? <CircularProgress size={20} /> : <Add fontSize="small" />}
              sx={{ height: '56px' }}
              variant="contained"
              onClick={handleSubmit}
            >
              Add
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: tokens.spacing.scale4 }}>
          <TextField
            fullWidth
            multiline
            defaultValue={newTodo.description}
            label="Description (optional)"
            rows={2}
            onChange={(value) => setNewTodo({ ...newTodo, description: value })}
          />
        </Box>
      </CardContent>
    </Card>
  );
});

TodoForm.displayName = 'TodoForm';
