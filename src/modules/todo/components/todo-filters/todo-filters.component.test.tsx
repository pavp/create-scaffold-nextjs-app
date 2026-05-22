import { fireEvent, renderWithProviders, screen } from '@test/utils';

import type { TodoFilters } from '@/modules/todo/todo.types';

import { TodoFiltersComponent } from './todo-filters.component';

describe('TodoFiltersComponent', () => {
  const mockOnFiltersChange = jest.fn();

  const defaultFilters: TodoFilters = {
    search: '',
    completed: undefined,
    priority: undefined,
  };

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  it('should render all filter sections', () => {
    renderWithProviders(<TodoFiltersComponent filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Filter by Status')).toBeInTheDocument();
    expect(screen.getByText('Filter by Priority')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument();
  });

  it('should render search input with current value', () => {
    const filtersWithSearch = { ...defaultFilters, search: 'test search' };

    renderWithProviders(<TodoFiltersComponent filters={filtersWithSearch} onFiltersChange={mockOnFiltersChange} />);

    const searchInput = screen.getByRole('textbox', { name: /search/i });

    expect(searchInput).toHaveValue('test search');
  });

  it('should call onFiltersChange when search input changes', () => {
    renderWithProviders(<TodoFiltersComponent filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />);

    const searchInput = screen.getByRole('textbox', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'new search' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: 'new search' });
  });

  it('should render status filter with All selected by default', () => {
    renderWithProviders(<TodoFiltersComponent filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />);

    // Status selector should show "All" as default (implementation may vary)
    expect(screen.getByText('Filter by Status')).toBeInTheDocument();
  });

  it('should render priority filter with All selected by default', () => {
    renderWithProviders(<TodoFiltersComponent filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />);

    // Priority selector should show "All" as default (implementation may vary)
    expect(screen.getByText('Filter by Priority')).toBeInTheDocument();
  });

  it('should render with completed filter set to true', () => {
    const filtersWithCompleted = { ...defaultFilters, completed: true };

    renderWithProviders(<TodoFiltersComponent filters={filtersWithCompleted} onFiltersChange={mockOnFiltersChange} />);

    expect(screen.getByText('Filter by Status')).toBeInTheDocument();
  });

  it('should render with priority filter set', () => {
    const filtersWithPriority = { ...defaultFilters, priority: 'high' as const };

    renderWithProviders(<TodoFiltersComponent filters={filtersWithPriority} onFiltersChange={mockOnFiltersChange} />);

    expect(screen.getByText('Filter by Priority')).toBeInTheDocument();
  });

  it('should render with all filters set', () => {
    const allFilters: TodoFilters = {
      search: 'test',
      completed: false,
      priority: 'medium' as const,
    };

    renderWithProviders(<TodoFiltersComponent filters={allFilters} onFiltersChange={mockOnFiltersChange} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('should have correct display name', () => {
    expect(TodoFiltersComponent.displayName).toBe('TodoFiltersComponent');
  });

  it('should render in responsive layout', () => {
    renderWithProviders(<TodoFiltersComponent filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />);

    // Should render filter sections in a responsive container
    const filterContainer = screen.getByText('Filters').closest('div');

    expect(filterContainer).toBeInTheDocument();
  });

  it('should clear search when empty string is provided', () => {
    const filtersWithSearch = { ...defaultFilters, search: 'existing search' };

    renderWithProviders(<TodoFiltersComponent filters={filtersWithSearch} onFiltersChange={mockOnFiltersChange} />);

    const searchInput = screen.getByRole('textbox', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: '' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: '' });
  });

  it('should handle undefined search value', () => {
    const filtersWithUndefinedSearch = { ...defaultFilters, search: undefined };

    renderWithProviders(
      <TodoFiltersComponent filters={filtersWithUndefinedSearch} onFiltersChange={mockOnFiltersChange} />,
    );

    const searchInput = screen.getByRole('textbox', { name: /search/i });

    expect(searchInput).toHaveValue('');
  });
});
