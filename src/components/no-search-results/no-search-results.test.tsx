import { renderWithProviders } from '@test/utils/test-utils';

import { NoSearchResults } from './no-search-results';

const setup = () => {
  const renderComponent = renderWithProviders(<NoSearchResults />);

  return {
    renderComponent,
  };
};

describe('NoSearchResults tests', () => {
  it('should render no results container', () => {
    const { renderComponent } = setup();

    const container = renderComponent.getByTestId('no-results-container');

    expect(container).toBeInTheDocument();
  });

  it('should have no results label', () => {
    const { renderComponent } = setup();

    const noResultsLabel = renderComponent.getByTestId('no-results-label');

    expect(noResultsLabel).toBeInTheDocument();
  });

  it('should have no results icon', () => {
    const { renderComponent } = setup();

    const searchOffIcon = renderComponent.getByTestId('search-off-icon');

    expect(searchOffIcon).toBeInTheDocument();
  });
});
