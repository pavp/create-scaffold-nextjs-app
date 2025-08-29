import type { Todo, TodoFilters } from '@/modules/todo/todo.types';

// Todo store state
export interface TodoState {
  selectedTodo: Todo | null;
  filters: TodoFilters;
  isCreating: boolean;
  isEditing: boolean;
}

// Todo store actions
export interface TodoActions {
  setSelectedTodo: (todo: Todo | null) => void;
  setFilters: (filters: Partial<TodoFilters>) => void;
  setCreating: (creating: boolean) => void;
  setEditing: (editing: boolean) => void;
  clearFilters: () => void;
}

// Combined todo store state
export interface TodoStoreState extends TodoState {
  actions: TodoActions;
}
