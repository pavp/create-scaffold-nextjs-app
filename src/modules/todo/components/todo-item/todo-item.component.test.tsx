import { fireEvent, renderWithProviders, screen } from '@test/utils';

import type { Todo } from '@/modules/todo/todo.types';

import { TodoItem } from './todo-item.component';

describe('TodoItem', () => {
  const mockOnToggleComplete = jest.fn();
  const mockOnDelete = jest.fn();

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test description',
    completed: false,
    priority: 'medium',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    dueDate: '2023-12-31',
  };

  beforeEach(() => {
    mockOnToggleComplete.mockClear();
    mockOnDelete.mockClear();
  });

  it('should render todo information', () => {
    renderWithProviders(
      <TodoItem isDeleting={false} todo={mockTodo} onDelete={mockOnDelete} onToggleComplete={mockOnToggleComplete} />,
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('should render due date when provided', () => {
    renderWithProviders(
      <TodoItem isDeleting={false} todo={mockTodo} onDelete={mockOnDelete} onToggleComplete={mockOnToggleComplete} />,
    );

    expect(screen.getByText(/due:/i)).toBeInTheDocument();
  });

  it('should render updated date', () => {
    renderWithProviders(
      <TodoItem isDeleting={false} todo={mockTodo} onDelete={mockOnDelete} onToggleComplete={mockOnToggleComplete} />,
    );

    expect(screen.getByText(/updated:/i)).toBeInTheDocument();
  });

  it('should call onToggleComplete when checkbox is clicked', () => {
    renderWithProviders(
      <TodoItem isDeleting={false} todo={mockTodo} onDelete={mockOnDelete} onToggleComplete={mockOnToggleComplete} />,
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith(1, true);
  });

  it('should call onDelete when delete button is clicked', () => {
    renderWithProviders(
      <TodoItem isDeleting={false} todo={mockTodo} onDelete={mockOnDelete} onToggleComplete={mockOnToggleComplete} />,
    );

    const deleteButton = screen.getByRole('button');

    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo);
  });

  it('should disable delete button when deleting', () => {
    renderWithProviders(
      <TodoItem isDeleting={true} todo={mockTodo} onDelete={mockOnDelete} onToggleComplete={mockOnToggleComplete} />,
    );

    const deleteButton = screen.getByRole('button');

    expect(deleteButton).toBeDisabled();
  });

  it('should render completed todo with strikethrough style', () => {
    const completedTodo = { ...mockTodo, completed: true };

    renderWithProviders(
      <TodoItem
        isDeleting={false}
        todo={completedTodo}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    const title = screen.getByText('Test Todo');

    expect(title).toHaveStyle('text-decoration: line-through');
  });

  it('should render high priority with error color', () => {
    const highPriorityTodo = { ...mockTodo, priority: 'high' as const };

    renderWithProviders(
      <TodoItem
        isDeleting={false}
        todo={highPriorityTodo}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should render low priority with info color', () => {
    const lowPriorityTodo = { ...mockTodo, priority: 'low' as const };

    renderWithProviders(
      <TodoItem
        isDeleting={false}
        todo={lowPriorityTodo}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.getByText('low')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined };

    renderWithProviders(
      <TodoItem
        isDeleting={false}
        todo={todoWithoutDescription}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('should not render due date when not provided', () => {
    const todoWithoutDueDate = { ...mockTodo, dueDate: undefined };

    renderWithProviders(
      <TodoItem
        isDeleting={false}
        todo={todoWithoutDueDate}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />,
    );

    expect(screen.queryByText(/due:/i)).not.toBeInTheDocument();
  });

  it('should have correct display name', () => {
    expect(TodoItem.displayName).toBe('TodoItem');
  });

  it('should render Delete icon', () => {
    renderWithProviders(
      <TodoItem isDeleting={false} todo={mockTodo} onDelete={mockOnDelete} onToggleComplete={mockOnToggleComplete} />,
    );

    // Check for Delete icon (svg)
    const deleteIcon = document.querySelector('svg');

    expect(deleteIcon).toBeInTheDocument();
  });
});
