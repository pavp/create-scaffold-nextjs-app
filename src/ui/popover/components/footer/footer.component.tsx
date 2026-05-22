import React, { PropsWithChildren } from 'react';
import { Box } from '@mui/material';

import styles from './styles.module.scss';

const { container } = styles;

const Footer = ({ children }: PropsWithChildren) => {
  return (
    <Box className={container} data-testid="footer-container">
      {children}
    </Box>
  );
};

const MemoizedComponent = React.memo(Footer) as typeof Footer;

export { MemoizedComponent as Footer };
