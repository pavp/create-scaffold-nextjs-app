import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { Box, Collapse, List, ListItemButton, Typography } from '@/ui';

import ItemSidebarProps from '../../types/item-sidebar-props';

import { Item } from './components';
import { useCollapsableList } from './hooks';

import styles from './styles.module.scss';

interface CollapsableListProps {
  item: ItemSidebarProps;
  onClick: (item: ItemSidebarProps) => void;
  index: number;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  isCollapsed: boolean;
}

const { mainContainer, listOptions, listsubOptions, textOption, optionItem, collapsed, listTitle, selectedItem } =
  styles;

const CollapsableList = ({
  onClick,
  item,
  isCollapsed,
  index,
  selectedIndex,
  setSelectedIndex,
}: CollapsableListProps) => {
  const hasSubOptions = !!item.subOptions;

  const { handleClick, handleClickSubItem, isActivePath, Icon, open } = useCollapsableList({
    index,
    item,
    selectedIndex,
    setSelectedIndex,
    onClick,
    hasSubOptions,
  });
  const arrowIcon = open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />;

  if (item.hidden) return null;

  const isSelectedItem = index === selectedIndex;

  const collapsedClass = isCollapsed ? collapsed : '';
  const selectedClass = isActivePath(item.navigateTo || '') ? selectedItem : '';

  return (
    <Box className={`${mainContainer} ${collapsedClass} ${selectedClass}`} data-testid={item.dataTestid}>
      <List
        aria-labelledby="nested list subheader"
        aria-selected={isSelectedItem}
        className={listOptions}
        component="nav"
        data-testid="main-list"
      >
        <ListItemButton className={optionItem} data-testid="open-button" disabled={item.disabled} onClick={handleClick}>
          <Icon />
          <Typography className={textOption}>{item.text}</Typography>
          {item.disabled || !hasSubOptions ? null : arrowIcon}
        </ListItemButton>
        {hasSubOptions && (
          <Collapse
            unmountOnExit
            className={listsubOptions}
            data-testid="collapsable-list"
            in={open && isSelectedItem}
            timeout="auto"
          >
            <Typography className={listTitle}>{item.text}</Typography>
            <List disablePadding component="ul" data-testid="subOptions-list">
              {item.subOptions?.map((subOption) => {
                return <Item key={subOption.text} item={subOption} onClick={handleClickSubItem} />;
              })}
            </List>
          </Collapse>
        )}
      </List>
    </Box>
  );
};

const MemoizedComponent = React.memo(CollapsableList);

export { MemoizedComponent as CollapsableList };
