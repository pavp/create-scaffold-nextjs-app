import React from 'react';

import { Box, Fade, LoadingIndicator } from '@/ui';

import styles from './styles.module.scss';

interface LoadingScreenProps {
  visible: boolean;
}

const LoadingScreen = ({ visible = false }: LoadingScreenProps) => {
  return (
    <Fade appear={false} data-testid="loading-screen" in={visible} timeout={500}>
      <Box className={styles.loadingContainer}>
        <LoadingIndicator />
      </Box>
    </Fade>
  );
};

const MemoizedComponent = React.memo(LoadingScreen);

export { MemoizedComponent as LoadingScreen };
