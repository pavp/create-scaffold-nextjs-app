import { renderWithProviders, screen } from '@test/utils';

import { LoadingScreen } from './loading-screen.component';

describe('LoadingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not be visible when visible prop is false', () => {
    const visible = false;

    renderWithProviders(<LoadingScreen visible={visible} />);

    const loadingScreen = screen.getByTestId('loading-screen');

    expect(loadingScreen).toBeInTheDocument();
    expect(loadingScreen).not.toBeVisible();
  });

  it('should be visible when visible prop is true', () => {
    const visible = true;

    renderWithProviders(<LoadingScreen visible={visible} />);

    const loadingScreen = screen.getByTestId('loading-screen');

    expect(loadingScreen).toBeInTheDocument();
    expect(loadingScreen).toBeVisible();
  });
});
