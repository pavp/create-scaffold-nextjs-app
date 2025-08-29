import { ElementType, useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import ItemSidebarProps from '@/components/left-sidebar/types/item-sidebar-props.types';

export interface IUseCollapsableList {
  index: number;
  item: ItemSidebarProps;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  onClick: (item: ItemSidebarProps) => void;
  hasSubOptions: boolean;
}

export const useCollapsableList = ({
  index,
  item,
  selectedIndex,
  setSelectedIndex,
  onClick,
  hasSubOptions,
}: IUseCollapsableList) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const Icon = item.icon as ElementType;

  useEffect(() => {
    if (open && index !== selectedIndex) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const handleClick = useCallback(() => {
    if (hasSubOptions) {
      if (!item.disabled && index !== selectedIndex) {
        setOpen(true);
        setSelectedIndex(index);
      } else {
        setOpen(false);
        setSelectedIndex(-1);
      }
    } else {
      onClick(item);
    }
  }, [hasSubOptions, item, index, selectedIndex, setSelectedIndex, onClick]);

  const handleClickSubItem = useCallback(
    (item: ItemSidebarProps) => {
      setOpen(!open);
      onClick(item);
    },
    [onClick, open],
  );

  const isActivePath = (path: string) => {
    return pathname.endsWith(path);
  };

  return { handleClick, handleClickSubItem, isActivePath, Icon, open };
};
