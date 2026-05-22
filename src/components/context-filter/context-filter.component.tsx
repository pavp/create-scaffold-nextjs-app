'use client';

import React from 'react';
import PersonIcon from '@mui/icons-material/Person';

import { Box, Typography } from '@/ui';

import { CustomerData } from './components/customer-data/customer-data.component';

import styles from './styles.module.scss';

const { contextContainer, user, textMargin } = styles;

interface IContextFilterProps {
  showCustomerData?: boolean;
}

const ContextFilter = ({ showCustomerData }: IContextFilterProps) => {
  // TODO: Replace with actual user data from your auth system
  const username = 'Sample User';

  return (
    <Box className={contextContainer} data-testid="user-context">
      <Box className={user} data-testid="user-context-user">
        <PersonIcon data-testid="user-context-user-icon" fontSize="small" />
        <Typography className={textMargin} data-testid="user-context-user-name">
          {username}
        </Typography>
      </Box>
      {showCustomerData && <CustomerData />}
    </Box>
  );
};

const MemoizedComponent = React.memo(ContextFilter);

export { MemoizedComponent as ContextFilter };
