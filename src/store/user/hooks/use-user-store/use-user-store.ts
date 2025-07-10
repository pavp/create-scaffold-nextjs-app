'use client';

import { useAppSelector } from '@/store/hooks';

import { selectUser } from '../../selectors';

export const useUserStore = () => {
  const state = useAppSelector(selectUser);

  return { ...state };
};
