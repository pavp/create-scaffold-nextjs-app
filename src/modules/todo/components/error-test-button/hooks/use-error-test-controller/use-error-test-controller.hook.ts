'use client';

import { useCallback, useState } from 'react';

import { ErrorType } from '@/modules/todo/todo.types';

/**
 * UI controller hook for ErrorTest component - handles UI interactions and state
 */
export const useErrorTestController = () => {
  // UI-only state
  const [selectedErrorType, setSelectedErrorType] = useState<ErrorType>('validation');

  // Pure UI handlers - receive business logic as parameters
  const handleErrorTypeChange = useCallback((errorType: ErrorType) => {
    setSelectedErrorType(errorType);
  }, []);

  const handleTestClick = useCallback(
    async (triggerErrorTestFn: (errorType: ErrorType) => Promise<any>) => {
      return triggerErrorTestFn(selectedErrorType);
    },
    [selectedErrorType],
  );

  const handleReset = useCallback((resetFn: () => void) => {
    resetFn();
  }, []);

  return {
    // UI handlers (receive business logic as params)
    handleErrorTypeChange,
    handleTestClick,
    handleReset,

    // UI state
    selectedErrorType,
  };
};
