'use client';
import { PropsWithChildren } from 'react';
import { LocalizationProvider as LocalizationProviderMui } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';
import { useLocale } from 'next-intl';

import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/pt';
import 'dayjs/locale/de';
import 'dayjs/locale/nl';
import 'dayjs/locale/sv';

export const LocalizationProvider = ({ children }: PropsWithChildren) => {
  const locale = useLocale();

  dayjs.locale(locale);

  return (
    <LocalizationProviderMui adapterLocale={locale} dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProviderMui>
  );
};
