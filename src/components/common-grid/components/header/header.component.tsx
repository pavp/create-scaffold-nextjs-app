import React, { PropsWithChildren } from 'react';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import SortByAlphaOutlinedIcon from '@mui/icons-material/SortByAlphaOutlined';

import { Box, Button, IconButton, Tooltip, Typography } from '@/ui';

import styles from './styles.module.scss';

const {
  container,
  headerTopContainer,
  headerBottomContainer,
  iconsContainer,
  active,
  goBackButton,
  noChildrenContainer,
} = styles;

export interface HeaderProps extends PropsWithChildren {
  disableGoBackButton?: boolean;
  title?: string;
  showGoBackButton?: boolean;
  showIcons?: boolean;
  onClickChangeOrderByRecent?: () => void;
  onClickChangeOrderAlphabetically?: () => void;
  onClickGoBack?: () => void;
}

const Header = ({
  children,
  disableGoBackButton,
  title,
  showGoBackButton,
  showIcons,
  onClickChangeOrderByRecent,
  onClickChangeOrderAlphabetically,
  onClickGoBack,
}: HeaderProps) => {
  return (
    <Box className={`${container} ${!children && noChildrenContainer}`}>
      {!!title && (
        <Box className={headerTopContainer}>
          <Typography variant="h6">{title}</Typography>
          {showGoBackButton && (
            <Button
              className={goBackButton}
              data-testid="go-back-button"
              disabled={disableGoBackButton}
              onClick={onClickGoBack}
            >
              &lt; Back
            </Button>
          )}
        </Box>
      )}
      <Box className={headerBottomContainer}>
        {children}
        {showIcons && (
          <Box className={iconsContainer} data-testid="icon-container">
            <Tooltip title="Date">
              <IconButton
                className={active}
                data-testid="icon-change-order-by-recent"
                onClick={onClickChangeOrderByRecent}
              >
                <RestoreOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort">
              <IconButton data-testid="icon-change-order-alphabetically" onClick={onClickChangeOrderAlphabetically}>
                <SortByAlphaOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const MemoizedComponent = React.memo(Header);

export { MemoizedComponent as Header };
