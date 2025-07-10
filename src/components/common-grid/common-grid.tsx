import React, { PropsWithChildren, ReactNode } from 'react';

import { Box } from '@/ui';

import { HeaderProps } from './components/header/header';
import { BottomContainer, Header, LeftContainer, MainContainer, RightContainer, Subtitle } from './components';

import styles from './styles.module.scss';

const { container } = styles;

const CommonGrid = ({ children }: PropsWithChildren) => {
  return <Box className={container}>{children}</Box>;
};

const MemoizedComponent = React.memo(CommonGrid);

interface CommonGridHOCProps {
  ({ children }: PropsWithChildren): ReactNode;
  LeftContainer: ({ children }: PropsWithChildren) => ReactNode;
  BottomContainer: ({ children }: PropsWithChildren) => ReactNode;
  Header: ({
    children,
    title,
    showIcons,
    onClickChangeOrderAlphabetically,
    onClickChangeOrderByRecent,
  }: HeaderProps) => ReactNode;
  MainContainer: ({ children }: PropsWithChildren) => ReactNode;
  RightContainer: ({ children }: PropsWithChildren) => ReactNode;
  Subtitle: ({ children }: PropsWithChildren) => ReactNode;
}

export const CommonGridHOC: CommonGridHOCProps = Object.assign(MemoizedComponent, {
  LeftContainer: LeftContainer,
  BottomContainer: BottomContainer,
  Header: Header,
  MainContainer: MainContainer,
  RightContainer: RightContainer,
  Subtitle: Subtitle,
});
