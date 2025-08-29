'use client';

import { memo, useCallback } from 'react';

import { ERROR_TYPES, ErrorType } from '@/modules/todo/todo.types';
import { Box, Button, Typography } from '@/ui';

import { useErrorTestBusiness } from './hooks/use-error-test-business/use-error-test-business.hook';
import { useErrorTestController } from './hooks/use-error-test-controller/use-error-test-controller.hook';

interface ErrorTestButtonProps {
  className?: string;
}

export const ErrorTestButton = memo(({ className = '' }: ErrorTestButtonProps) => {
  // Hooks following todo-management pattern
  const business = useErrorTestBusiness('http');
  const controller = useErrorTestController();

  // Create memoized click handlers for each button to avoid inline functions
  const createClickHandler = useCallback(
    (type: ErrorType) => {
      return () => {
        controller.handleErrorTypeChange(type);
        business.triggerErrorTest(type);
      };
    },
    [controller, business],
  );

  return (
    <Box bgcolor="grey.50" border={1} borderColor="grey.300" borderRadius={2} className={className} p={2}>
      <Typography gutterBottom variant="h6">
        Test Error Handling
      </Typography>
      <Typography gutterBottom color="text.secondary" variant="body2">
        Click any button to test different error types and see toast notifications:
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
        {ERROR_TYPES.map(({ type, label, color }) => (
          <Button
            key={type}
            color={color}
            disabled={business.isLoading}
            size="small"
            sx={{
              minWidth: 'auto',
              fontSize: '0.75rem',
              opacity: controller.selectedErrorType === type && business.isLoading ? 0.7 : 1,
            }}
            variant="contained"
            onClick={createClickHandler(type)}
          >
            {controller.selectedErrorType === type && business.isLoading ? 'Loading...' : label}
          </Button>
        ))}
      </Box>

      <Typography color="text.secondary" display="block" mt={1} variant="caption">
        <strong>Note:</strong> All errors will show toast notifications. Unauthorized errors will also redirect to
        login.
      </Typography>
    </Box>
  );
});

ErrorTestButton.displayName = 'ErrorTestButton';
