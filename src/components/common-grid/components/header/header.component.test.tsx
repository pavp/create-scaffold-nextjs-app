import { faker } from '@faker-js/faker';
import { act, fireEvent, renderWithProviders, screen } from '@test/utils';

import { Header } from './header.component';

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    renderWithProviders(
      <Header>
        <div data-testid="test-component" />
      </Header>,
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('should render title', () => {
    const title = faker.lorem.word();

    renderWithProviders(<Header title={title} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('should render goBackButton enabled by default and handle click', () => {
    const title = faker.lorem.word();
    const goBackSpy = jest.fn();

    renderWithProviders(<Header showGoBackButton title={title} onClickGoBack={goBackSpy} />);
    const goBackButton = screen.getByTestId('go-back-button');

    expect(goBackButton).toBeInTheDocument();
    expect(goBackButton).toBeEnabled();

    act(() => {
      fireEvent.click(goBackButton);
    });

    expect(goBackSpy).toHaveBeenCalledTimes(1);
  });

  it('should render goBackButton disabled when disableGoBackButton is true', () => {
    const title = faker.lorem.word();

    renderWithProviders(<Header disableGoBackButton showGoBackButton title={title} />);

    const goBackButton = screen.getByTestId('go-back-button');

    expect(goBackButton).toBeInTheDocument();
    expect(goBackButton).not.toBeEnabled();
  });

  it('should not render icons by default', () => {
    renderWithProviders(<Header />);

    expect(screen.queryByTestId('icon-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-change-order-by-recent')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-change-order-alphabetically')).not.toBeInTheDocument();
  });

  it('should render icons and call on change functions', () => {
    const onClickChangeOrderAlphabeticallyMock = jest.fn();
    const onClickChangeOrderByRecentMock = jest.fn();

    renderWithProviders(
      <Header
        showIcons
        onClickChangeOrderAlphabetically={onClickChangeOrderAlphabeticallyMock}
        onClickChangeOrderByRecent={onClickChangeOrderByRecentMock}
      />,
    );

    const changeOrderRecentIcon = screen.getByTestId('icon-change-order-by-recent');
    const changeOrderAlphIcon = screen.getByTestId('icon-change-order-alphabetically');

    expect(screen.getByTestId('icon-container')).toBeInTheDocument();
    expect(changeOrderRecentIcon).toBeInTheDocument();
    expect(changeOrderAlphIcon).toBeInTheDocument();

    fireEvent.click(changeOrderRecentIcon);
    expect(onClickChangeOrderByRecentMock).toHaveBeenCalled();

    fireEvent.click(changeOrderAlphIcon);
    expect(onClickChangeOrderAlphabeticallyMock).toHaveBeenCalled();
  });

  it('should render change order by recent icon as active', () => {
    renderWithProviders(<Header showIcons />);

    const changeOrderRecentIcon = screen.getByTestId('icon-change-order-by-recent');

    expect(changeOrderRecentIcon).toBeInTheDocument();
    expect(changeOrderRecentIcon).toHaveClass('active');
  });
});
