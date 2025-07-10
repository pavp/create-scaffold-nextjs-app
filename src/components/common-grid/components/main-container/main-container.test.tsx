import { renderWithProviders, screen } from '@test/utils/test-utils';

import { MainContainer } from '..';

describe('MainContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    renderWithProviders(
      <MainContainer>
        <div data-testid="test-component" />
      </MainContainer>,
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
