import { RootState } from '@/store';

export const selectSnackbar = (state: RootState) => state.toast;
