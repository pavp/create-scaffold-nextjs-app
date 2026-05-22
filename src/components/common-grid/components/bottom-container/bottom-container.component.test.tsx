import { renderWithProviders, screen } from '@test/utils';

import { BottomContainer } from './bottom-container.component';

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
