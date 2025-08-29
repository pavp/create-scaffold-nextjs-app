'use server';

import { redirect } from 'next/navigation';

import { routes } from '@/navigation/routes';

export const redirectTo401 = async () => redirect(routes.NOT_AUTHENTICATED);
