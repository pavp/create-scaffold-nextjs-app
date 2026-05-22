import { useTodoStore } from '@/modules/todo/stores/todo.store';

/**
 * Selector for selected todo with enhanced computed properties
 * Optimized for components that work with the selected todo
 */
export const useSelectedTodoSelector = () => {
  const selectedTodo = useTodoStore((state) => state.selectedTodo);

  return {
    selectedTodo,
  };
};
