import { useCallback, useMemo, useState } from 'react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useRouter } from 'next/navigation';

import ItemSidebarProps from '../types/item-sidebar-props.types';

export const useLeftSidebar = () => {
  const router = useRouter();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isCollapsed, setCollapsed] = useState(true);

  const listItems: ItemSidebarProps[] = useMemo(
    () => [
      {
        dataTestid: 'collapsable-list-main-backoffice',
        text: 'Backoffice',
        icon: EditNoteIcon,
        disabled: false,
        hidden: false,
        navigateTo: '/',
      },
      {
        dataTestid: 'collapsable-list-main-consents-list',
        text: 'Consents List',
        icon: VerifiedUserIcon,
        disabled: false,
        hidden: false,
        navigateTo: '/',
      },
      {
        dataTestid: 'collapsable-list-main-todo',
        text: 'Todo',
        icon: PlaylistAddCheckIcon,
        disabled: false,
        hidden: false,
        navigateTo: '/todo',
      },
    ],
    [],
  );

  const onClick = useCallback(
    (item: ItemSidebarProps) => {
      if (item.navigateTo) router.push(item.navigateTo);
    },
    [router],
  );

  return {
    listItems,
    onClick,
    isCollapsed,
    setCollapsed,
    selectedIndex,
    setSelectedIndex,
  };
};
