import { RootState } from '@/store';

export const selectTrackingInitialized = (state: RootState) => state.tracking.initialized;
