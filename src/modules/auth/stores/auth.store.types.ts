import type { AuthSession } from '@/modules/auth/auth.types';

// Auth state interface
export interface AuthState extends AuthSession {}

// Auth store actions
export interface AuthActions {
  setToken: (token: string) => void;
  setSession: (session: Partial<AuthSession>) => void;
  clearSession: () => void;
  validateSession: () => boolean;
}

// Combined auth store state
export interface AuthStoreState extends AuthState {
  actions: AuthActions;
}
