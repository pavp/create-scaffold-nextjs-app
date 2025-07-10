import { renderWithProviders } from '@test/utils/test-utils';

import { useContextStore } from '@/store/context/hooks';

import { CustomerData } from './customer-data';

const CUSTOMER_DATA_ITEM_MOCK_TEST_ID = 'CUSTOMER_DATA_ITEM_MOCK_TEST_ID';

jest.mock('./components/customer-data-item/customer-data-item', () => {
  return {
    CustomerDataItem: () => <div data-testid={CUSTOMER_DATA_ITEM_MOCK_TEST_ID} />,
  };
});

jest.mock('@/store/context/hooks');
const mockUseContextStore = useContextStore as jest.MockedFunction<typeof useContextStore>;

const setup = () => {
  mockUseContextStore.mockImplementation(() => {
    return {
      customerName: '',
      companyName: '',
    } as any;
  });

  const context = renderWithProviders(<CustomerData />);

  return { context };
};

describe('CustomerData Component', () => {
  it('should render elements', () => {
    const { context } = setup();

    expect(context.getByTestId('customer-data-container')).toBeInTheDocument();
    expect(context.getAllByTestId(CUSTOMER_DATA_ITEM_MOCK_TEST_ID).length).toBe(2);
  });
});
