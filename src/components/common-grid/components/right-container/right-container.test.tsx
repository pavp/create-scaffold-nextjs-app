import { renderWithProviders, screen } from '@test/utils/test-utils';

import { RightContainer } from '..';

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
