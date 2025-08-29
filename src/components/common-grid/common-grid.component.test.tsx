import { renderWithProviders, screen } from '@test/utils';

import { Box } from '@/ui';

import { CommonGrid } from './common-grid.component';

describe('CommonGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    renderWithProviders(
      <CommonGrid>
        <Box data-testid="test-component" />
      </CommonGrid>,
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
