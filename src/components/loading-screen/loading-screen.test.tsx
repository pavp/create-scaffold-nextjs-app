import { render, screen } from '@test/utils/test-utils';

import { LoadingScreen } from './loading-screen';

describe('LoadingScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not be visible', () => {
    render(<LoadingScreen visible={false} />);

    const loadingScreen = screen.getByTestId('loading-screen');

    expect(loadingScreen).toBeInTheDocument();
    expect(loadingScreen).not.toBeVisible();
  });

  it('should be visible', () => {
    render(<LoadingScreen visible={true} />);

    const loadingScreen = screen.getByTestId('loading-screen');

    expect(loadingScreen).toBeInTheDocument();
    expect(loadingScreen).toBeVisible();
  });
});
