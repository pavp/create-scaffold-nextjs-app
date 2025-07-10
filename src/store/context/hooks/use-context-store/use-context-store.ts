'use client';

import { selectAppContext, selectContextFilterCustomerData } from '@/store/context';
import { useAppSelector } from '@/store/hooks';

export const useContextStore = () => {
  const state = useAppSelector(selectAppContext);
  const { customerName, companyName } = useAppSelector(selectContextFilterCustomerData);

  return {
    ...state,
    customerName,
    companyName,
  };
};
