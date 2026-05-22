import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';

import styles from './styles.module.scss';

const { container } = styles;

export const Footer = ({ children }: PropsWithChildren) => {
  return (
    <Box className={container} data-testid="footer-container">
      {children}
    </Box>
  );
};
