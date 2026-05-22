import { act, renderHook, renderHookWithProviders } from '@test/utils';

import { todoRepository } from '@/modules/todo/repositories/todo';
import type {
  TodoMutationsRepository,
  TodoQueriesRepository,
} from '@/modules/todo/repositories/todo/todo.repository.types';
import {
  type TodoStats,
  useCompletedTodosSelector,
  useFiltersSelector,
  useSelectedTodoSelector,
  useTodoStatsSelector,
} from '@/modules/todo/selectors';
import { useTodoActions } from '@/modules/todo/stores/todo.store.actions';
import type { TodoActions } from '@/modules/todo/stores/todo.store.types';
import type { CreateTodoRequest, Todo, TodoFilters, UpdateTodoRequest } from '@/modules/todo/todo.types';
import { formatRelativeDate } from '@/modules/todo/views/todo-management/helpers/date-format/date-format.helper';
import { getMotivationalMessage } from '@/modules/todo/views/todo-management/helpers/motivational-message/motivational-message.helper';
import { getPriorityColor } from '@/modules/todo/views/todo-management/helpers/priority-color/priority-color.helper';

import { useTodoManagementBusiness } from './use-todo-management-business.hook';

// Mock dependencies
jest.mock('@/modules/todo/repositories/todo');
jest.mock('@/modules/todo/selectors');
jest.mock('@/modules/todo/stores/todo.store.actions');
jest.mock('@/modules/todo/views/todo-management/helpers/date-format/date-format.helper');
jest.mock('@/modules/todo/views/todo-management/helpers/motivational-message/motivational-message.helper');
jest.mock('@/modules/todo/views/todo-management/helpers/priority-color/priority-color.helper');

// Mock the createTodoGateway to avoid initialization issues
jest.mock('@/modules/todo/repositories/todo/gateways', () => ({
  createTodoGateway: jest.fn(() => ({
    getSourceInfo: jest.fn(() => ({ type: 'mock', status: 'available' })),
  })),
}));

const mockTodoRepository = todoRepository as jest.Mocked<typeof todoRepository>;
const mockUseFiltersSelector = useFiltersSelector as jest.MockedFunction<typeof useFiltersSelector>;
const mockUseSelectedTodoSelector = useSelectedTodoSelector as jest.MockedFunction<typeof useSelectedTodoSelector>;
const mockUseCompletedTodosSelector = useCompletedTodosSelector as jest.MockedFunction<
  typeof useCompletedTodosSelector
>;
const mockUseTodoStatsSelector = useTodoStatsSelector as jest.MockedFunction<typeof useTodoStatsSelector>;
const mockUseTodoActions = useTodoActions as jest.MockedFunction<typeof useTodoActions>;
const mockFormatRelativeDate = formatRelativeDate as jest.MockedFunction<typeof formatRelativeDate>;
const mockGetMotivationalMessage = getMotivationalMessage as jest.MockedFunction<typeof getMotivationalMessage>;
const mockGetPriorityColor = getPriorityColor as jest.MockedFunction<typeof getPriorityColor>;

// Mock data with proper TypeScript types
const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Test Todo 1',
    description: 'Test description 1',
    completed: false,
    priority: 'high',
    dueDate: '2023-06-20T00:00:00Z',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z',
  },
  {
    id: 2,
    title: 'Test Todo 2 with a very long title that exceeds fifty characters limit',
    description: 'Test description 2',
    completed: true,
    priority: 'low',
    dueDate: '2023-06-10T00:00:00Z',
    createdAt: '2023-06-14T00:00:00Z',
    updatedAt: '2023-06-14T00:00:00Z',
  },
];

const mockCompletedTodos: Todo[] = [mockTodos[1]];

const mockFilters: Partial<TodoFilters> = {
  completed: false,
  priority: 'high',
  search: 'test',
};

const mockSelectedTodo: Todo = mockTodos[0];

const mockStats: TodoStats = {
  total: 2,
  completed: 1,
  pending: 1,
  highPriority: 1,
  mediumPriority: 0,
  lowPriority: 1,
  completionRate: 50,
};

