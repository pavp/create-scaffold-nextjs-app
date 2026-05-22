import React, { useCallback } from 'react';

import ItemSidebarProps from '@/components/left-sidebar/types/item-sidebar-props.types';
import { ListItemButton, Typography } from '@/ui';

import styles from '../../styles.module.scss';

const { listItem, textSubOption } = styles;

interface Props {
  item: ItemSidebarProps;
  onClick: (item: ItemSidebarProps) => void;
}

const Item = ({ item, onClick }: Props) => {
  const handleClick = useCallback(
    (disabled: boolean) => {
      if (!disabled) {
        onClick(item);
      }
    },
    [item, onClick],
  );

  return (
    <ListItemButton
      key={item.text}
      className={listItem}
      data-testid={item.dataTestid}
      disabled={item.disabled}
      id={item.text}
      onClick={() => handleClick(item.disabled)}
    >
      <Typography className={textSubOption}>{item.text}</Typography>
    </ListItemButton>
  );
};

const MemoizedComponent = React.memo(Item);

export { MemoizedComponent as Item };
