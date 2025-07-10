import { renderWithProviders, screen } from '@test/utils/test-utils';

import { LeftContainer } from '..';

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
