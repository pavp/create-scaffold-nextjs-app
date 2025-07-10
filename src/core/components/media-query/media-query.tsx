import { PropsWithChildren } from 'react';

import { useResponsiveScreen } from '@/core/hooks';

interface Mobile {
  mobile: true;
  tablet?: false;
  desktop?: false;
}

interface Tablet {
  mobile?: false;
  tablet: true;
  desktop?: false;
}

interface Desktop {
  mobile?: false;
  tablet?: false;
  desktop: true;
}

interface MobileAndTablet {
  mobile: true;
  tablet: true;
  desktop?: false;
}

interface TabletAndDesktop {
  mobile?: false;
  tablet: true;
  desktop: true;
}

type MediaQuery = (Mobile | Tablet | Desktop | MobileAndTablet | TabletAndDesktop) & PropsWithChildren;

export const MediaQuery = ({ mobile = false, tablet = false, desktop = false, children }: MediaQuery) => {
  const { isMobileDevice, isTabletDevice, isDesktopDevice } = useResponsiveScreen();

  if (mobile && tablet && (isMobileDevice || isTabletDevice)) return children;
  if (mobile && isMobileDevice) return children;

  if (desktop && tablet && (isDesktopDevice || isTabletDevice)) return children;
  if (desktop && isDesktopDevice) return children;

  if (tablet && isTabletDevice) return children;

  return null;
};
