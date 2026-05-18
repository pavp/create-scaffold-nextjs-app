'use client';

import { useCallback, useState } from 'react';

import type { AuthCredentials } from '@/modules/auth/auth.types';

/**
 * Login UI Controller Hook
 *
 * Handles UI form state for login view.
 */
export const useLoginController = () => {
  const [credentials, setCredentials] = useState<AuthCredentials>({ email: '', password: '' });

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, email: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, password: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    (loginFn: (credentials: AuthCredentials) => Promise<void>) => (e: React.SyntheticEvent) => {
      e.preventDefault();
      loginFn(credentials);
    },
    [credentials],
  );

  return {
    credentials,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};
