import { render, screen } from '@testing-library/react';

import { Badge } from './badge.component';

describe('Badge', () => {
  it('should render badge with children', () => {
    render(
      <Badge>
        <div data-testid="badge-child">Child content</div>
      </Badge>,
    );

    expect(screen.getByTestId('badge-child')).toBeInTheDocument();
  });

  it('should render badge with default styles', () => {
    const { container } = render(
      <Badge>
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('MuiBadge-badge');
  });

  it('should render with custom color', () => {
    const { container } = render(
      <Badge color="primary">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-colorPrimary');
  });

  it('should render with secondary color', () => {
    const { container } = render(
      <Badge color="secondary">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-colorSecondary');
  });

  it('should render with error color', () => {
    const { container } = render(
      <Badge color="error">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-colorError');
  });

  it('should render with success color', () => {
    const { container } = render(
      <Badge color="success">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-colorSuccess');
  });

  it('should render with warning color', () => {
    const { container } = render(
      <Badge color="warning">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-colorWarning');
  });

  it('should render with info color', () => {
    const { container } = render(
      <Badge color="info">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-colorInfo');
  });

  it('should render with rectangular overlap', () => {
    const { container } = render(
      <Badge overlap="rectangular">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-overlapRectangular');
  });

  it('should render with circular overlap', () => {
    const { container } = render(
      <Badge overlap="circular">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-overlapCircular');
  });

  it('should render with standard variant', () => {
    const { container } = render(
      <Badge variant="standard">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-standard');
  });

  it('should render with dot variant', () => {
    const { container } = render(
      <Badge variant="dot">
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-dot');
  });

  it('should render as invisible when invisible prop is true', () => {
    const { container } = render(
      <Badge invisible>
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveClass('MuiBadge-invisible');
  });

  it('should render as visible when invisible prop is false', () => {
    const { container } = render(
      <Badge invisible={false}>
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).not.toHaveClass('MuiBadge-invisible');
  });

  it('should apply custom sx styles', () => {
    const customSx = {
      span: {
        backgroundColor: 'red',
        width: 20,
        height: 20,
      },
    };

    const { container } = render(
      <Badge sx={customSx}>
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toBeInTheDocument();
  });

  it('should use default sx when sx prop is not provided', () => {
    const { container } = render(
      <Badge>
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    render(
      <Badge anchorOrigin={{ vertical: 'top', horizontal: 'right' }} data-testid="custom-badge">
        <div>Content</div>
      </Badge>,
    );

    const badge = screen.getByTestId('custom-badge');

    expect(badge).toBeInTheDocument();
  });

  it('should render with empty badge content', () => {
    const { container } = render(
      <Badge>
        <div>Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');

    expect(badge).toHaveTextContent('');
  });

  it('should combine all props correctly', () => {
    const { container } = render(
      <Badge color="primary" invisible={false} overlap="circular" variant="dot">
        <div data-testid="child">Content</div>
      </Badge>,
    );

    const badge = container.querySelector('.MuiBadge-badge');
    const child = screen.getByTestId('child');

    expect(badge).toHaveClass('MuiBadge-colorPrimary');
    expect(badge).toHaveClass('MuiBadge-overlapCircular');
    expect(badge).toHaveClass('MuiBadge-dot');
    expect(badge).not.toHaveClass('MuiBadge-invisible');
    expect(child).toBeInTheDocument();
  });
});
