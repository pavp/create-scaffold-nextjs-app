import { renderWithProviders, screen } from '@test/utils';

import { NoSearchResults } from './no-search-results.component';

describe('NoSearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render no results container', () => {
    renderWithProviders(<NoSearchResults />);

    const container = screen.getByTestId('no-results-container');

    expect(container).toBeInTheDocument();
  });

  it('should render no results label', () => {
    renderWithProviders(<NoSearchResults />);

    const noResultsLabel = screen.getByTestId('no-results-label');

    expect(noResultsLabel).toBeInTheDocument();
  });

  it('should render no results icon', () => {
    renderWithProviders(<NoSearchResults />);

    const searchOffIcon = screen.getByTestId('search-off-icon');

    expect(searchOffIcon).toBeInTheDocument();
  });

  it('should render all elements together', () => {
    renderWithProviders(<NoSearchResults />);

    expect(screen.getByTestId('no-results-container')).toBeInTheDocument();
    expect(screen.getByTestId('no-results-label')).toBeInTheDocument();
    expect(screen.getByTestId('search-off-icon')).toBeInTheDocument();
  });
});
