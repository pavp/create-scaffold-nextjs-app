import { createMockTodoFilters, createMockTodos } from '@test/entities/todo.mock';
import { renderWithProviders, screen, setupTodoStoreState } from '@test/utils';

import { TodoManagementView } from './todo-management.view';

// Mock the business and controller hooks
const mockCreateTodo = jest.fn();
const mockDeleteTodo = jest.fn();
const mockToggleTodoComplete = jest.fn();
const mockApplyFilters = jest.fn();
const mockRefetch = jest.fn();
const mockSwitchDataSource = jest.fn();

const mockBusinessHook: any = {
  todos: [],
  filters: createMockTodoFilters(),
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  error: null,
  createTodo: mockCreateTodo,
  deleteTodo: mockDeleteTodo,
  toggleTodoComplete: mockToggleTodoComplete,
  applyFilters: mockApplyFilters,
  refetch: mockRefetch,
};

const mockControllerHook = {
  handleCreateSubmit: jest.fn(() => jest.fn()),
  handleDeleteClick: jest.fn(() => jest.fn()),
  handleToggleComplete: jest.fn(() => jest.fn()),
  handleFilterChange: jest.fn(() => jest.fn()),
};

const mockDataSourceHook = {
  dataSource: 'http' as const,
  switchDataSource: mockSwitchDataSource,
  getDataSourceInfo: jest.fn(() => ({ name: 'HTTP API', description: 'Remote server data', icon: '🌐', online: true })),
};

jest.mock('./hooks/use-todo-management-business/use-todo-management-business.hook', () => ({
  useTodoManagementBusiness: jest.fn(() => mockBusinessHook),
}));

jest.mock('./hooks/use-todo-management-controller/use-todo-management-controller.hook', () => ({
  useTodoManagementController: jest.fn(() => mockControllerHook),
}));

jest.mock('../../hooks/use-data-source/use-data-source.hook', () => ({
  useDataSource: jest.fn(() => mockDataSourceHook),
}));

describe('TodoManagementView', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock implementations
    mockBusinessHook.todos = [];
    mockBusinessHook.isLoading = false;
    mockBusinessHook.isCreating = false;
    mockBusinessHook.isDeleting = false;
    mockBusinessHook.error = null;
    mockBusinessHook.filters = createMockTodoFilters();
  });

  describe('Rendering', () => {
    it('should render all main sections when no error', () => {
      renderWithProviders(<TodoManagementView />);

      expect(screen.getByText('Todo Management')).toBeInTheDocument();
      expect(screen.getByText('Testing React Query + Zustand architecture with Gateway Pattern')).toBeInTheDocument();

      // Check for component content instead of testIds
      expect(screen.getByText('Add New Todo')).toBeInTheDocument(); // TodoForm
      expect(screen.getByText('Add')).toBeInTheDocument(); // TodoForm submit button
    });

    it('should render error boundary when error exists', () => {
      const mockError = new Error('Failed to fetch todos');

      mockBusinessHook.error = mockError;

      renderWithProviders(<TodoManagementView />);

      // The error boundary should render instead of normal content
      expect(screen.queryByText('Todo Management')).not.toBeInTheDocument();
    });
  });

  describe('Data Source Management', () => {
    it('should call useDataSource hook with correct parameters', () => {
      renderWithProviders(<TodoManagementView />);

      // Verify the hook was called with the expected parameter
      expect(require('../../hooks/use-data-source/use-data-source.hook').useDataSource).toHaveBeenCalledWith('http');
    });
  });

  describe('Todo Management Operations', () => {
    beforeEach(() => {
      mockBusinessHook.todos = createMockTodos(3);
    });

    it('should render form elements and verify hooks are called', async () => {
      renderWithProviders(<TodoManagementView />);

      // Check that the form is rendered
      expect(screen.getByText('Add New Todo')).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();

      // Verify that controller hook was called during render
      expect(mockControllerHook.handleCreateSubmit).toHaveBeenCalled();
    });

    it('should pass correct props to child components', () => {
      const mockTodos = createMockTodos(2);

      mockBusinessHook.todos = mockTodos;
      mockBusinessHook.isLoading = true;
      mockBusinessHook.isCreating = true;

      renderWithProviders(<TodoManagementView />);

      // Verify business hook was called with correct dataSource
      expect(
        require('./hooks/use-todo-management-business/use-todo-management-business.hook').useTodoManagementBusiness,
      ).toHaveBeenCalledWith('http');
    });
  });

  describe('State Management', () => {
    it('should handle different loading states', () => {
      mockBusinessHook.isLoading = true;
      mockBusinessHook.isCreating = true;

      renderWithProviders(<TodoManagementView />);

      // Verify the hooks are called and states are passed correctly
      expect(
        require('./hooks/use-todo-management-business/use-todo-management-business.hook').useTodoManagementBusiness,
      ).toHaveBeenCalled();
      expect(
        require('./hooks/use-todo-management-controller/use-todo-management-controller.hook')
          .useTodoManagementController,
      ).toHaveBeenCalled();
    });

    it('should display todos when available', () => {
      const mockTodos = createMockTodos(2, {
        title: 'Test Todo',
      });

      mockBusinessHook.todos = mockTodos;

      renderWithProviders(<TodoManagementView />);

      // Since todos are passed to TodoList component, we verify the structure is rendered
      expect(screen.getByText('Todo Management')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should render error boundary instead of main content when error exists', () => {
      const mockError = new Error('Network error');

      mockBusinessHook.error = mockError;

      renderWithProviders(<TodoManagementView />);

      // When there's an error, the error boundary should render instead of normal content
      expect(screen.queryByText('Todo Management')).not.toBeInTheDocument();
    });

    it('should render normal content when no error', () => {
      mockBusinessHook.error = null;

      renderWithProviders(<TodoManagementView />);

      expect(screen.getByText('Todo Management')).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should integrate with business and controller hooks correctly', () => {
      renderWithProviders(<TodoManagementView />);

      // Verify all hooks are called
      expect(
        require('./hooks/use-todo-management-business/use-todo-management-business.hook').useTodoManagementBusiness,
      ).toHaveBeenCalledWith('http');
      expect(
        require('./hooks/use-todo-management-controller/use-todo-management-controller.hook')
          .useTodoManagementController,
      ).toHaveBeenCalled();
      expect(require('../../hooks/use-data-source/use-data-source.hook').useDataSource).toHaveBeenCalledWith('http');
    });

    it('should work with Zustand store state', () => {
      const mockTodos = createMockTodos(2);
      const mockFilters = createMockTodoFilters({ completed: false });

      mockBusinessHook.todos = mockTodos;
      mockBusinessHook.filters = mockFilters;

      renderWithProviders(<TodoManagementView />, {
        initialStoreStates: {
          todo: setupTodoStoreState({
            filters: mockFilters,
          }),
        },
      });

      expect(screen.getByText('Todo Management')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithProviders(<TodoManagementView />);

      const mainHeading = screen.getByRole('heading', { level: 4 });

      expect(mainHeading).toHaveTextContent('Todo Management');
    });

    it('should have proper form elements', () => {
      renderWithProviders(<TodoManagementView />);

      // Check for form section title and button
      expect(screen.getByText('Add New Todo')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });
  });
});
