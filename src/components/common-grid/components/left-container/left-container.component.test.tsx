import { renderWithProviders, screen } from '@test/utils';

import { LeftContainer } from './left-container.component';

describe('LeftContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    renderWithProviders(
      <LeftContainer>
        <div data-testid="test-component" />
      </LeftContainer>,
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