describe('useTodoManagementBusiness', () => {
  // Mock implementations with proper TypeScript types for better type safety
  /** Mock function for setting selected todo */
  const mockSetSelectedTodo = jest.fn<void, [Todo | null]>();
  /** Mock function for setting filters */
  const mockSetFilters = jest.fn<void, [Partial<TodoFilters>]>();
  /** Mock function for creating todos */
  const mockCreateTodoMutate = jest.fn<void, [CreateTodoRequest]>();
  /** Mock function for updating todos */
  const mockUpdateTodoMutate = jest.fn<void, [{ id: string | number; data: UpdateTodoRequest }]>();
  /** Mock function for deleting todos */
  const mockDeleteTodoMutate = jest.fn<void, [string | number]>();
  /** Mock function for refetching data */
  const mockRefetch = jest.fn<Promise<any>, []>();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock Date for consistent timestamps and isOverdue calculations
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-06-15T12:00:00.000Z'));
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-06-15T12:00:00.000Z');

    // Mock selectors with proper return types
    mockUseFiltersSelector.mockReturnValue({ filters: mockFilters });
    mockUseSelectedTodoSelector.mockReturnValue({ selectedTodo: mockSelectedTodo });
    mockUseCompletedTodosSelector.mockReturnValue({
      data: mockCompletedTodos,
      isLoading: false,
      error: null,
      refetch: jest.fn<Promise<any>, []>(),
    });
    mockUseTodoStatsSelector.mockReturnValue({
      data: mockStats,
      isLoading: false,
      error: null,
      refetch: jest.fn<Promise<any>, []>(),
    });
    mockUseTodoActions.mockReturnValue({
      setSelectedTodo: mockSetSelectedTodo,
      setFilters: mockSetFilters,
      setCreating: jest.fn<void, [boolean]>(),
      setEditing: jest.fn<void, [boolean]>(),
      clearFilters: jest.fn<void, []>(),
    } as TodoActions);

    // Mock repository queries and mutations with proper types
    mockTodoRepository.queries = {
      useTodos: jest.fn().mockReturnValue({
        data: mockTodos,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      }),
      useTodo: jest.fn(),
      useTodoCount: jest.fn(),
      useTestError: jest.fn(),
      prefetch: {
        prefetchTodos: jest.fn(),
      },
      cancel: {
        cancelTodos: jest.fn(),
        cancelTodo: jest.fn(),
        cancelTodoCount: jest.fn(),
        cancelTestError: jest.fn(),
        cancelAll: jest.fn(),
      },
    } as jest.Mocked<TodoQueriesRepository>;

    mockTodoRepository.mutations = {
      useCreateTodo: jest.fn().mockReturnValue({
        mutate: mockCreateTodoMutate,
        isPending: false,
        error: null,
      }),
      useUpdateTodo: jest.fn().mockReturnValue({
        mutate: mockUpdateTodoMutate,
        isPending: false,
        error: null,
      }),
      useDeleteTodo: jest.fn().mockReturnValue({
        mutate: mockDeleteTodoMutate,
        isPending: false,
        error: null,
      }),
      useBulkDeleteTodos: jest.fn(),
      useTestError: jest.fn(),
    } as jest.Mocked<TodoMutationsRepository>;

    // Mock helper functions
    mockFormatRelativeDate.mockImplementation((date) => `formatted-${date}`);
    mockGetMotivationalMessage.mockReturnValue('Keep going!');
    mockGetPriorityColor.mockImplementation((priority) => `#color-${priority}`);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.filters).toEqual(mockFilters);
      expect(result.current.selectedTodo).toEqual(mockSelectedTodo);
      expect(result.current.isEmpty).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBe(false);
    });

    it('should handle empty todos state', () => {
      mockTodoRepository.queries.useTodos = jest.fn().mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHookWithProviders(() => useTodoManagementBusiness('http'));

      expect(result.current.isEmpty).toBe(true);
      expect(result.current.todos).toEqual([]);
    });

    it('should handle loading state', () => {
      mockTodoRepository.queries.useTodos = jest.fn().mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isEmpty).toBe(false);
    });
  });

  describe('Formatted Todos', () => {
    it('should format todos with display properties', () => {
      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      const formattedTodos = result.current.todos;

      expect(formattedTodos).toHaveLength(2);
      expect(formattedTodos[0]).toMatchObject({
        id: 1,
        title: 'Test Todo 1',
        displayTitle: 'Test Todo 1',
        priorityColor: '#color-high',
        statusIcon: '⏳',
        dueDateDisplay: 'formatted-2023-06-20T00:00:00Z',
        isOverdue: false,
      });

      expect(formattedTodos[1]).toMatchObject({
        id: 2,
        displayTitle: 'Test Todo 2 with a very long title that exceeds fi...',
        priorityColor: '#color-low',
        statusIcon: '✅',
        dueDateDisplay: 'formatted-2023-06-10T00:00:00Z',
        isOverdue: true,
      });
    });

    it('should handle todos without due dates', () => {
      const todosWithoutDueDate = [
        {
          ...mockTodos[0],
          dueDate: undefined,
        },
      ];

      mockTodoRepository.queries.useTodos = jest.fn().mockReturnValue({
        data: todosWithoutDueDate,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.todos[0].dueDateDisplay).toBeNull();
      expect(result.current.todos[0].isOverdue).toBe(false);
    });
  });

  describe('Summary Calculation', () => {
    it('should calculate summary correctly', () => {
      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.summary).toEqual({
        total: 2,
        completed: 1,
        pending: 1,
        completionRate: 50,
        motivationalMessage: 'Keep going!',
      });
    });

    it('should return null summary when no data', () => {
      mockTodoRepository.queries.useTodos = jest.fn().mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.summary).toBeNull();
    });
  });

  describe('Business Actions', () => {
    describe('createTodo', () => {
      it('should create todo with valid data', async () => {
        const { result } = renderHook(() => useTodoManagementBusiness('http'));

        const createData: CreateTodoRequest = {
          title: '  New Todo  ',
          description: 'New description',
          priority: 'high',
        };

        await act(async () => {
          await result.current.createTodo(createData);
        });

        expect(mockCreateTodoMutate).toHaveBeenCalledWith({
          title: 'New Todo',
          description: 'New description',
          priority: 'high',
          createdAt: '2023-06-15T12:00:00.000Z',
        });
      });

      it('should set default priority when not provided', async () => {
        const { result } = renderHook(() => useTodoManagementBusiness('http'));

        const createData: CreateTodoRequest = {
          title: 'New Todo',
        };

        await act(async () => {
          await result.current.createTodo(createData);
        });

        expect(mockCreateTodoMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            priority: 'medium',
          }),
        );
      });

      it('should throw error for empty title', async () => {
        const { result } = renderHook(() => useTodoManagementBusiness('http'));

        const createData: CreateTodoRequest = {
          title: '   ',
        };

        await expect(
          act(async () => {
            await result.current.createTodo(createData);
          }),
        ).rejects.toThrow('Todo title is required');

        expect(mockCreateTodoMutate).not.toHaveBeenCalled();
      });
    });

    describe('updateTodo', () => {
      it('should update todo', async () => {
        const { result } = renderHook(() => useTodoManagementBusiness('http'));

        const updateData: UpdateTodoRequest = {
          title: 'Updated Todo',
          priority: 'low',
        };

        await act(async () => {
          await result.current.updateTodo(1, updateData);
        });

        expect(mockUpdateTodoMutate).toHaveBeenCalledWith({
          id: 1,
          data: updateData,
        });
      });
    });

    describe('deleteTodo', () => {
      it('should delete todo', async () => {
        const { result } = renderHook(() => useTodoManagementBusiness('http'));

        await act(async () => {
          await result.current.deleteTodo(1);
        });

        expect(mockDeleteTodoMutate).toHaveBeenCalledWith(1);
      });
    });

    describe('toggleTodoComplete', () => {
      it('should toggle todo to completed', async () => {
        const { result } = renderHook(() => useTodoManagementBusiness('http'));

        await act(async () => {
          await result.current.toggleTodoComplete(1, true);
        });

        expect(mockUpdateTodoMutate).toHaveBeenCalledWith({
          id: 1,
          data: {
            completed: true,
            completedAt: '2023-06-15T12:00:00.000Z',
          },
        });
      });

      it('should toggle todo to incomplete', async () => {
        const { result } = renderHook(() => useTodoManagementBusiness('http'));

        await act(async () => {
          await result.current.toggleTodoComplete(1, false);
        });

        expect(mockUpdateTodoMutate).toHaveBeenCalledWith({
          id: 1,
          data: {
            completed: false,
            completedAt: null,
          },
        });
      });
    });

    describe('applyFilters', () => {
      it('should merge new filters with existing ones', () => {
        const { result } = renderHook(() => useTodoManagementBusiness('http'));

        act(() => {
          result.current.applyFilters({ priority: 'low' });
        });

        expect(mockSetFilters).toHaveBeenCalledWith({
          ...mockFilters,
          priority: 'low',
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle query errors', () => {
      const error = new Error('Query failed');

      mockTodoRepository.queries.useTodos = jest.fn().mockReturnValue({
        data: mockTodos,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.hasError).toBe(true);
      expect(result.current.error).toBe(error);
    });

    it('should handle mutation errors', () => {
      const error = new Error('Mutation failed');

      mockTodoRepository.mutations.useCreateTodo = jest.fn().mockReturnValue({
        mutate: mockCreateTodoMutate,
        isPending: false,
        error,
      });

      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.hasError).toBe(true);
      expect(result.current.error).toBe(error);
    });
  });

  describe('Loading States', () => {
    it('should handle mutation loading states', () => {
      mockTodoRepository.mutations.useCreateTodo = jest.fn().mockReturnValue({
        mutate: mockCreateTodoMutate,
        isPending: true,
        error: null,
      });

      mockTodoRepository.mutations.useUpdateTodo = jest.fn().mockReturnValue({
        mutate: mockUpdateTodoMutate,
        isPending: true,
        error: null,
      });

      mockTodoRepository.mutations.useDeleteTodo = jest.fn().mockReturnValue({
        mutate: mockDeleteTodoMutate,
        isPending: true,
        error: null,
      });

      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.isCreating).toBe(true);
      expect(result.current.isUpdating).toBe(true);
      expect(result.current.isDeleting).toBe(true);
    });
  });

  describe('Data Source', () => {
    it('should use specified data source', () => {
      renderHook(() => useTodoManagementBusiness('localStorage'));

      expect(mockTodoRepository.queries.useTodos).toHaveBeenCalledWith(mockFilters, 'localStorage');
      expect(mockUseCompletedTodosSelector).toHaveBeenCalledWith('localStorage');
      expect(mockUseTodoStatsSelector).toHaveBeenCalledWith('localStorage');
      expect(mockTodoRepository.mutations.useCreateTodo).toHaveBeenCalledWith('localStorage');
      expect(mockTodoRepository.mutations.useUpdateTodo).toHaveBeenCalledWith('localStorage');
      expect(mockTodoRepository.mutations.useDeleteTodo).toHaveBeenCalledWith('localStorage');
    });

    it('should default to http data source', () => {
      renderHook(() => useTodoManagementBusiness());

      expect(mockTodoRepository.queries.useTodos).toHaveBeenCalledWith(mockFilters, 'http');
    });
  });

  describe('Utilities', () => {
    it('should provide refetch function', () => {
      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(result.current.refetch).toBe(mockRefetch);
    });

    it('should provide getSourceInfo function', () => {
      const { result } = renderHook(() => useTodoManagementBusiness('http'));

      expect(typeof result.current.getSourceInfo).toBe('function');
    });
  });
});
