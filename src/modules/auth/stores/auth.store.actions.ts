import { useAuthStore } from './auth.store';

export const useAuthActions = () => useAuthStore((state) => state.actions);
