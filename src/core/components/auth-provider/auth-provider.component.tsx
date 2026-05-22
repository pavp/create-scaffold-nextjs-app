'use client';

import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';

import { AuthLoading } from '@/components/auth-loading/auth-loading.component';
import { routes } from '@/navigation/routes';

const isAuthenticated = true;
const isLoading = false;
const isError = false;

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  // const { isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading && !isError) return <AuthLoading visible />;

  if (isAuthenticated) return <>{children}</>;

  redirect(routes.NOT_AUTHENTICATED);
};
