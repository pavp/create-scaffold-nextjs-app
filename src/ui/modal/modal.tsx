import React, { PropsWithChildren, ReactNode, SyntheticEvent, useCallback } from 'react';
import { Box, Modal as MuiModal } from '@mui/material';

import { HeaderProps } from './components/header/header';
import { Content, Footer, Header } from './components';

import styles from './styles.module.scss';

const { container, fullScreen } = styles;

interface ModalProps extends PropsWithChildren {
  isVisible: boolean;
  fullscreen?: boolean;
  disabled?: boolean;
  handleClose?: () => void;
}

const Modal = ({ children, isVisible, fullscreen, disabled, handleClose }: ModalProps) => {
  const onClose = useCallback(
    (event: SyntheticEvent) => {
      if (disabled) return;
      event.stopPropagation();
      handleClose?.();
    },
    [disabled, handleClose],
  );

  return (
    <MuiModal
      disableAutoFocus
      aria-describedby="child-modal-description"
      aria-labelledby="child-modal-title"
      data-testid="modal-mui"
      open={isVisible}
      onClose={onClose}
    >
      <Box className={`${container} ${fullscreen && fullScreen}`} data-testid="container">
        {children}
      </Box>
    </MuiModal>
  );
};

const MemoizedComponent = React.memo(Modal);

interface ModalHOCProps {
  ({ children, isVisible, handleClose }: ModalProps): ReactNode;
  Header: ({ title, handleClick }: HeaderProps) => ReactNode;
  Content: ({ children }: PropsWithChildren) => ReactNode;
  Footer: ({ children }: PropsWithChildren) => ReactNode;
}

export const ModalHOC: ModalHOCProps = Object.assign(MemoizedComponent, {
  Header: Header,
  Content: Content,
  Footer: Footer,
});
