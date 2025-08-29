/**
 * Utility function to validate todo data before creation/update
 * @param data - Todo data to validate
 * @throws Error if validation fails
 */
export const validateTodoData = (data: { title?: string }): void => {
  if (!data.title || data.title.trim().length === 0) {
    throw new Error('Todo title is required and cannot be empty');
  }

  if (data.title.length > 200) {
    throw new Error('Todo title cannot exceed 200 characters');
  }
};
