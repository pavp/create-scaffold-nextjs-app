import { renderWithProviders, screen } from '@test/utils/test-utils';

import { BottomContainer } from '..';

describe('BottomContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    renderWithProviders(
      <BottomContainer>
        <div data-testid="test-component" />
      </BottomContainer>,
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
