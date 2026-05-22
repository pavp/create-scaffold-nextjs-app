import { useTodoStore } from './todo.store';

/**
 * Todo Actions Hook
 *
 * Provides access to todo store actions only.
 * Useful for components that only need to dispatch actions without accessing state.
 */
export const useTodoActions = () => useTodoStore((state) => state.actions);
