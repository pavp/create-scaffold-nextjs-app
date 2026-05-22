import { renderWithProviders, screen } from '@test/utils';

import { RightContainer } from './right-container.component';

describe('RightContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    renderWithProviders(
      <RightContainer>
        <div data-testid="test-component" />
      </RightContainer>,
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
