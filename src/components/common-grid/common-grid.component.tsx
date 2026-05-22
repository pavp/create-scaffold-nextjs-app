import React, { PropsWithChildren, ReactNode } from 'react';

import { Box } from '@/ui';

import { BottomContainer } from './components/bottom-container/bottom-container.component';
import { Header, HeaderProps } from './components/header/header.component';
import { LeftContainer } from './components/left-container/left-container.component';
import { MainContainer } from './components/main-container/main-container.component';
import { RightContainer } from './components/right-container/right-container.component';
import { Subtitle } from './components/subtitle/subtitle.component';

import styles from './styles.module.scss';

const { container } = styles;

const CommonGridBase = ({ children }: PropsWithChildren) => {
  return <Box className={container}>{children}</Box>;
};

const MemoizedComponent = React.memo(CommonGridBase);

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

export const CommonGrid: CommonGridHOCProps = Object.assign(MemoizedComponent, {
  LeftContainer: LeftContainer,
  BottomContainer: BottomContainer,
  Header: Header,
  MainContainer: MainContainer,
  RightContainer: RightContainer,
  Subtitle: Subtitle,
});
