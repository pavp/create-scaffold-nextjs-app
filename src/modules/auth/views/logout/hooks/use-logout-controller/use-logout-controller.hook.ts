'use client';

import { useCallback, useState } from 'react';

/**
 * Logout UI Controller Hook
 *
 * Handles UI state for logout confirmation.
 */
export const useLogoutController = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogoutClick = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const handleConfirmLogout = useCallback(
    (logoutFn: () => void) => () => {
      logoutFn();
      setShowConfirmation(false);
    },
    [],
  );

  const handleCancelLogout = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  return {
    showConfirmation,
    handleLogoutClick,
    handleConfirmLogout,
    handleCancelLogout,
  };
};
