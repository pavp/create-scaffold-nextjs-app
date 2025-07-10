import { act, renderHookWithProviders } from '@test/utils/test-utils';
import * as navigation from 'next/navigation';

import ItemSidebarProps from '../types/item-sidebar-props';

import { useLeftSidebar } from './use-left-sidebar';

const ITEM_SIDE_BAR: ItemSidebarProps = {
  dataTestid: '1',
  text: 'item',
  disabled: false,
  hidden: false,
  navigateTo: '/',
};

const setup = () => {
  const context = renderHookWithProviders(() => useLeftSidebar());

  return { context };
};

describe('useLeftSidebar hook', () => {
  it('Check return values from hook by default', () => {
    const { context } = setup();
    const { listItems, onClick, isCollapsed, setCollapsed, selectedIndex, setSelectedIndex } = context.result.current;

    expect(listItems).toBeDefined();
    expect(onClick).toBeDefined();
    expect(isCollapsed).toBe(true);
    expect(setCollapsed).toBeDefined();
    expect(selectedIndex).toBe(-1);
    expect(setSelectedIndex).toBeDefined();
  });

  it('should call the useRouter push with the navigationTo value', () => {
    const { context } = setup();
    const { onClick } = context.result.current;

    act(() => {
      onClick(ITEM_SIDE_BAR);
    });

    expect(navigation.useRouter().push).toHaveBeenCalledWith(ITEM_SIDE_BAR.navigateTo);
  });
});
