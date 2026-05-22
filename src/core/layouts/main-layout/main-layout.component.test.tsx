import React, { ReactNode } from 'react';
import { renderWithProviders, screen } from '@test/utils';

import { MainLayout } from './main-layout.component';

const LEFT_SIDEBAR_MOCK_TEST_ID = 'LEFT_SIDEBAR_MOCK_TEST_ID';
const CONTEXT_FILTER_MOCK_TEST_ID = 'CONTEXT_FILTER_MOCK_TEST_ID';

jest.mock('@/components/left-sidebar/left-sidebar.component', () => {
  return {
    LeftSidebar: () => <div data-testid={LEFT_SIDEBAR_MOCK_TEST_ID} />,
  };
});

jest.mock('@/components/context-filter/context-filter.component', () => {
  return {
    ContextFilter: () => <div data-testid={CONTEXT_FILTER_MOCK_TEST_ID} />,
  };
});

const MOCK_CHILDREN_TEST_ID = 'MOCK_CHILDREN_TEST_ID';
const MOCK_CHILDREN: ReactNode = <div data-testid={MOCK_CHILDREN_TEST_ID} />;

const MOCK_ACTIONS_TEST_ID = 'MOCK_ACTIONS_TEST_ID';
const MOCK_ACTIONS: ReactNode = <div data-testid={MOCK_ACTIONS_TEST_ID} />;

describe('MainLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all expected elements', () => {
    renderWithProviders(<MainLayout>{MOCK_CHILDREN}</MainLayout>);

    expect(screen.getByTestId('main-layout-container')).toBeInTheDocument();
    expect(screen.getByTestId(LEFT_SIDEBAR_MOCK_TEST_ID)).toBeInTheDocument();
    expect(screen.getByTestId('main-layout-right-content')).toBeInTheDocument();
    expect(screen.getByTestId('main-layout-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('main-layout-header-left')).toBeInTheDocument();
    expect(screen.getByTestId(CONTEXT_FILTER_MOCK_TEST_ID)).toBeInTheDocument();
    expect(screen.getByTestId('main-layout-header-right')).toBeInTheDocument();
    expect(screen.queryByTestId(MOCK_ACTIONS_TEST_ID)).not.toBeInTheDocument();
    expect(screen.getByTestId('main-layout-children-container')).toBeInTheDocument();
    expect(screen.getByTestId(MOCK_CHILDREN_TEST_ID)).toBeInTheDocument();
  });

  it('should render actions if provided', () => {
    renderWithProviders(<MainLayout actions={MOCK_ACTIONS}>{MOCK_CHILDREN}</MainLayout>);

    expect(screen.getByTestId(MOCK_ACTIONS_TEST_ID)).toBeInTheDocument();
  });
});
