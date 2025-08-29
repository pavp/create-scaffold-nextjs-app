import { fireEvent, renderWithProviders, screen } from '@test/utils';

import { Pagination } from './pagination.component';

describe('Pagination', () => {
  const defaultProps = {
    totalPages: 4,
    page: 1,
    onChangePage: jest.fn(),
  };

  it('should displays correct number of pages', () => {
    renderWithProviders(<Pagination {...defaultProps} />);

    const pageButtons = screen.getAllByRole('button');

    expect(pageButtons.length).toBe(defaultProps.totalPages + 2);
  });

  it('should calls onChangePage when a page is clicked', () => {
    renderWithProviders(<Pagination {...defaultProps} />);

    const pageButton = screen.getByText('2');

    fireEvent.click(pageButton);

    expect(defaultProps.onChangePage).toHaveBeenCalledWith(2);
  });

  it('should not render if totalPages is 1 or less', () => {
    const { container } = renderWithProviders(<Pagination {...defaultProps} totalPages={1} />);

    expect(container.firstChild).toBeNull();
  });
});
