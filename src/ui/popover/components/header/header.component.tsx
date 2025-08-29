import React, { SyntheticEvent, useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import TranslateIcon from '@mui/icons-material/Translate';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import styles from './styles.module.scss';

const { container, titleText, boldText, iconButton, translateIcon, translateIconContainer } = styles;

export interface HeaderProps {
  title: string;
  handleClick: () => void;
}

const Header = ({ title, handleClick }: HeaderProps) => {
  const t = useTranslations();
  const onClick = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      handleClick();
    },
    [handleClick],
  );

  return (
    <Box className={container} data-testid="header-container">
      <Box className={translateIconContainer}>
        <TranslateIcon className={translateIcon} />
      </Box>
      <Typography className={`${titleText} ${boldText}`} data-testid="header-title">
        {`${t('common.translate')} -`}
      </Typography>
      <Typography data-testid="header-title">{`${title}`}</Typography>
      <IconButton className={iconButton} data-testid="header-button" size="small" onClick={onClick}>
        <CloseIcon color="primary" />
      </IconButton>
    </Box>
  );
};

const MemoizedComponent = React.memo(Header) as typeof Header;

export { MemoizedComponent as Header };
