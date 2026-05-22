import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { useToast } from '../../hooks';

import styles from './styles.module.scss';

const { confirmDeleteContainer, confirmDeleteMessage, confirmDeleteButton } = styles;

interface ConfirmationComponentProps {
  message: string;
  onConfirmation: () => void;
}

const ConfirmationComponent = ({ message, onConfirmation }: ConfirmationComponentProps) => {
  const { handleClose } = useToast();
  const t = useTranslations('common');

  const handleConfirmation = () => {
    onConfirmation();
    handleClose();
  };

  return (
    <Box className={confirmDeleteContainer} data-testid="confirm-delete-container">
      <Typography className={confirmDeleteMessage} data-testid="confirm-delete-message">
        {message}
      </Typography>
      <Button className={confirmDeleteButton} data-testid="confirm-delete-button" onClick={handleConfirmation}>
        {t('button.accept')}
      </Button>
    </Box>
  );
};

const MemoizedComponent = React.memo(ConfirmationComponent);

export { MemoizedComponent as ConfirmationComponent };
