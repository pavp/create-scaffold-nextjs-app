import { render, screen } from '@test/utils/test-utils';

import { AuthLoading } from './auth-loading';

describe('AuthLoading Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not be visible', () => {
    render(<AuthLoading visible={false} />);

    const loadingAuth = screen.getByTestId('loading-screen');

    expect(loadingAuth).toBeInTheDocument();
    expect(loadingAuth).not.toBeVisible();
  });

  it('should be visible', () => {
    render(<AuthLoading visible={true} />);

    const loadingAuth = screen.getByTestId('loading-screen');

    expect(loadingAuth).toBeInTheDocument();
    expect(loadingAuth).toBeVisible();
  });
});
