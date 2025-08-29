import { renderWithProviders, screen } from '@test/utils';

import { MainContainer } from './main-container.component';

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
