/**
 * Utility function to get next available ID from array of todos
 * @param todos - Array of todos
 * @returns Next available ID
 */
export const getNextId = (todos: Array<{ id: string | number }>): number => {
  if (todos.length === 0) return 1;

  const numericIds = todos.map((t) => Number(t.id)).filter((id) => !isNaN(id));

  return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
};
