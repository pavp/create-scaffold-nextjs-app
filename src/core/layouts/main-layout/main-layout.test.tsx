import React, { ReactNode } from 'react';
import { render } from '@test/utils/test-utils';

import { MainLayout } from './main-layout';

const LEFT_SIDEBAR_MOCK_TEST_ID = 'LEFT_SIDEBAR_MOCK_TEST_ID';
const CONTEXT_FILTER_MOCK_TEST_ID = 'CONTEXT_FILTER_MOCK_TEST_ID';

jest.mock('@/components', () => {
  return {
    LeftSidebar: () => <div data-testid={LEFT_SIDEBAR_MOCK_TEST_ID} />,
    ContextFilter: () => <div data-testid={CONTEXT_FILTER_MOCK_TEST_ID} />,
  };
});

const MOCK_CHILDREN_TEST_ID = 'MOCK_CHILDREN_TEST_ID';
const MOCK_CHILDREN: ReactNode = <div data-testid={MOCK_CHILDREN_TEST_ID} />;

const MOCK_ACTIONS_TEST_ID = 'MOCK_ACTIONS_TEST_ID';
const MOCK_ACTIONS: ReactNode = <div data-testid={MOCK_ACTIONS_TEST_ID} />;

interface SetupProps {
  actions?: ReactNode;
}
const setup = ({ actions }: SetupProps) => {
  const context = render(<MainLayout actions={actions}>{MOCK_CHILDREN}</MainLayout>);

  return { context };
};

describe('MainLayout tests', () => {
  it('should render all expected elements', () => {
    const utils = setup({});

    expect(utils.context.getByTestId('main-layout-container')).toBeInTheDocument();
    expect(utils.context.getByTestId(LEFT_SIDEBAR_MOCK_TEST_ID)).toBeInTheDocument();
    expect(utils.context.getByTestId('main-layout-right-content')).toBeInTheDocument();
    expect(utils.context.getByTestId('main-layout-header-container')).toBeInTheDocument();
    expect(utils.context.getByTestId('main-layout-header-left')).toBeInTheDocument();
    expect(utils.context.getByTestId(CONTEXT_FILTER_MOCK_TEST_ID)).toBeInTheDocument();
    expect(utils.context.getByTestId('main-layout-header-right')).toBeInTheDocument();
    expect(utils.context.queryByTestId(MOCK_ACTIONS_TEST_ID)).not.toBeInTheDocument();
    expect(utils.context.getByTestId('main-layout-children-container')).toBeInTheDocument();
    expect(utils.context.getByTestId(MOCK_CHILDREN_TEST_ID)).toBeInTheDocument();
  });

  it('should render actions if provided', () => {
    const utils = setup({ actions: MOCK_ACTIONS });

    expect(utils.context.getByTestId(MOCK_ACTIONS_TEST_ID)).toBeInTheDocument();
  });
});
