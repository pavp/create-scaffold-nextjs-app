import { renderWithProviders, screen } from '@test/utils';
import { redirect } from 'next/navigation';

import { AuthProvider } from './auth-provider.component';

// Mock AuthLoading component
jest.mock('@/components/auth-loading/auth-loading.component', () => ({
  AuthLoading: ({ visible }: { visible: boolean }) => (
    <div data-testid="auth-loading" style={{ display: visible ? 'block' : 'none' }} />
  ),
}));

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when authenticated', () => {
    const testChild = <div data-testid="test-child">Test Content</div>;

    renderWithProviders(<AuthProvider>{testChild}</AuthProvider>);

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-loading')).not.toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should render children without errors', () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </>
    );

    renderWithProviders(<AuthProvider>{multipleChildren}</AuthProvider>);

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
