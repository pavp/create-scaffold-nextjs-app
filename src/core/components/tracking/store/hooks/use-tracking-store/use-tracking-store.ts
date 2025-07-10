import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { selectTrackingInitialized } from '../../selectors';
import { setTrackingInitialized } from '../../slice';

export const useTrackingStore = () => {
  const dispatch = useAppDispatch();
  const trackingInitialized = useAppSelector(selectTrackingInitialized);

  const updateTrackingInitialized = useCallback(() => {
    dispatch(setTrackingInitialized());
  }, [dispatch]);

  return { trackingInitialized, updateTrackingInitialized };
};
