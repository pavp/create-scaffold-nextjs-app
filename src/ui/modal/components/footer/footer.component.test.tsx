import { Box } from '@mui/material';
import { renderWithProviders } from '@test/utils';

import { Footer } from '..';

const setup = () => {
  const renderComponent = renderWithProviders(
    <Footer>
      <Box />
    </Footer>,
  );

  return {
    renderComponent,
  };
};

describe('Modal tests', () => {
  it('should render footer and have box with test id container', () => {
    const { renderComponent } = setup();

    const container = renderComponent.getByTestId('footer-container');

    expect(container).toBeInTheDocument();
  });
});
