import { createMockTodo, createMockTodoFilters } from '@test/entities/todo.mock';
import { act, mockZustandStore, renderHook, setupTodoStoreState } from '@test/utils';

import type { Todo, TodoFilters } from '@/modules/todo/todo.types';

import { useTodoStore } from './todo.store';
import { useTodoActions } from './todo.store.actions';

describe('Todo Store', () => {
  // Mock data for testing - using faker-based factories for consistency
  let mockTodo: Todo;
  let mockFilters: TodoFilters;

  beforeAll(() => {
    // Create deterministic test data once for all tests
    mockTodo = createMockTodo({
      id: 1,
      title: 'Test Todo',
      completed: false,
      priority: 'medium',
    });
    mockFilters = createMockTodoFilters({
      completed: false,
      priority: 'high',
      search: 'test search',
    });
  });

  beforeEach(() => {
    // Reset store to initial state before each test using our test utilities
    mockZustandStore(useTodoStore, setupTodoStoreState());
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useTodoStore());

      expect(result.current.selectedTodo).toBeNull();
      expect(result.current.filters).toEqual({});
      expect(result.current.isCreating).toBe(false);
      expect(result.current.isEditing).toBe(false);
      expect(result.current.actions).toBeDefined();
    });

    it('should have all required actions', () => {
      const { result } = renderHook(() => useTodoStore());
      const { actions } = result.current;

      expect(actions.setSelectedTodo).toBeInstanceOf(Function);
      expect(actions.setFilters).toBeInstanceOf(Function);
      expect(actions.setCreating).toBeInstanceOf(Function);
      expect(actions.setEditing).toBeInstanceOf(Function);
      expect(actions.clearFilters).toBeInstanceOf(Function);
    });
  });

  describe('Actions', () => {
    describe('setSelectedTodo', () => {
      it('should set selected todo', () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.actions.setSelectedTodo(mockTodo);
        });

        expect(result.current.selectedTodo).toEqual(mockTodo);
      });

      it('should clear selected todo when null is passed', () => {
        const { result } = renderHook(() => useTodoStore());

        // First set a todo
        act(() => {
          result.current.actions.setSelectedTodo(mockTodo);
        });

        expect(result.current.selectedTodo).toEqual(mockTodo);

        // Then clear it
        act(() => {
          result.current.actions.setSelectedTodo(null);
        });

        expect(result.current.selectedTodo).toBeNull();
      });

      it('should update selected todo when different todo is passed', () => {
        const { result } = renderHook(() => useTodoStore());
        const anotherTodo = createMockTodo({ id: 2, title: 'Another Todo' });

        // Set first todo
        act(() => {
          result.current.actions.setSelectedTodo(mockTodo);
        });

        expect(result.current.selectedTodo).toEqual(mockTodo);

        // Set different todo
        act(() => {
          result.current.actions.setSelectedTodo(anotherTodo);
        });

        expect(result.current.selectedTodo).toEqual(anotherTodo);
      });
    });

    describe('setFilters', () => {
      it('should set filters', () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.actions.setFilters(mockFilters);
        });

        expect(result.current.filters).toEqual(mockFilters);
      });

      it('should merge filters with existing ones', () => {
        const { result } = renderHook(() => useTodoStore());
        const initialFilters = { completed: true };
        const additionalFilters = { priority: 'low' as const, search: 'test' };

        // Set initial filters
        act(() => {
          result.current.actions.setFilters(initialFilters);
        });

        expect(result.current.filters).toEqual(initialFilters);

        // Add more filters
        act(() => {
          result.current.actions.setFilters(additionalFilters);
        });

        expect(result.current.filters).toEqual({
          ...initialFilters,
          ...additionalFilters,
        });
      });

      it('should overwrite existing filter values', () => {
        const { result } = renderHook(() => useTodoStore());
        const initialFilters = { completed: true, priority: 'high' as const };
        const updatedFilters = { completed: false, search: 'new search' };

        // Set initial filters
        act(() => {
          result.current.actions.setFilters(initialFilters);
        });

        // Update filters
        act(() => {
          result.current.actions.setFilters(updatedFilters);
        });

        expect(result.current.filters).toEqual({
          completed: false, // overwritten
          priority: 'high', // kept from initial
          search: 'new search', // new
        });
      });

      it('should handle partial filter updates', () => {
        const { result } = renderHook(() => useTodoStore());

        // Set initial state
        act(() => {
          result.current.actions.setFilters({
            completed: true,
            priority: 'high',
            search: 'initial',
          });
        });

        // Update only one property
        act(() => {
          result.current.actions.setFilters({ search: 'updated' });
        });

        expect(result.current.filters).toEqual({
          completed: true,
          priority: 'high',
          search: 'updated',
        });
      });
    });

    describe('setCreating', () => {
      it('should set creating state to true', () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.actions.setCreating(true);
        });

        expect(result.current.isCreating).toBe(true);
      });

      it('should set creating state to false', () => {
        const { result } = renderHook(() => useTodoStore());

        // First set to true
        act(() => {
          result.current.actions.setCreating(true);
        });

        expect(result.current.isCreating).toBe(true);

        // Then set to false
        act(() => {
          result.current.actions.setCreating(false);
        });

        expect(result.current.isCreating).toBe(false);
      });

      it('should not affect other state properties', () => {
        const { result } = renderHook(() => useTodoStore());

        // Set some initial state
        act(() => {
          result.current.actions.setSelectedTodo(mockTodo);
          result.current.actions.setFilters(mockFilters);
          result.current.actions.setEditing(true);
        });

        const initialState = {
          selectedTodo: result.current.selectedTodo,
          filters: result.current.filters,
          isEditing: result.current.isEditing,
        };

        // Update only creating state
        act(() => {
          result.current.actions.setCreating(true);
        });

        expect(result.current.selectedTodo).toEqual(initialState.selectedTodo);
        expect(result.current.filters).toEqual(initialState.filters);
        expect(result.current.isEditing).toBe(initialState.isEditing);
        expect(result.current.isCreating).toBe(true);
      });
    });

    describe('setEditing', () => {
      it('should set editing state to true', () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.actions.setEditing(true);
        });

        expect(result.current.isEditing).toBe(true);
      });

      it('should set editing state to false', () => {
        const { result } = renderHook(() => useTodoStore());

        // First set to true
        act(() => {
          result.current.actions.setEditing(true);
        });

        expect(result.current.isEditing).toBe(true);

        // Then set to false
        act(() => {
          result.current.actions.setEditing(false);
        });

        expect(result.current.isEditing).toBe(false);
      });

      it('should not affect other state properties', () => {
        const { result } = renderHook(() => useTodoStore());

        // Set some initial state
        act(() => {
          result.current.actions.setSelectedTodo(mockTodo);
          result.current.actions.setFilters(mockFilters);
          result.current.actions.setCreating(true);
        });

        const initialState = {
          selectedTodo: result.current.selectedTodo,
          filters: result.current.filters,
          isCreating: result.current.isCreating,
        };

        // Update only editing state
        act(() => {
          result.current.actions.setEditing(true);
        });

        expect(result.current.selectedTodo).toEqual(initialState.selectedTodo);
        expect(result.current.filters).toEqual(initialState.filters);
        expect(result.current.isCreating).toBe(initialState.isCreating);
        expect(result.current.isEditing).toBe(true);
      });
    });

    describe('clearFilters', () => {
      it('should clear all filters', () => {
        const { result } = renderHook(() => useTodoStore());

        // Set some filters first
        act(() => {
          result.current.actions.setFilters(mockFilters);
        });

        expect(result.current.filters).toEqual(mockFilters);

        // Clear filters
        act(() => {
          result.current.actions.clearFilters();
        });

        expect(result.current.filters).toEqual({});
      });

      it('should not affect other state properties', () => {
        const { result } = renderHook(() => useTodoStore());

        // Set some initial state
        act(() => {
          result.current.actions.setSelectedTodo(mockTodo);
          result.current.actions.setFilters(mockFilters);
          result.current.actions.setCreating(true);
          result.current.actions.setEditing(true);
        });

        const initialState = {
          selectedTodo: result.current.selectedTodo,
          isCreating: result.current.isCreating,
          isEditing: result.current.isEditing,
        };

        // Clear only filters
        act(() => {
          result.current.actions.clearFilters();
        });

        expect(result.current.selectedTodo).toEqual(initialState.selectedTodo);
        expect(result.current.isCreating).toBe(initialState.isCreating);
        expect(result.current.isEditing).toBe(initialState.isEditing);
        expect(result.current.filters).toEqual({});
      });

      it('should work when filters are already empty', () => {
        const { result } = renderHook(() => useTodoStore());

        // Ensure filters are empty initially
        expect(result.current.filters).toEqual({});

        // Clear filters (should not throw or cause issues)
        act(() => {
          result.current.actions.clearFilters();
        });

        expect(result.current.filters).toEqual({});
      });
    });
  });

  describe('useTodoActions Hook', () => {
    it('should return only actions', () => {
      const { result } = renderHook(() => useTodoActions());

      expect(result.current.setSelectedTodo).toBeInstanceOf(Function);
      expect(result.current.setFilters).toBeInstanceOf(Function);
      expect(result.current.setCreating).toBeInstanceOf(Function);
      expect(result.current.setEditing).toBeInstanceOf(Function);
      expect(result.current.clearFilters).toBeInstanceOf(Function);
    });

    it('should return the same actions as main store', () => {
      const { result: storeResult } = renderHook(() => useTodoStore());
      const { result: actionsResult } = renderHook(() => useTodoActions());

      expect(actionsResult.current).toEqual(storeResult.current.actions);
    });

    it('should work correctly when called independently', () => {
      const { result: actionsResult } = renderHook(() => useTodoActions());
      const { result: storeResult } = renderHook(() => useTodoStore());

      // Use actions hook to modify state
      act(() => {
        actionsResult.current.setSelectedTodo(mockTodo);
        actionsResult.current.setFilters(mockFilters);
        actionsResult.current.setCreating(true);
        actionsResult.current.setEditing(true);
      });

      // Verify state changed in main store
      expect(storeResult.current.selectedTodo).toEqual(mockTodo);
      expect(storeResult.current.filters).toEqual(mockFilters);
      expect(storeResult.current.isCreating).toBe(true);
      expect(storeResult.current.isEditing).toBe(true);
    });
  });

  describe('State Interactions', () => {
    it('should handle multiple state changes in sequence', () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.actions.setSelectedTodo(mockTodo);
        result.current.actions.setFilters({ completed: true });
        result.current.actions.setCreating(true);
      });

      expect(result.current.selectedTodo).toEqual(mockTodo);
      expect(result.current.filters).toEqual({ completed: true });
      expect(result.current.isCreating).toBe(true);
      expect(result.current.isEditing).toBe(false);

      act(() => {
        result.current.actions.setFilters({ priority: 'low', search: 'test' });
        result.current.actions.setEditing(true);
        result.current.actions.setCreating(false);
      });

      expect(result.current.selectedTodo).toEqual(mockTodo);
      expect(result.current.filters).toEqual({
        completed: true,
        priority: 'low',
        search: 'test',
      });
      expect(result.current.isCreating).toBe(false);
      expect(result.current.isEditing).toBe(true);
    });

    it('should handle complex filter scenarios', () => {
      const { result } = renderHook(() => useTodoStore());

      // Set complex filters
      act(() => {
        result.current.actions.setFilters({
          completed: false,
          priority: 'high',
          search: 'important task',
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });
      });

      expect(result.current.filters).toEqual({
        completed: false,
        priority: 'high',
        search: 'important task',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      // Update some filters
      act(() => {
        result.current.actions.setFilters({
          completed: true,
          priority: 'low',
          page: 2,
        });
      });

      expect(result.current.filters).toEqual({
        completed: true, // updated
        priority: 'low', // updated
        search: 'important task', // kept
        page: 2, // updated
        limit: 10, // kept
        sortBy: 'createdAt', // kept
        sortOrder: 'desc', // kept
      });

      // Clear all filters
      act(() => {
        result.current.actions.clearFilters();
      });

      expect(result.current.filters).toEqual({});
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid consecutive updates', () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        // Rapid consecutive calls
        result.current.actions.setCreating(true);
        result.current.actions.setCreating(false);
        result.current.actions.setCreating(true);

        result.current.actions.setEditing(true);
        result.current.actions.setEditing(false);

        result.current.actions.setSelectedTodo(mockTodo);
        result.current.actions.setSelectedTodo(null);
        result.current.actions.setSelectedTodo(mockTodo);
      });

      expect(result.current.isCreating).toBe(true);
      expect(result.current.isEditing).toBe(false);
      expect(result.current.selectedTodo).toEqual(mockTodo);
    });

    it('should handle undefined filter values', () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.actions.setFilters({
          completed: undefined,
          priority: undefined,
          search: undefined,
        });
      });

      expect(result.current.filters).toEqual({
        completed: undefined,
        priority: undefined,
        search: undefined,
      });
    });

    it('should handle empty filter objects', () => {
      const { result } = renderHook(() => useTodoStore());

      // Set some filters first
      act(() => {
        result.current.actions.setFilters(mockFilters);
      });

      expect(result.current.filters).toEqual(mockFilters);

      // Set empty filters object
      act(() => {
        result.current.actions.setFilters({});
      });

      // Should still have the previous filters (empty object doesn't overwrite)
      expect(result.current.filters).toEqual(mockFilters);
    });
  });

  describe('Test Utils Integration', () => {
    it('should work with setupTodoStoreState utility', () => {
      const { result } = renderHook(() => useTodoStore());

      // Use our utility to set up a specific state
      const customState = setupTodoStoreState({
        selectedTodo: mockTodo,
        filters: { completed: true, priority: 'high' },
        isCreating: true,
        isEditing: false,
      });

      mockZustandStore(useTodoStore, customState);

      expect(result.current.selectedTodo).toEqual(mockTodo);
      expect(result.current.filters).toEqual({ completed: true, priority: 'high' });
      expect(result.current.isCreating).toBe(true);
      expect(result.current.isEditing).toBe(false);
    });

    it('should work with partial state from setupTodoStoreState', () => {
      const { result } = renderHook(() => useTodoStore());

      // Use utility with partial overrides
      const partialState = setupTodoStoreState({
        filters: { search: 'test query', completed: false },
        isEditing: true,
      });

      mockZustandStore(useTodoStore, partialState);

      expect(result.current.selectedTodo).toBeNull(); // default
      expect(result.current.filters).toEqual({ search: 'test query', completed: false });
      expect(result.current.isCreating).toBe(false); // default
      expect(result.current.isEditing).toBe(true);
    });

    it('should reset properly between tests using our utilities', () => {
      const { result: result1 } = renderHook(() => useTodoStore());

      // Modify state in first test scenario
      const modifiedState = setupTodoStoreState({
        selectedTodo: mockTodo,
        filters: mockFilters,
        isCreating: true,
        isEditing: true,
      });

      mockZustandStore(useTodoStore, modifiedState);

      expect(result1.current.selectedTodo).toEqual(mockTodo);
      expect(result1.current.isCreating).toBe(true);

      // Manually trigger reset (normally done in beforeEach)
      mockZustandStore(useTodoStore, setupTodoStoreState());

      const { result: result2 } = renderHook(() => useTodoStore());

      // Should be back to initial state
      expect(result2.current.selectedTodo).toBeNull();
      expect(result2.current.filters).toEqual({});
      expect(result2.current.isCreating).toBe(false);
      expect(result2.current.isEditing).toBe(false);
    });

    it('should handle complex state setup scenarios', () => {
      const { result } = renderHook(() => useTodoStore());

      // Create a complex initial state using faker factories
      const complexFilters = createMockTodoFilters({
        completed: false,
        priority: 'high' as const,
        search: 'important tasks',
        page: 2,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      });

      const complexTodo = createMockTodo({ priority: 'high', completed: false });
      const complexState = setupTodoStoreState({
        selectedTodo: complexTodo,
        filters: complexFilters,
        isCreating: false,
        isEditing: true,
      });

      mockZustandStore(useTodoStore, complexState);

      expect(result.current.selectedTodo).toEqual(complexTodo);
      expect(result.current.filters).toEqual(complexFilters);
      expect(result.current.isCreating).toBe(false);
      expect(result.current.isEditing).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should accept valid todo objects', () => {
      const { result } = renderHook(() => useTodoStore());

      const validTodos: Todo[] = [
        mockTodo,
        createMockTodo({ id: 2, priority: 'low' }),
        createMockTodo({ id: 3, priority: 'high', completed: true }),
      ];

      validTodos.forEach((todo) => {
        act(() => {
          result.current.actions.setSelectedTodo(todo);
        });
        expect(result.current.selectedTodo).toEqual(todo);
      });
    });

    it('should accept valid filter objects', () => {
      const { result } = renderHook(() => useTodoStore());

      const validFilters: Array<Partial<TodoFilters>> = [
        { completed: true },
        { priority: 'low' },
        { priority: 'medium' },
        { priority: 'high' },
        { search: 'test search' },
        { completed: false, priority: 'high', search: 'important' },
        { page: 1, limit: 20 },
        { sortBy: 'title', sortOrder: 'asc' },
        { sortBy: 'createdAt', sortOrder: 'desc' },
      ];

      validFilters.forEach((filters) => {
        act(() => {
          result.current.actions.setFilters(filters);
        });
        expect(result.current.filters).toMatchObject(filters);
      });
    });
  });
});
