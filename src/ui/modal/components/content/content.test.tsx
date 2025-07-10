import { Box } from '@mui/material';
import { renderWithProviders } from '@test/utils/test-utils';

import { Content } from '..';

const setup = () => {
  const renderComponent = renderWithProviders(
    <Content>
      <Box />
    </Content>,
  );

  return {
    renderComponent,
  };
};

describe('Modal tests', () => {
  it('should render container and have box with test id container', () => {
    const { renderComponent } = setup();

    const container = renderComponent.getByTestId('container-content');

    expect(container).toBeInTheDocument();
  });
});
