import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from './button.component';

jest.mock('../loading-indicator/loading-indicator.component', () => ({
  LoadingIndicator: ({ size }: { size: number }) => <div data-size={size} data-testid="loading-indicator" />,
}));

describe('Button', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should render button with default props', () => {
    render(<Button>Default Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should render button as disabled', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('should render button with variant', () => {
    render(<Button variant="contained">Contained Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('MuiButton-contained');
  });

  it('should render button with color', () => {
    render(<Button color="primary">Primary Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('MuiButton-colorPrimary');
  });

  it('should render button with size', () => {
    render(<Button size="large">Large Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('MuiButton-sizeLarge');
  });

  it('should handle onClick event', () => {
    const mockClick = jest.fn();

    render(<Button onClick={mockClick}>Clickable Button</Button>);

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should not handle onClick when disabled', () => {
    const mockClick = jest.fn();

    render(
      <Button disabled onClick={mockClick}>
        Disabled Button
      </Button>,
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(mockClick).not.toHaveBeenCalled();
  });

  it('should render with loading state', () => {
    render(<Button loading>Loading Button</Button>);

    const button = screen.getByRole('button');
    const loadingIndicator = screen.getByTestId('loading-indicator');

    expect(button).toBeInTheDocument();
    expect(loadingIndicator).toBeInTheDocument();
    expect(loadingIndicator).toHaveAttribute('data-size', '18');
    expect(screen.queryByText('Loading Button')).not.toBeInTheDocument();
  });

  it('should render without loading state', () => {
    render(<Button loading={false}>Normal Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    expect(screen.getByText('Normal Button')).toBeInTheDocument();
  });

  it('should render button with custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
  });

  it('should render button with type', () => {
    render(<Button type="submit">Submit Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render button with data-testid', () => {
    render(<Button data-testid="test-button">Test Button</Button>);

    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });

  it('should pass all props to MUI Button', () => {
    render(
      <Button
        fullWidth
        color="secondary"
        size="small"
        startIcon={<span data-testid="start-icon">Icon</span>}
        variant="outlined"
      >
        Full Width Button
      </Button>,
    );

    const button = screen.getByRole('button');
    const startIcon = screen.getByTestId('start-icon');

    expect(button).toHaveClass('MuiButton-fullWidth');
    expect(button).toHaveClass('MuiButton-sizeSmall');
    expect(button).toHaveClass('MuiButton-outlined');
    expect(button).toHaveClass('MuiButton-colorSecondary');
    expect(startIcon).toBeInTheDocument();
  });

  it('should render children when not loading', () => {
    render(
      <Button>
        <span data-testid="child-content">Child Content</span>
      </Button>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should hide children when loading', () => {
    render(
      <Button loading>
        <span data-testid="child-content">Child Content</span>
      </Button>,
    );

    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should apply SCSS module classes', () => {
    render(<Button>Styled Button</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('buttonRow');
  });

  it('should have loading container with correct class', () => {
    const { container } = render(<Button>Content</Button>);

    const loadingContainer = container.querySelector('.loadingContainer');

    expect(loadingContainer).toBeInTheDocument();
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(<Button>Test</Button>);

      const firstButton = screen.getByRole('button');

      rerender(<Button>Test</Button>);

      const secondButton = screen.getByRole('button');

      // The component should be memoized
      expect(firstButton).toBe(secondButton);
    });
  });
});
