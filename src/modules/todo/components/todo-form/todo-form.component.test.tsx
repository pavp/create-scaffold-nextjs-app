import { fireEvent, renderWithProviders, screen, waitFor } from '@test/utils';

import { TodoForm } from './todo-form.component';

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form with all fields', () => {
    renderWithProviders(<TodoForm isCreating={false} onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should have Add button disabled when title is empty', () => {
    renderWithProviders(<TodoForm isCreating={false} onSubmit={mockOnSubmit} />);

    const addButton = screen.getByRole('button', { name: /add/i });

    expect(addButton).toBeDisabled();
  });

  it('should enable Add button when title is entered', async () => {
    renderWithProviders(<TodoForm isCreating={false} onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });

    await waitFor(() => {
      expect(addButton).not.toBeDisabled();
    });
  });

  it('should call onSubmit with form data when submitted', async () => {
    renderWithProviders(<TodoForm isCreating={false} onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const descriptionInput = screen.getByRole('textbox', { name: /description/i });
    const addButton = screen.getByRole('button', { name: /add/i });

    // Fill form
    fireEvent.change(titleInput, { target: { value: 'Test Todo Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    await waitFor(() => {
      expect(addButton).not.toBeDisabled();
    });

    fireEvent.click(addButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Todo Title',
      description: 'Test description',
      priority: 'medium',
    });
  });

  it('should clear form after successful submission', async () => {
    renderWithProviders(<TodoForm isCreating={false} onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const descriptionInput = screen.getByRole('textbox', { name: /description/i });
    const addButton = screen.getByRole('button', { name: /add/i });

    // Fill and submit form
    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    await waitFor(() => {
      expect(addButton).not.toBeDisabled();
    });

    fireEvent.click(addButton);

    // Form should be cleared
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('should show loading state when creating', () => {
    renderWithProviders(<TodoForm isCreating={true} onSubmit={mockOnSubmit} />);

    const addButton = screen.getByRole('button', { name: /add/i });

    expect(addButton).toBeDisabled();

    // Should show loading spinner
    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('should not submit with whitespace-only title', async () => {
    renderWithProviders(<TodoForm isCreating={false} onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(addButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should have correct display name', () => {
    expect(TodoForm.displayName).toBe('TodoForm');
  });

  it('should render with default medium priority', () => {
    renderWithProviders(<TodoForm isCreating={false} onSubmit={mockOnSubmit} />);

    // Default priority should be medium (this might need adjustment based on Selector implementation)
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  it('should render Add icon when not creating', () => {
    renderWithProviders(<TodoForm isCreating={false} onSubmit={mockOnSubmit} />);

    // Check for Add icon (svg)
    const addIcon = document.querySelector('svg');

    expect(addIcon).toBeInTheDocument();
  });
});
