'use client';

import { useCallback } from 'react';
import { useFormatter } from 'next-intl';

export const useFormatDate = () => {
  const format = useFormatter();

  const formatDate = useCallback(
    (date: string | number | Date) => {
      const dateTime = new Date(date);
      const dateFormatter = format.dateTime(dateTime, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const hourFormatter = format.dateTime(dateTime, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      return `${dateFormatter} / ${hourFormatter}`;
    },
    [format],
  );

  return { formatDate };
};
