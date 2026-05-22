import React, { PropsWithChildren } from 'react';

import { Box } from '@/ui';

import styles from './styles.module.scss';

const { container } = styles;

const RightContainer = ({ children }: PropsWithChildren) => {
  return <Box className={container}>{children}</Box>;
};

const MemoizedComponent = React.memo(RightContainer);

export { MemoizedComponent as RightContainer };
