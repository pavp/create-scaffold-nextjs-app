import React, { PropsWithChildren, ReactNode } from 'react';
import { Box, Popover as PopoverMui } from '@mui/material';

import { HeaderProps } from './components/header/header';
import { Content, Footer, Header } from './components';

interface PopoverProps extends PropsWithChildren {
  anchorOrigin: {
    horizontal: 'left' | 'center' | 'right' | number;
    vertical: 'top' | 'center' | 'bottom' | number;
  };
  anchorEl: Element | null;
  id?: string;
  open: boolean;
  indicator?: boolean;
}

const Popover = ({ anchorEl, children, id, indicator, open, anchorOrigin }: PopoverProps) => {
  return (
    <>
      {open && indicator && (
        <Box
          sx={{
            width: 0,
            height: 0,
            position: 'fixed',
            borderRight: '15px solid #FFFFFF',
            borderBottom: '15px solid transparent',
            borderTop: '15px solid transparent',
            top: anchorEl ? anchorEl.getBoundingClientRect().top + anchorEl.getBoundingClientRect().height / 2 - 15 : 0,
            left: anchorEl ? anchorEl.getBoundingClientRect().right - 15 : 0,
            zIndex: 1301, // In mui the modal has 1300 z-index, so in order to show the indicator we have to set it to 1301 (check this link https://mui.com/components/modal/#css)
          }}
        />
      )}
      <PopoverMui anchorEl={anchorEl} anchorOrigin={anchorOrigin} id={id} open={open}>
        <Box data-testid="container">{children}</Box>
      </PopoverMui>
    </>
  );
};

const MemoizedComponent = React.memo(Popover);

interface PopoverHOCProps {
  ({ children, id, open }: PopoverProps): ReactNode;
  Header: ({ title, handleClick }: HeaderProps) => ReactNode;
  Content: ({ children }: PropsWithChildren) => ReactNode;
  Footer: ({ children }: PropsWithChildren) => ReactNode;
}

export const PopoverHOC: PopoverHOCProps = Object.assign(MemoizedComponent, {
  Header: Header,
  Content: Content,
  Footer: Footer,
});
