'use client';

import { useEffect } from 'react';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import { useTranslations } from 'next-intl';

import { ErrorView } from '@/core/components';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const t = useTranslations('common');

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorView
          Icon={CrisisAlertIcon}
          error={t('titleError')}
          message={t('errorMessage')}
          subtitle={t('errorSubtitle')}
        />
      </body>
    </html>
  );
}
