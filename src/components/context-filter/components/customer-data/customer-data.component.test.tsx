import { renderWithProviders, screen } from '@test/utils';

import { CustomerData } from './customer-data.component';

const CUSTOMER_DATA_ITEM_MOCK_TEST_ID = 'CUSTOMER_DATA_ITEM_MOCK_TEST_ID';

jest.mock('./components/customer-data-item/customer-data-item.component', () => {
  return {
    CustomerDataItem: () => <div data-testid={CUSTOMER_DATA_ITEM_MOCK_TEST_ID} />,
  };
});

describe('CustomerData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render customer data container', () => {
    renderWithProviders(<CustomerData />);

    expect(screen.getByTestId('customer-data-container')).toBeInTheDocument();
  });

  it('should render customer data items', () => {
    renderWithProviders(<CustomerData />);

    const customerDataItems = screen.getAllByTestId(CUSTOMER_DATA_ITEM_MOCK_TEST_ID);

    expect(customerDataItems).toHaveLength(2);
  });

  it('should render all elements together', () => {
    renderWithProviders(<CustomerData />);

    expect(screen.getByTestId('customer-data-container')).toBeInTheDocument();
    expect(screen.getAllByTestId(CUSTOMER_DATA_ITEM_MOCK_TEST_ID)).toHaveLength(2);
  });
});
