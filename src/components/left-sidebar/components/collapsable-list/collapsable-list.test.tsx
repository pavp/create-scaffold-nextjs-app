import React, { ElementType } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { act, fireEvent, renderWithProviders, screen } from '@test/utils/test-utils';

import { MENU_ITEMS } from '../../__mocks__/left-sidebar.mock';
import ItemSidebarProps from '../../types/item-sidebar-props';

import { CollapsableList } from './collapsable-list';
import { useCollapsableList } from './hooks';

jest.mock('./hooks/use-collapsable-list');
const mockCollapsableList = useCollapsableList as jest.MockedFunction<typeof useCollapsableList>;

interface IUseHooksCollapsableList {
  handleClick: () => void;
  handleClickSubItem: (item: ItemSidebarProps) => void;
  selected: boolean;
  Icon: ElementType;
  open: boolean;
}

MENU_ITEMS[4].icon = KeyboardArrowUpIcon;
const optionsLength = MENU_ITEMS[4].subOptions?.length || 0;
const hooksPropsValue = {
  handleClick: jest.fn(),
  handleClickSubItem: jest.fn(),
  Icon: KeyboardArrowUpIcon,
  selected: true,
  open: false,
};

const setup = ({
  hookProps,
  item,
  index,
  selectedIndex,
  isCollapsed,
  isActivePath,
}: {
  hookProps: IUseHooksCollapsableList;
  item: ItemSidebarProps;
  index: number;
  selectedIndex: number;
  isCollapsed: boolean;
  isActivePath: boolean;
}) => {
  const onClickSpy = jest.fn();
  const onClickSubItemSpy = jest.fn();
  const setSelectedSpy = jest.fn();

  mockCollapsableList.mockImplementation(() => {
    return {
      ...hookProps,
      handleClick: onClickSpy,
      handleClickSubItem: onClickSubItemSpy,
      isActivePath: jest.fn().mockReturnValue(isActivePath),
    };
  });

  const context = renderWithProviders(
    <CollapsableList
      index={index}
      isCollapsed={isCollapsed}
      item={item}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedSpy}
      onClick={onClickSpy}
    />,
  );

  return { context, onClickSpy, onClickSubItemSpy };
};

describe('CollapsableList component', () => {
  it('should display the collapsable list', () => {
    const utils = setup({
      hookProps: { ...hooksPropsValue, open: true },
      item: MENU_ITEMS[4],
      index: 0,
      selectedIndex: 0,
      isCollapsed: true,
      isActivePath: true,
    });

    expect(utils.context.getByTestId('main-list')).toBeInTheDocument();
  });

  it('should not display the collapsable list', () => {
    const item = {
      ...MENU_ITEMS[4],
      hidden: true,
    };

    const utils = setup({
      hookProps: hooksPropsValue,
      item,
      index: 0,
      selectedIndex: 0,
      isCollapsed: true,
      isActivePath: true,
    });

    expect(utils.context.queryByTestId('main-list')).not.toBeInTheDocument();
  });

  it('should open the collapsable list', () => {
    const item = MENU_ITEMS[4];
    const utils = setup({
      hookProps: { ...hooksPropsValue, open: true },
      index: 0,
      selectedIndex: 0,
      isCollapsed: true,
      item,
      isActivePath: true,
    });

    const openButton = utils.context.getByTestId('open-button');

    expect(openButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(openButton);
    });

    expect(utils.context.getByTestId('collapsable-list')).toBeInTheDocument();

    const items = item.subOptions;

    items?.forEach((subitem) => {
      const el = utils.context.getByTestId(subitem.dataTestid ?? '');

      expect(el).toBeInTheDocument();
    });

    expect(items).toHaveLength(optionsLength);

    const item1 = utils.context.getByTestId(item.subOptions?.[0].dataTestid ?? '');
    const item2 = utils.context.getByTestId(item.subOptions?.[1].dataTestid ?? '');
    const item3 = utils.context.getByTestId(item.subOptions?.[2].dataTestid ?? '');

    expect(item1).not.toHaveClass('Mui-disabled');
    expect(item2).toHaveClass('Mui-disabled');
    expect(item3).not.toHaveClass('Mui-disabled');
  });

  it('should not open the collapsable list', () => {
    const item = {
      ...MENU_ITEMS[4],
      disabled: true,
    };

    const utils = setup({
      hookProps: hooksPropsValue,
      index: 0,
      selectedIndex: 0,
      isCollapsed: true,
      item,
      isActivePath: true,
    });

    const openButton = utils.context.getByTestId('open-button');

    expect(openButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(openButton);
    });

    const items = utils.context.queryByTestId('collapsable-list');

    expect(items).not.toBeInTheDocument();
  });

  it('should exec on click method', () => {
    const utils = setup({
      hookProps: { ...hooksPropsValue, open: true },
      index: 0,
      selectedIndex: 0,
      isCollapsed: true,
      item: MENU_ITEMS[4],
      isActivePath: true,
    });

    const openButton = utils.context.getByTestId('open-button');

    expect(openButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(openButton);
    });

    expect(utils.context.getByTestId('collapsable-list')).toBeInTheDocument();

    const item1 = utils.context.getByTestId(MENU_ITEMS[4].subOptions?.[0].dataTestid ?? '');

    act(() => {
      fireEvent.click(item1);
    });

    expect(utils.onClickSubItemSpy).toHaveBeenCalled();
  });

  it('should have class collapsed', () => {
    setup({
      hookProps: { ...hooksPropsValue, open: true },
      index: 0,
      selectedIndex: 0,
      isCollapsed: true,
      item: MENU_ITEMS[4],
      isActivePath: true,
    });

    const mainContainer = screen.getByTestId(MENU_ITEMS[4].dataTestid);

    expect(mainContainer).toHaveClass('collapsed');
  });

  it('should not have class collapsed', () => {
    setup({
      hookProps: { ...hooksPropsValue, open: true },
      index: 0,
      selectedIndex: 0,
      isCollapsed: false,
      item: MENU_ITEMS[4],
      isActivePath: true,
    });

    const mainContainer = screen.getByTestId(MENU_ITEMS[4].dataTestid);

    expect(mainContainer).not.toHaveClass('collapsed');
  });

  it('should have class selectedItem', () => {
    setup({
      hookProps: { ...hooksPropsValue, open: true },
      index: 0,
      selectedIndex: 0,
      isCollapsed: false,
      item: MENU_ITEMS[3],
      isActivePath: true,
    });

    const mainContainer = screen.getByTestId(MENU_ITEMS[3].dataTestid);

    expect(mainContainer).toHaveClass('selectedItem');
  });

  it('should not have class selectedItem', () => {
    setup({
      hookProps: { ...hooksPropsValue, open: true },
      index: 0,
      selectedIndex: 0,
      isCollapsed: false,
      item: MENU_ITEMS[3],
      isActivePath: false,
    });

    const mainContainer = screen.getByTestId(MENU_ITEMS[3].dataTestid);

    expect(mainContainer).not.toHaveClass('selectedItem');
  });
});
