import { memo } from 'react';

import { Box, Fade, LoadingIndicator } from '@/ui';

import styles from './styles.module.scss';

interface AuthLoadingProps {
  visible: boolean;
}

const AuthLoading = ({ visible = false }: AuthLoadingProps) => {
  return (
    <Fade appear={false} data-testid="loading-screen" in={visible} timeout={500}>
      <Box className={styles.loadingContainer}>
        <LoadingIndicator />
      </Box>
    </Fade>
  );
};

const MemoizedComponent = memo(AuthLoading);

export { MemoizedComponent as AuthLoading };
