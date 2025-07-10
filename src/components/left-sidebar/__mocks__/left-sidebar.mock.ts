import ItemSidebarProps from '../types/item-sidebar-props';

export const MENU_ITEMS: ItemSidebarProps[] = [
  { dataTestid: 'main1', text: 'Item 1', disabled: false, navigateTo: '/item1', hidden: false },
  { dataTestid: 'main2', text: 'Item 2', disabled: true, navigateTo: '/item2', hidden: false },
  { dataTestid: 'main3', text: 'Item 3', disabled: false, navigateTo: '/item3', hidden: false },
  {
    dataTestid: 'main4',
    text: 'Item 4',
    disabled: true,
    hidden: false,
  },
  {
    dataTestid: 'main5',
    text: 'Item 5',
    disabled: false,
    navigateTo: '/item4',
    hidden: false,
    subOptions: [
      {
        dataTestid: 'main51',
        text: 'Item 51',
        disabled: false,
        hidden: false,
      },
      {
        dataTestid: 'main52',
        text: 'Item 52',
        disabled: true,
        hidden: false,
      },
      {
        dataTestid: 'main53',
        text: 'Item 53',
        disabled: false,
        hidden: false,
      },
    ],
  },
];
