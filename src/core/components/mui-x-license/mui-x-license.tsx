'use client';

import { useEffect } from 'react';
import { LicenseInfo } from '@mui/x-license';

import { useSettingsStore } from '@/store/settings/hooks';

export const MuiXLicense = () => {
  const { muiApiKey } = useSettingsStore();

  useEffect(() => {
    LicenseInfo.setLicenseKey(muiApiKey);
  }, [muiApiKey]);

  return null;
};
