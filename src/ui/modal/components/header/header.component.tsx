import { SyntheticEvent } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from '@mui/material';

import styles from './styles.module.scss';

const { container, titleText, iconButton } = styles;

export interface HeaderProps {
  title: string;
  hideCloseButton?: boolean;
  disabled?: boolean;
  handleClick?: () => void;
}

export const Header = ({ title, hideCloseButton, disabled, handleClick }: HeaderProps) => {
  const onClick = (event: SyntheticEvent) => {
    event.stopPropagation();
    handleClick?.();
  };

  return (
    <Box className={container} data-testid="header-container">
      <Typography className={titleText} data-testid="header-title" variant="h6">
        {title}
      </Typography>
      {!hideCloseButton && (
        <IconButton
          className={iconButton}
          data-testid="header-button"
          disabled={disabled}
          size="small"
          onClick={onClick}
        >
          <CloseIcon color={disabled ? 'disabled' : 'primary'} />
        </IconButton>
      )}
    </Box>
  );
};
