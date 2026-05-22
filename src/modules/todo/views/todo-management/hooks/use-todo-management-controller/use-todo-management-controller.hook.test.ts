import { act, renderHook } from '@test/utils';

import type { CreateTodoRequest, Todo, TodoFilters, UpdateTodoRequest } from '@/modules/todo/todo.types';
import { useShowDialog } from '@/ui/dialog/hooks';

import { useTodoManagementController } from './use-todo-management-controller.hook';

const mockUseShowDialog = useShowDialog as jest.MockedFunction<typeof useShowDialog>;

// Mock data with proper TypeScript types
const mockTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test description',
  completed: false,
  priority: 'medium',
  dueDate: '2023-06-20T00:00:00Z',
  createdAt: '2023-06-15T00:00:00Z',
  updatedAt: '2023-06-15T00:00:00Z',
};

const mockTodos: Todo[] = [
  mockTodo,
  {
    id: 2,
    title: 'Another Todo',
    description: 'Another description',
    completed: true,
    priority: 'high',
    dueDate: '2023-06-25T00:00:00Z',
    createdAt: '2023-06-16T00:00:00Z',
    updatedAt: '2023-06-16T00:00:00Z',
  },
];

describe('useTodoManagementController', () => {
  // Mock functions with proper TypeScript types
  /** Mock function for creating todos */
  const mockCreateTodoFn = jest.fn<Promise<void>, [CreateTodoRequest]>();
  /** Mock function for updating todos */
  const mockUpdateTodoFn = jest.fn<Promise<void>, [string | number, UpdateTodoRequest]>();
  /** Mock function for deleting todos */
  const mockDeleteTodoFn = jest.fn<void, [string | number]>();
  /** Mock function for toggling todo completion */
  const mockToggleCompleteFn = jest.fn<void, [string | number, boolean]>();
  /** Mock function for applying filters */
  const mockApplyFiltersFn = jest.fn<void, [Partial<TodoFilters>]>();
  /** Mock function for setting selected todo */
  const mockSetSelectedTodoFn = jest.fn<void, [Todo | null]>();
  /** Mock function for showing dialog */
  const mockShowDialog = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock useShowDialog
    mockUseShowDialog.mockReturnValue({
      showDialog: mockShowDialog,
    });
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useTodoManagementController());

      expect(result.current.showCreateForm).toBe(false);
      expect(result.current.editingTodo).toBeNull();
      expect(result.current.searchTerm).toBe('');
      expect(result.current.isEditing).toBe(false);
    });
  });

  describe('Create Form Handlers', () => {
    it('should handle create click', () => {
      const { result } = renderHook(() => useTodoManagementController());

      act(() => {
        result.current.handleCreateClick();
      });

      expect(result.current.showCreateForm).toBe(true);
    });

    it('should handle create cancel', () => {
      const { result } = renderHook(() => useTodoManagementController());

      // First show the form
      act(() => {
        result.current.handleCreateClick();
      });

      expect(result.current.showCreateForm).toBe(true);

      // Then cancel
      act(() => {
        result.current.handleCreateCancel();
      });

      expect(result.current.showCreateForm).toBe(false);
    });

    it('should handle create submit', async () => {
      const { result } = renderHook(() => useTodoManagementController());
      const mockCreateData: CreateTodoRequest = {
        title: 'New Todo',
        priority: 'high',
      };

      // Show the form first
      act(() => {
        result.current.handleCreateClick();
      });

      expect(result.current.showCreateForm).toBe(true);

      // Submit the form
      const handleSubmit = result.current.handleCreateSubmit(mockCreateTodoFn);

      await act(async () => {
        await handleSubmit(mockCreateData);
      });

      expect(mockCreateTodoFn).toHaveBeenCalledWith(mockCreateData);
      expect(result.current.showCreateForm).toBe(false);
    });
  });

  describe('Edit Handlers', () => {
    it('should handle edit click', () => {
      const { result } = renderHook(() => useTodoManagementController());

      act(() => {
        result.current.handleEditClick(mockTodo.id, mockSetSelectedTodoFn, mockTodos);
      });

      expect(result.current.editingTodo).toBe(mockTodo.id);
      expect(result.current.isEditing).toBe(true);
      expect(mockSetSelectedTodoFn).toHaveBeenCalledWith(mockTodo);
    });

    it('should handle edit click with non-existent todo', () => {
      const { result } = renderHook(() => useTodoManagementController());

      act(() => {
        result.current.handleEditClick(999, mockSetSelectedTodoFn, mockTodos);
      });

      expect(result.current.editingTodo).toBe(999);
      expect(mockSetSelectedTodoFn).not.toHaveBeenCalled();
    });

    it('should handle edit cancel', () => {
      const { result } = renderHook(() => useTodoManagementController());

      // First start editing
      act(() => {
        result.current.handleEditClick(mockTodo.id, mockSetSelectedTodoFn, mockTodos);
      });

      expect(result.current.isEditing).toBe(true);

      // Then cancel editing
      act(() => {
        result.current.handleEditCancel(mockSetSelectedTodoFn);
      });

      expect(result.current.editingTodo).toBeNull();
      expect(result.current.isEditing).toBe(false);
      expect(mockSetSelectedTodoFn).toHaveBeenCalledWith(null);
    });

    it('should handle edit submit', async () => {
      const { result } = renderHook(() => useTodoManagementController());
      const mockUpdates: UpdateTodoRequest = {
        title: 'Updated Todo',
        priority: 'low',
      };

      // Start editing
      act(() => {
        result.current.handleEditClick(mockTodo.id, mockSetSelectedTodoFn, mockTodos);
      });

      // Submit the edit
      await act(async () => {
        await result.current.handleEditSubmit({
          updateTodoFn: mockUpdateTodoFn,
          todoId: mockTodo.id,
          updates: mockUpdates,
          setSelectedTodoFn: mockSetSelectedTodoFn,
        });
      });

      expect(mockUpdateTodoFn).toHaveBeenCalledWith(mockTodo.id, mockUpdates);
      expect(result.current.editingTodo).toBeNull();
      expect(result.current.isEditing).toBe(false);
      expect(mockSetSelectedTodoFn).toHaveBeenCalledWith(null);
    });
  });

  describe('Delete Handlers', () => {
    it('should handle direct delete', () => {
      const { result } = renderHook(() => useTodoManagementController());

      act(() => {
        result.current.handleDelete(mockDeleteTodoFn, mockTodo.id);
      });

      expect(mockDeleteTodoFn).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should handle delete click with confirmation dialog', () => {
      const { result } = renderHook(() => useTodoManagementController());

      act(() => {
        const handleDeleteClick = result.current.handleDeleteClick(mockDeleteTodoFn);

        handleDeleteClick(mockTodo);
      });

      expect(mockShowDialog).toHaveBeenCalledWith({
        title: 'Delete Todo',
        message: `Are you sure you want to delete "${mockTodo.title}"?`,
        severity: 'WARNING',
        acceptText: 'Delete',
        cancelText: 'Cancel',
        handleAccept: expect.any(Function),
      });

      // Test that the handleAccept function calls deleteTodoFn
      const dialogCall = mockShowDialog.mock.calls[0][0];

      act(() => {
        dialogCall.handleAccept();
      });

      expect(mockDeleteTodoFn).toHaveBeenCalledWith(mockTodo.id);
    });
  });

  describe('Toggle Complete Handler', () => {
    it('should handle toggle complete', () => {
      const { result } = renderHook(() => useTodoManagementController());

      act(() => {
        const handleToggle = result.current.handleToggleComplete(mockToggleCompleteFn);

        handleToggle(mockTodo.id, true);
      });

      expect(mockToggleCompleteFn).toHaveBeenCalledWith(mockTodo.id, true);
    });

    it('should handle toggle incomplete', () => {
      const { result } = renderHook(() => useTodoManagementController());

      act(() => {
        const handleToggle = result.current.handleToggleComplete(mockToggleCompleteFn);

        handleToggle(mockTodo.id, false);
      });

      expect(mockToggleCompleteFn).toHaveBeenCalledWith(mockTodo.id, false);
    });
  });

  describe('Filter Handlers', () => {
    it('should handle filter change', () => {
      const { result } = renderHook(() => useTodoManagementController());
      const mockFilters: Partial<TodoFilters> = {
        completed: true,
        priority: 'high',
      };

      act(() => {
        const handleFilterChange = result.current.handleFilterChange(mockApplyFiltersFn);

        handleFilterChange(mockFilters);
      });

      expect(mockApplyFiltersFn).toHaveBeenCalledWith(mockFilters);
    });

    it('should handle search change', () => {
      const { result } = renderHook(() => useTodoManagementController());
      const searchTerm = 'test search';

      act(() => {
        result.current.handleSearchChange(mockApplyFiltersFn, searchTerm);
      });

      expect(result.current.searchTerm).toBe(searchTerm);
      expect(mockApplyFiltersFn).toHaveBeenCalledWith({ search: searchTerm });
    });
  });

  describe('State Computed Properties', () => {
    it('should correctly compute isEditing when editingTodo is set', () => {
      const { result } = renderHook(() => useTodoManagementController());

      // Initially not editing
      expect(result.current.isEditing).toBe(false);

      // Start editing
      act(() => {
        result.current.handleEditClick(mockTodo.id, mockSetSelectedTodoFn, mockTodos);
      });

      expect(result.current.isEditing).toBe(true);
      expect(result.current.editingTodo).toBe(mockTodo.id);

      // Stop editing
      act(() => {
        result.current.handleEditCancel(mockSetSelectedTodoFn);
      });

      expect(result.current.isEditing).toBe(false);
      expect(result.current.editingTodo).toBeNull();
    });
  });

  describe('Handler Stability', () => {
    it('should maintain handler reference stability', () => {
      const { result, rerender } = renderHook(() => useTodoManagementController());

      const initialHandlers = {
        handleCreateClick: result.current.handleCreateClick,
        handleCreateCancel: result.current.handleCreateCancel,
        handleCreateSubmit: result.current.handleCreateSubmit,
        handleEditClick: result.current.handleEditClick,
        handleEditCancel: result.current.handleEditCancel,
        handleEditSubmit: result.current.handleEditSubmit,
        handleDelete: result.current.handleDelete,
        handleDeleteClick: result.current.handleDeleteClick,
        handleToggleComplete: result.current.handleToggleComplete,
        handleFilterChange: result.current.handleFilterChange,
        handleSearchChange: result.current.handleSearchChange,
      };

      // Re-render the hook
      rerender();

      // All handlers should maintain the same reference
      expect(result.current.handleCreateClick).toBe(initialHandlers.handleCreateClick);
      expect(result.current.handleCreateCancel).toBe(initialHandlers.handleCreateCancel);
      expect(result.current.handleCreateSubmit).toBe(initialHandlers.handleCreateSubmit);
      expect(result.current.handleEditClick).toBe(initialHandlers.handleEditClick);
      expect(result.current.handleEditCancel).toBe(initialHandlers.handleEditCancel);
      expect(result.current.handleEditSubmit).toBe(initialHandlers.handleEditSubmit);
      expect(result.current.handleDelete).toBe(initialHandlers.handleDelete);
      expect(result.current.handleDeleteClick).toBe(initialHandlers.handleDeleteClick);
      expect(result.current.handleToggleComplete).toBe(initialHandlers.handleToggleComplete);
      expect(result.current.handleFilterChange).toBe(initialHandlers.handleFilterChange);
      expect(result.current.handleSearchChange).toBe(initialHandlers.handleSearchChange);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in create submit', async () => {
      const { result } = renderHook(() => useTodoManagementController());
      const mockError = new Error('Create failed');

      mockCreateTodoFn.mockRejectedValue(mockError);

      const mockCreateData: CreateTodoRequest = {
        title: 'New Todo',
        priority: 'high',
      };

      // Show the form first
      act(() => {
        result.current.handleCreateClick();
      });

      // Submit the form and expect it to throw
      const handleSubmit = result.current.handleCreateSubmit(mockCreateTodoFn);

      await expect(
        act(async () => {
          await handleSubmit(mockCreateData);
        }),
      ).rejects.toThrow('Create failed');

      // Form should still be showing since error occurred
      expect(result.current.showCreateForm).toBe(true);
    });

    it('should handle errors in edit submit', async () => {
      const { result } = renderHook(() => useTodoManagementController());
      const mockError = new Error('Update failed');

      mockUpdateTodoFn.mockRejectedValue(mockError);

      const mockUpdates: UpdateTodoRequest = {
        title: 'Updated Todo',
        priority: 'low',
      };

      // Start editing
      act(() => {
        result.current.handleEditClick(mockTodo.id, mockSetSelectedTodoFn, mockTodos);
      });

      // Submit the edit and expect it to throw
      await expect(
        act(async () => {
          await result.current.handleEditSubmit({
            updateTodoFn: mockUpdateTodoFn,
            todoId: mockTodo.id,
            updates: mockUpdates,
            setSelectedTodoFn: mockSetSelectedTodoFn,
          });
        }),
      ).rejects.toThrow('Update failed');

      // Should still be in editing mode since error occurred
      expect(result.current.isEditing).toBe(true);
      expect(result.current.editingTodo).toBe(mockTodo.id);
    });
  });
});
