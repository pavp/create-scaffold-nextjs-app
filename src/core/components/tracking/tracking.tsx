'use client';

import React, { PropsWithChildren } from 'react';

import { useTracking } from './hooks/use-tracking/use-tracking';

const Tracking = ({ children }: PropsWithChildren) => {
  useTracking();

  return <>{children}</>;
};

const MemoizedTracking = React.memo(Tracking);

export { MemoizedTracking as Tracking };
