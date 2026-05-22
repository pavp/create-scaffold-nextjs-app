import { faker } from '@faker-js/faker';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { act, renderHook, renderHookWithProviders } from '@test/utils';
import * as navigation from 'next/navigation';

import { MENU_ITEMS } from '@/components/left-sidebar/__mocks__/left-sidebar.mock';

import { IUseCollapsableList, useCollapsableList } from './use-collapsable-list.hook';

const onClickSpy = jest.fn();
const spySetSelectedIndex = jest.fn();
const NO_INDEX = -1;
const hooksPropsValue = {
  item: { ...MENU_ITEMS[4], icon: KeyboardArrowUpIcon },
  index: 0,
  selectedIndex: 0,
  hasSubOptions: false,
  onClick: jest.fn(),
  setSelectedIndex: jest.fn(),
};

const setup = ({ hookProps }: { hookProps: IUseCollapsableList }) => {
  const context = renderHookWithProviders(() =>
    useCollapsableList({
      ...hookProps,
      onClick: onClickSpy,
      setSelectedIndex: spySetSelectedIndex,
    }),
  );

  return { context, onClickSpy, spySetSelectedIndex };
};

describe('UseCollapsable hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Check return values from hook by default', () => {
    const { context } = setup({ hookProps: hooksPropsValue });
    const { open, handleClick, handleClickSubItem, Icon, isActivePath } = context.result.current;

    expect(open).toBeFalsy();
    expect(Icon).toBeDefined();
    expect(handleClick).toBeDefined();
    expect(handleClickSubItem).toBeDefined();
    expect(isActivePath).toBeDefined();
  });

  it('should return open as true when hasSubOptions as true', () => {
    const newIndex = faker.number.int({ max: 100, min: 1 });
    const { context } = setup({ hookProps: { ...hooksPropsValue, index: newIndex, hasSubOptions: true } });

    const { handleClick } = context.result.current;

    act(() => {
      handleClick();
    });

    context.rerender(true);

    const { open } = context.result.current;

    expect(spySetSelectedIndex).toHaveBeenCalledWith(newIndex);
    expect(open).toBeTruthy();
  });

  it('should return open as false when hasSubOptions as undefined', () => {
    const { context } = setup({ hookProps: { ...hooksPropsValue, item: MENU_ITEMS[2] } });

    const { open } = context.result.current;

    expect(open).toBeFalsy();
  });

  it('should return open as false when hasSubOptions true and the item is disabled', () => {
    const { context } = setup({
      hookProps: { ...hooksPropsValue, item: { ...MENU_ITEMS[4], disabled: true }, hasSubOptions: true, index: 1 },
    });

    const { open, handleClick } = context.result.current;

    act(() => {
      handleClick();
    });

    expect(open).toBeFalsy();
  });

  it('should return open as false when hasSubOptions true and the item is disabled', () => {
    const { context } = setup({
      hookProps: { ...hooksPropsValue, item: { ...MENU_ITEMS[4], disabled: true }, hasSubOptions: true, index: 1 },
    });

    const { open, handleClick } = context.result.current;

    act(() => {
      handleClick();
    });

    expect(spySetSelectedIndex).toHaveBeenCalledWith(NO_INDEX);
    expect(open).toBeFalsy();
  });

  it('should call onClick within handleClick', () => {
    const { context } = setup({ hookProps: hooksPropsValue });
    const { handleClick } = context.result.current;

    act(() => {
      handleClick();
    });

    expect(onClickSpy).toHaveBeenCalled();
  });

  it('should call handleClickSubItem', () => {
    const { context, onClickSpy } = setup({ hookProps: hooksPropsValue });
    const { handleClickSubItem, open: initialOpen } = context.result.current;

    act(() => {
      handleClickSubItem(MENU_ITEMS[4]);
    });

    context.rerender(true);

    const { open } = context.result.current;

    expect(open).toBe(!initialOpen);
    expect(onClickSpy).toHaveBeenCalled();
  });

  it('should call endsWith', () => {
    const { context } = setup({ hookProps: hooksPropsValue });
    const { isActivePath } = context.result.current;

    const path = faker.string.alpha();

    act(() => {
      isActivePath(path);
    });

    expect(navigation.usePathname().endsWith).toHaveBeenCalledWith(path);
  });

  it('should call handleClickSubItem and change the open state', () => {
    const context = renderHook((props: IUseCollapsableList) => useCollapsableList(props), {
      initialProps: hooksPropsValue,
    });

    expect(context.result.current.open).toEqual(false);

    act(() => {
      context.result.current.handleClickSubItem(MENU_ITEMS[4]);
    });

    expect(context.result.current.open).toEqual(true);

    context.rerender({
      ...hooksPropsValue,
      selectedIndex: 1,
    });

    expect(context.result.current.open).toEqual(false);
  });
});
