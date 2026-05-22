import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';

import styles from './styles.module.scss';

const { container } = styles;

export const Content = ({ children }: PropsWithChildren) => {
  return (
    <Box className={container} data-testid="container-content">
      {children}
    </Box>
  );
};
