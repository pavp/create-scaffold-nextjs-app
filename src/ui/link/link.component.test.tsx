import { render, screen } from '@testing-library/react';

import { Link } from './link.component';

jest.mock('next/link', () => {
  const MockedNextLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );

  MockedNextLink.displayName = 'NextLink';

  return MockedNextLink;
});

describe('Link', () => {
  it('should render link with children', () => {
    render(<Link href="/test">Link Text</Link>);

    const link = screen.getByRole('link', { name: 'Link Text' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should render link with default empty href', () => {
    render(<Link>Empty Href Link</Link>);

    const link = screen.getByText('Empty Href Link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '');
  });

  it('should pass through MUI Link props', () => {
    render(
      <Link color="secondary" href="/test" underline="always">
        Styled Link
      </Link>,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveClass('MuiLink-underlineAlways');
  });

  it('should render with custom data-testid', () => {
    render(
      <Link data-testid="custom-link" href="/test">
        Test Link
      </Link>,
    );

    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(
      <Link className="custom-class" href="/test">
        Custom Class Link
      </Link>,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveClass('custom-class');
  });

  it('should render with different variants', () => {
    render(
      <Link href="/test" variant="h6">
        Header Link
      </Link>,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveClass('MuiTypography-h6');
  });

  it('should render with different underline options', () => {
    render(
      <Link href="/test" underline="none">
        No Underline Link
      </Link>,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveClass('MuiLink-underlineNone');
  });

  it('should have correct display name', () => {
    expect(Link.displayName).toBe('Link');
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };

    render(
      <Link ref={ref} href="/test">
        Ref Link
      </Link>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('should render with complex children', () => {
    render(
      <Link href="/test">
        <span data-testid="child-span">Complex</span> Link Content
      </Link>,
    );

    expect(screen.getByTestId('child-span')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveTextContent('Complex Link Content');
  });
});
