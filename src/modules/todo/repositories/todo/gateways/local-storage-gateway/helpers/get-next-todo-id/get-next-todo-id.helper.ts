import { getTodosFromStorage } from '@/modules/todo/repositories/todo/gateways/local-storage-gateway/helpers/get-todos-from-storage/get-todos-from-storage.helper';
import { getNextId } from '@/modules/todo/repositories/todo/helpers/id-generator/id-generator.helper';

/**
 * Generates next available todo ID
 * @param storageKey - The localStorage key to use
 * @returns Next available ID
 */
export const getNextTodoId = (storageKey: string): number => {
  const todos = getTodosFromStorage(storageKey);

  return getNextId(todos);
};
