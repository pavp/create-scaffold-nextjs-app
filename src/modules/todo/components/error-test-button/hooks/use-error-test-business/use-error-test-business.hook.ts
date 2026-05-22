'use client';

import { useCallback, useState } from 'react';

import { todoRepository } from '@/modules/todo/repositories/todo';
import { ErrorType } from '@/modules/todo/todo.types';
import type { DataSource } from '@/types/gateway.types';

/**
 * Business logic hook for ErrorTest component
 * Uses repository query/mutation for error testing to handle different error types
 */
export const useErrorTestBusiness = (dataSource: DataSource = 'http') => {
  const [currentErrorType, setCurrentErrorType] = useState<ErrorType>('validation');

  // Use repository query for error testing with dynamic error type (for GET requests)
  const testErrorQuery = todoRepository.queries.useTestError(currentErrorType, dataSource, {
    enabled: false, // Only execute manually
  });

  // Use repository mutation for error testing (for POST requests like zod-request)
  const testErrorMutation = todoRepository.mutations.useTestError(dataSource);

  // Business action to trigger error test
  const triggerErrorTest = useCallback(
    (errorType: ErrorType) => {
      setCurrentErrorType(errorType);

      // Use mutation for zod-request (POST), query for others (GET)
      if (errorType === 'zod-request') {
        testErrorMutation.mutate(errorType);
      } else {
        // Small delay to ensure state is updated
        setTimeout(() => {
          testErrorQuery.refetch();
        }, 0);
      }
    },
    [testErrorQuery, testErrorMutation],
  );

  return {
    // Business actions
    triggerErrorTest,

    // States - combine loading from both query and mutation
    isLoading: testErrorQuery.isFetching || testErrorMutation.isPending,
  };
};
