import React, { PropsWithChildren } from 'react';
import { Box } from '@mui/material';

import styles from './styles.module.scss';

const { container } = styles;

const Content = ({ children }: PropsWithChildren) => {
  return (
    <Box className={container} data-testid="container-content">
      {children}
    </Box>
  );
};

const MemoizedComponent = React.memo(Content) as typeof Content;

export { MemoizedComponent as Content };
