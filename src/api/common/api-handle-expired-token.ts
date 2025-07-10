import { BaseQueryApi } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { Endpoint } from '../endpoint';

import { baseQuery } from './base-query';

const mutex = new Mutex();

interface handleExpiredTokenProps {
  expirationDate: string;
  api: BaseQueryApi;
  extraOptions: {};
}

export const handleExpiredToken = async ({ expirationDate, api, extraOptions }: handleExpiredTokenProps) => {
  const currentTime = new Date();
  const userTimezoneOffset = new Date(expirationDate).getTimezoneOffset() * 60000;
  const adjustedExpirationDate = new Date(new Date(expirationDate).getTime() - userTimezoneOffset);
  const isExpired = currentTime > adjustedExpirationDate; // If the current time is past the adjusted expiration date, attempt token refresh

  if (isExpired) {
    await mutex.waitForUnlock();
    // Acquire mutex lock if not already locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const { data, error } = await baseQuery(Endpoint.CoreAuthRefresh, api, extraOptions);

        if (data) {
          // const { token, expirationDate } = data as { token: string; expirationDate: string };
          // Process the new token and expiration date
        }
        if (error) {
          // Handle error (e.g., log it, notify user, etc.)
        }
      } finally {
        release();
      }
    } else {
      // Wait for the mutex to be unlocked by another process
      await mutex.waitForUnlock();
    }
  }
};
