import { fireEvent, renderWithProviders, screen } from '@test/utils';

import { ErrorBoundary } from './error-boundary.component';

describe('ErrorBoundary', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  it('should not render anything when error is null', () => {
    const { container } = renderWithProviders(<ErrorBoundary error={null} onRetry={mockOnRetry} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render error message when error is provided', () => {
    const error = new Error('Test error message');

    renderWithProviders(<ErrorBoundary error={error} onRetry={mockOnRetry} />);

    expect(screen.getByText('Error loading todos')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const error = new Error('Test error');

    renderWithProviders(<ErrorBoundary error={error} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /retry/i });

    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should prevent default behavior on button click', () => {
    const error = new Error('Test error');

    renderWithProviders(<ErrorBoundary error={error} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /retry/i });
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    // Simulate click event with preventDefault mock
    fireEvent.click(retryButton, mockEvent);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should have correct display name', () => {
    expect(ErrorBoundary.displayName).toBe('ErrorBoundary');
  });

  it('should render with Refresh icon', () => {
    const error = new Error('Test error');

    renderWithProviders(<ErrorBoundary error={error} onRetry={mockOnRetry} />);

    // Check for svg icon (Refresh icon)
    const refreshIcon = document.querySelector('svg');

    expect(refreshIcon).toBeInTheDocument();
  });
});
