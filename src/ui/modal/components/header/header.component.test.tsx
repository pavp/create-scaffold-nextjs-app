import { faker } from '@faker-js/faker';
import { renderWithProviders } from '@test/utils';

import { Header } from '..';

const setup = (headerTitle: string) => {
  const renderComponent = renderWithProviders(<Header handleClick={jest.fn()} title={headerTitle} />);

  return {
    renderComponent,
  };
};

describe('Modal tests', () => {
  const headerTitle = faker.word.words();

  it('should render header and have box with test id container', () => {
    const { renderComponent } = setup(headerTitle);

    const container = renderComponent.getByTestId('header-container');

    expect(container).toBeInTheDocument();
  });

  it('should have header-title and header-button', () => {
    const { renderComponent } = setup(headerTitle);

    const title = renderComponent.getByTestId('header-title');
    const button = renderComponent.getByTestId('header-button');

    expect(title).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should header-title be the same than mocked', () => {
    const { renderComponent } = setup(headerTitle);

    const title = renderComponent.getByTestId('header-title');

    expect(title.textContent).toBe(headerTitle);
  });

  it('should icon-button have class iconButton', () => {
    const { renderComponent } = setup(headerTitle);

    const button = renderComponent.getByTestId('header-button');

    expect(button).toHaveClass('iconButton');
  });
});
