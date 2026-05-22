import { Todo } from '@/modules/todo/todo.types';

/**
 * Saves todos to localStorage
 * @param storageKey - The localStorage key to use
 * @param todos - Array of todos to save
 * @throws Error if saving fails
 */
export const saveTodosToStorage = (storageKey: string, todos: Todo[]): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  } catch {
    throw new Error('Failed to save todos to localStorage');
  }
};
