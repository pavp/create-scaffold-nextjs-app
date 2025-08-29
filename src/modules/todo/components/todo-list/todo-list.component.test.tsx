import { fireEvent, renderWithProviders, screen } from '@test/utils';

import type { Todo } from '@/modules/todo/todo.types';

import { TodoList } from './todo-list.component';

describe('TodoList', () => {
  const mockOnRefresh = jest.fn();
  const mockOnToggleComplete = jest.fn();
  const mockOnDelete = jest.fn();

  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'First Todo',
      description: 'First description',
      completed: false,
      priority: 'high',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Second Todo',
      description: 'Second description',
      completed: true,
      priority: 'medium',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    mockOnRefresh.mockClear();
    mockOnToggleComplete.mockClear();
    mockOnDelete.mockClear();
  });

  it('should render todos count in header', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={false}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.getByText('Todos (2)')).toBeInTheDocument();
  });

  it('should render refresh button', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={false}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('should call onRefresh when refresh button is clicked', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={false}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });

    fireEvent.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('should render all todos when not loading', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={false}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={true}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('should disable refresh button when loading', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={true}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });

    expect(refreshButton).toBeDisabled();
  });

  it('should show empty state when no todos', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={false}
        todos={[]}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.getByText('No todos found. Create your first todo above!')).toBeInTheDocument();
  });

  it('should not show todos when loading', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={true}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.queryByText('First Todo')).not.toBeInTheDocument();
    expect(screen.queryByText('Second Todo')).not.toBeInTheDocument();
  });

  it('should pass props correctly to TodoItem components', () => {
    renderWithProviders(
      <TodoList
        isDeleting={true}
        isLoading={false}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    // TodoItems should receive the isDeleting prop and render accordingly
    const deleteButtons = screen.getAllByRole('button').filter((button) => !button.textContent?.includes('Refresh'));

    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled(); // Should be disabled due to isDeleting=true
    });
  });

  it('should have correct display name', () => {
    expect(TodoList.displayName).toBe('TodoList');
  });

  it('should render Refresh icon when not loading', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={false}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    // Check for Refresh icon (svg)
    const refreshIcon = document.querySelector('svg');

    expect(refreshIcon).toBeInTheDocument();
  });

  it('should render loading spinner in refresh button when loading', () => {
    renderWithProviders(
      <TodoList
        isDeleting={false}
        isLoading={true}
        todos={mockTodos}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    // Should show CircularProgress in refresh button
    const progressElements = document.querySelectorAll('.MuiCircularProgress-root');

    expect(progressElements.length).toBeGreaterThan(0);
  });
});
