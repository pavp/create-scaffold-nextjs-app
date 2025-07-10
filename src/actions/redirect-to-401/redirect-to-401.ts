'use server';

import { redirect } from 'next/navigation';

import { NOT_AUTHENTICATED_ROUTE } from '@/navigation/routes';

export const redirectTo401 = async () => redirect(NOT_AUTHENTICATED_ROUTE);
