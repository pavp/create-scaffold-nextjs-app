import { Box, Modal } from '@mui/material';

import { LoadingIndicator } from '../loading-indicator/loading-indicator';

import styles from './styles.module.scss';

const { container } = styles;

export const LoadingModal = () => {
  return (
    <Modal open>
      <Box className={container}>
        <LoadingIndicator />
      </Box>
    </Modal>
  );
};
