'use client';

import React from 'react';

import { useFetchSettings } from '@/api/settings';

// This wrapper loads application settings, it will allow rendering of the page once settings are available
const SettingsWrapper = ({ children }: { children: React.ReactElement }) => {
  useFetchSettings();

  return children;
};

const MemoizedComponent = React.memo(SettingsWrapper);

export { MemoizedComponent as SettingsWrapper };
