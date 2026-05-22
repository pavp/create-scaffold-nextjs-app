import { renderWithProviders, screen } from '@test/utils';

import { AuthLoading } from './auth-loading.component';

describe('AuthLoading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not be visible when visible prop is false', () => {
    const visible = false;

    renderWithProviders(<AuthLoading visible={visible} />);

    const loadingAuth = screen.getByTestId('loading-screen');

    expect(loadingAuth).toBeInTheDocument();
    expect(loadingAuth).not.toBeVisible();
  });

  it('should be visible when visible prop is true', () => {
    const visible = true;

    renderWithProviders(<AuthLoading visible={visible} />);

    const loadingAuth = screen.getByTestId('loading-screen');

    expect(loadingAuth).toBeInTheDocument();
    expect(loadingAuth).toBeVisible();
  });
});
