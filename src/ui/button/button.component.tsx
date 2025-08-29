import React from 'react';
import { Box, Button as ButtonMui, ButtonProps as ButtonPropsMui } from '@mui/material';

import { LoadingIndicator } from '../loading-indicator/loading-indicator.component';

import styles from './styles.module.scss';

const { buttonRow, loadingContainer } = styles;

interface ButtonProps extends ButtonPropsMui {
  loading?: boolean;
}

const Button = ({ loading = false, children, ...props }: ButtonProps) => {
  return (
    <ButtonMui className={buttonRow} {...props}>
      <Box className={loadingContainer}>{loading ? <LoadingIndicator size={18} /> : children}</Box>
    </ButtonMui>
  );
};

const MemoizedComponent = React.memo(Button) as typeof Button;

export { MemoizedComponent as Button };
