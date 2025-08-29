import { Todo } from '@/modules/todo/todo.types';

/**
 * Retrieves todos from localStorage
 * @param storageKey - The localStorage key to use
 * @returns Array of todos or empty array if parsing fails
 */
export const getTodosFromStorage = (storageKey: string): Todo[] => {
  try {
    const stored = localStorage.getItem(storageKey);

    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
