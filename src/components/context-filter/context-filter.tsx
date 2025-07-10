'use client';

import React from 'react';
import PersonIcon from '@mui/icons-material/Person';

import { useContextStore } from '@/store/context/hooks';
import { Box, Typography } from '@/ui';

import { CustomerData } from './components';

import styles from './styles.module.scss';

const { contextContainer, user, textMargin } = styles;

interface IContextFilterProps {
  showCustomerData?: boolean;
}

const ContextFilter = ({ showCustomerData }: IContextFilterProps) => {
  const {
    user: { username },
  } = useContextStore();

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
