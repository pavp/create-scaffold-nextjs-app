'use client';

import { memo } from 'react';

import type { TodoFilters, TodoPriority } from '@/modules/todo/todo.types';
import { Box, Card, CardContent, Selector, TextField, Typography } from '@/ui';

interface TodoFiltersProps {
  filters: TodoFilters;
  onFiltersChange: (filters: Partial<TodoFilters>) => void;
}

export const TodoFiltersComponent = memo(({ filters, onFiltersChange }: TodoFiltersProps) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography gutterBottom variant="h6">
          Filters
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
          <Box flex={1}>
            <Selector
              fullWidth
              defaultValues={filters.completed !== undefined ? [filters.completed.toString()] : ['']}
              handleOnChange={(values) =>
                onFiltersChange({
                  completed: values[0] === '' ? undefined : values[0] === 'true',
                })
              }
              label="Filter by Status"
              list={[
                { key: '', value: '', label: 'All' },
                { key: 'false', value: 'false', label: 'Pending' },
                { key: 'true', value: 'true', label: 'Completed' },
              ]}
              name="completed-filter"
            />
          </Box>
          <Box flex={1}>
            <Selector
              fullWidth
              defaultValues={filters.priority ? [filters.priority] : ['']}
              handleOnChange={(values) => onFiltersChange({ priority: values[0] as TodoPriority })}
              label="Filter by Priority"
              list={[
                { key: '', value: '', label: 'All' },
                { key: 'low', value: 'low', label: 'Low' },
                { key: 'medium', value: 'medium', label: 'Medium' },
                { key: 'high', value: 'high', label: 'High' },
              ]}
              name="priority-filter"
            />
          </Box>
          <Box flex={1}>
            <TextField
              fullWidth
              defaultValue={filters.search ?? ''}
              label="Search"
              onChange={(value) => onFiltersChange({ search: value })}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

TodoFiltersComponent.displayName = 'TodoFiltersComponent';
