import { renderWithProviders } from '@test/utils/test-utils';

import { Modal } from '..';

const setup = (isVisible: boolean = true) => {
  const renderComponent = renderWithProviders(<Modal handleClose={jest.fn()} isVisible={isVisible} />);

  return {
    renderComponent,
  };
};

describe('Modal tests', () => {
  it('should render modal and have container', () => {
    const { renderComponent } = setup();

    const modalMui = renderComponent.getByTestId('modal-mui');
    const container = renderComponent.getByTestId('container');

    expect(modalMui).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('should not be visible if visible is false', () => {
    const { renderComponent } = setup(false);

    const modalMui = renderComponent.queryByTestId('modal-mui');
    const container = renderComponent.queryByTestId('container');

    expect(modalMui).not.toBeInTheDocument();
    expect(container).not.toBeInTheDocument();
  });
});
