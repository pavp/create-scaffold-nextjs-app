'use client';

import React from 'react';

import { useSettingsBusiness } from '@/shared/settings/hooks';

// This wrapper loads application settings, it will allow rendering of the page once settings are available
const SettingsWrapper = ({ children }: { children: React.ReactElement }) => {
  useSettingsBusiness();

  return children;
};

const MemoizedComponent = React.memo(SettingsWrapper);

export { MemoizedComponent as SettingsWrapper };
