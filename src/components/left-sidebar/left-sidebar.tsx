'use client';
import React from 'react';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import Image from 'next/image';

import { Box, IconButton, List } from '@/ui';

import LogoBig from '../../../public/images/logoBig.svg';
import LogoSmall from '../../../public/images/logoSmall.svg';

import { CollapsableList } from './components';
import { useLeftSidebar } from './hooks';

import styles from './styles.module.scss';

const { mainContainer, image, listContainer, collapseButton, collapsed, bottomMenuItemsList } = styles;

const LeftSidebar = () => {
  const { listItems, onClick, isCollapsed, setCollapsed, selectedIndex, setSelectedIndex } = useLeftSidebar();

  const collapsedClass = isCollapsed ? collapsed : '';

  return (
    <Box className={`${mainContainer} ${collapsedClass}`} data-testid="leftSidebarContainer">
      <Image alt="Logo DMS" className={image} data-testid="leftSidebarImg" src={isCollapsed ? LogoSmall : LogoBig} />
      <Box className={collapseButton} data-testid="collapseButton">
        <IconButton onClick={() => setCollapsed(!isCollapsed)}>
          <ChevronLeftRoundedIcon />
        </IconButton>
      </Box>
      <Box className={listContainer}>
        <List data-testid="leftSidebarList">
          {listItems.map((item, index) => {
            return (
              <CollapsableList
                key={item.text}
                index={index}
                isCollapsed={isCollapsed}
                item={item}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onClick={onClick}
              />
            );
          })}
        </List>
        <Box className={bottomMenuItemsList} />
      </Box>
    </Box>
  );
};

const MemoizedComponent = React.memo(LeftSidebar);

export { MemoizedComponent as LeftSidebar };
