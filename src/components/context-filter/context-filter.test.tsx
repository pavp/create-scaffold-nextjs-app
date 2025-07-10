import React from 'react';
import { renderWithProviders } from '@test/utils/test-utils';

import { useContextStore } from '@/store/context/hooks';

import { ContextFilter } from './context-filter';

const CUSTOMER_DATA_MOCK_TEST_ID = 'CUSTOMER_DATA_MOCK_TEST_ID';

jest.mock('./components', () => {
  return {
    CustomerData: () => <div data-testid={CUSTOMER_DATA_MOCK_TEST_ID} />,
  };
});

jest.mock('@/store/context/hooks');
const mockUseContextStore = useContextStore as jest.MockedFunction<typeof useContextStore>;

const setup = (showCustomerData = false) => {
  const username = 'user name';

  mockUseContextStore.mockImplementation(() => {
    return {
      user: { username },
    } as any;
  });

  const context = renderWithProviders(<ContextFilter showCustomerData={showCustomerData} />);

  return { context, username };
};

describe('ContextFilter tests', () => {
  it('should render all expected elements', () => {
    const { context } = setup(true);

    expect(context.getByTestId('user-context')).toBeInTheDocument();
    expect(context.getByTestId('user-context-user')).toBeInTheDocument();
    expect(context.getByTestId(CUSTOMER_DATA_MOCK_TEST_ID)).toBeInTheDocument();
  });

  it('should render user icon and name', () => {
    const { context, username } = setup();

    const usernameProperty = context.getByTestId('user-context-user-name');

    expect(context.getByTestId('user-context-user-icon')).toBeInTheDocument();
    expect(usernameProperty).toBeInTheDocument();
    expect(usernameProperty).toHaveTextContent(username);
  });

  it('should not render customer data if not required', () => {
    const { context } = setup();

    expect(context.queryByTestId(CUSTOMER_DATA_MOCK_TEST_ID)).toBeNull();
  });
});
