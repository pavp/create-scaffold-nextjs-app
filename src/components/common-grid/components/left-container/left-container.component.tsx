import React, { PropsWithChildren } from 'react';

import { Card } from '@/ui';

import styles from './styles.module.scss';

const { container } = styles;

const LeftContainer = ({ children }: PropsWithChildren) => {
  return <Card className={container}>{children}</Card>;
};

const MemoizedComponent = React.memo(LeftContainer);

export { MemoizedComponent as LeftContainer };
