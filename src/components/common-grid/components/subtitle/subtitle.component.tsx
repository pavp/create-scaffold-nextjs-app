import React, { PropsWithChildren } from 'react';

import { Box, Typography } from '@/ui';

import styles from './styles.module.scss';

const { container } = styles;

const Subtitle = ({ children }: PropsWithChildren) => {
  return (
    <Box className={container}>
      <Typography>{children}</Typography>
    </Box>
  );
};

const MemoizedComponent = React.memo(Subtitle);

export { MemoizedComponent as Subtitle };
