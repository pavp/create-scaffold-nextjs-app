import type { Draft } from 'immer';

import { createStoreWithMiddleware } from '@/core/lib/zustand';

import type { TodoState, TodoStoreState } from './todo.store.types';

const initialState: TodoState = {
  selectedTodo: null,
  filters: {},
  isCreating: false,
  isEditing: false,
};

export const useTodoStore = createStoreWithMiddleware<TodoStoreState>(
  (set, _get) => ({
    ...initialState,
    actions: {
      setSelectedTodo: (todo) => set({ selectedTodo: todo }),
      setFilters: (newFilters) =>
        set((draft: Draft<TodoStoreState>) => {
          Object.assign(draft.filters, newFilters);
        }),
      setCreating: (creating) => set({ isCreating: creating }),
      setEditing: (editing) => set({ isEditing: editing }),
      clearFilters: () => set({ filters: {} }),
    },
  }),
  'todo-store',
  {
    persist: true,
    exclude: ['isCreating', 'isEditing'], // ✅ Perfect IntelliSense: shows only valid keys, excludes 'actions'
  },
);
