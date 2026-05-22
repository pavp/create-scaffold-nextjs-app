import React from 'react';
import { act, fireEvent, renderWithProviders, waitFor } from '@test/utils';

import { MENU_ITEMS } from './__mocks__/left-sidebar.mock';
import { useLeftSidebar } from './hooks/use-left-sidebar.hook';
import { LeftSidebar } from './left-sidebar.component';

jest.mock('./components/collapsable-list/collapsable-list.component', () => {
  return {
    CollapsableList: () => <div />,
  };
});

jest.mock('./hooks/use-left-sidebar.hook');
const mockUseLeftSidebar = useLeftSidebar as jest.MockedFunction<typeof useLeftSidebar>;

const setup = (isCollapsed = true) => {
  const spySetCollapsed = jest.fn();

  mockUseLeftSidebar.mockImplementation(() => {
    return {
      listItems: MENU_ITEMS,
      onClick: jest.fn(),
      isCollapsed,
      setCollapsed: spySetCollapsed,
      selectedIndex: 1,
      setSelectedIndex: jest.fn(),
    };
  });
  const context = renderWithProviders(<LeftSidebar />);

  return { context, spySetCollapsed };
};

describe('LeftSidebar component', () => {
  it('should display the left sidebar', () => {
    const utils = setup();

    const leftSidebarContainer = utils.context.getByTestId('leftSidebarContainer');

    expect(leftSidebarContainer).toBeInTheDocument();
    expect(leftSidebarContainer.childElementCount).toBe(3);
    expect(leftSidebarContainer).toHaveClass('mainContainer MuiBox-root css-0 collapsed');

    expect(utils.context.getByTestId('leftSidebarImg')).toBeInTheDocument();

    expect(utils.context.getByTestId('leftSidebarList')).toBeInTheDocument();
  });

  it('should collapse menu when click collapseButton', async () => {
    const utils = setup();

    const leftSidebarImg = utils.context.getByTestId('collapseButton');
    const button = leftSidebarImg.querySelector('button');

    expect(button).toBeInTheDocument();

    act(() => {
      button && fireEvent.click(button);
    });

    await waitFor(() => {
      expect(utils.spySetCollapsed).toHaveBeenCalled();
    });
  });

  it('should not be collapsed', () => {
    const utils = setup(false);

    const leftSidebarContainer = utils.context.getByTestId('leftSidebarContainer');

    expect(leftSidebarContainer).toBeInTheDocument();
    expect(leftSidebarContainer).not.toHaveClass('collapsed');
  });
});
