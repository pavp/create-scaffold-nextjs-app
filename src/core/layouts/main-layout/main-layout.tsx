import React, { ReactNode } from 'react';

import { ContextFilter, LeftSidebar } from '@/components';
import { Box } from '@/ui';

import styles from './styles.module.scss';

const {
  MainLayoutContainer,
  MainLayoutRightContent,
  MainLayoutHeaderContainer,
  MainLayoutHeaderLeft,
  MainLayoutHeaderRight,
  MainLayoutChildrenContainer,
} = styles;

export interface MainLayoutProps {
  children: ReactNode;
  showCustomerData?: boolean;
  actions?: ReactNode;
}

const MainLayout = ({ children, showCustomerData, actions }: MainLayoutProps) => {
  return (
    <Box className={MainLayoutContainer} data-testid="main-layout-container">
      <LeftSidebar />
      <Box className={MainLayoutRightContent} data-testid="main-layout-right-content">
        <Box className={MainLayoutHeaderContainer} data-testid="main-layout-header-container">
          <Box className={MainLayoutHeaderLeft} data-testid="main-layout-header-left">
            <ContextFilter showCustomerData={showCustomerData} />
          </Box>
          <Box className={MainLayoutHeaderRight} data-testid="main-layout-header-right">
            {actions}
          </Box>
        </Box>
        <Box className={MainLayoutChildrenContainer} data-testid="main-layout-children-container">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

const MemoizedLayout = React.memo(MainLayout);

export { MemoizedLayout as MainLayout };
