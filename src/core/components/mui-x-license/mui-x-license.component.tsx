'use client';

import { useEffect } from 'react';
import { LicenseInfo } from '@mui/x-license';

import { useMuiApiKeySelector } from '@/shared/settings/selectors';

export const MuiXLicense = () => {
  const { muiApiKey } = useMuiApiKeySelector();

  useEffect(() => {
    LicenseInfo.setLicenseKey(muiApiKey);
  }, [muiApiKey]);

  return null;
};
