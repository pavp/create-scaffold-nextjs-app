'use client';

import { useEffect } from 'react';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

import { ErrorView } from '@/core/components';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorView
          Icon={CrisisAlertIcon}
          error="Error"
          message="Unfortunately, we are unable to complete your request at this time. 
          Please try again later or contact us
          if the issue persists."
          subtitle="An error occurred while processing your request."
        />
      </body>
    </html>
  );
}
