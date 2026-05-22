'use client';

import { useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import useMediaQuery from '@mui/material/useMediaQuery'; // Importing directly from MUI to avoid errors when using `ui/index.ts`.

import breakpoints from '@/styles/breakpoints';

export const useResponsiveScreen = () => {
  const isMobileDevice = useMediaQuery(
    `(min-device-width: ${breakpoints.mobileMin}) and (max-device-width: ${breakpoints.mobileMax})`,
  );
  const isTabletDevice = useMediaQuery(
    `(min-device-width: ${breakpoints.tabletMin}) and (max-device-width: ${breakpoints.tabletMax})`,
  );
  const isDesktopDevice = useMediaQuery(`(min-device-width: ${breakpoints.desktopMin})`);

  const isPortrait = useMediaQuery('(orientation: portrait)');

  const isLandscape = useMediaQuery('(orientation: landscape)');

  const deviceType = useMemo(() => {
    if (isMobileDevice) return 'mobile';
    if (isTabletDevice) return 'tablet';

    return 'desktop';
  }, [isMobileDevice, isTabletDevice]);

  return { isMobileDevice, isTabletDevice, isDesktopDevice, deviceType, isPortrait, isLandscape };
};
