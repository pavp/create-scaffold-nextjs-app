'use client';

import { memo, type MouseEvent, useCallback } from 'react';
import { Refresh } from '@mui/icons-material';

import { Box, Button, Typography } from '@/ui';

interface ErrorBoundaryProps {
  error: Error | null;
  onRetry: () => void;
}

export const ErrorBoundary = memo(({ error, onRetry }: ErrorBoundaryProps) => {
  const handleRetry = useCallback(
    (event?: MouseEvent<HTMLButtonElement>) => {
      event?.preventDefault();
      onRetry();
    },
    [onRetry],
  );

  if (!error) return null;

  return (
    <Box p={3}>
      <Typography color="error" variant="h6">
        Error loading todos
      </Typography>
      <Typography color="error" variant="body2">
        {error.message}
      </Typography>
      <Button startIcon={<Refresh />} sx={{ mt: 2 }} onClick={handleRetry}>
        Retry
      </Button>
    </Box>
  );
});

ErrorBoundary.displayName = 'ErrorBoundary';
