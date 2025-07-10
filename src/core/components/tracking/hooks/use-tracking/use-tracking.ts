'use client';

import { useEffect, useMemo } from 'react';
import * as Screeb from '@screeb/sdk-browser';

import { config } from '@/config';
import { encryptString } from '@/core/helpers';
import { Analytics } from '@/core/lib';
import { useSettingsStore } from '@/store/settings/hooks';
import { useUserStore } from '@/store/user/hooks';

import { useTrackingStore } from '../../store/hooks';

export const appName = config.appName;

export const useTracking = () => {
  const { trackingInitialized, updateTrackingInitialized } = useTrackingStore();
  // const isSessionReady = useAppSelector(selectIsSessionReady);
  const isSessionReady = false; //TODO: pending to define
  const user = useUserStore();
  const { mixpanelApiKey, screebWebsiteId, isSettingsLoaded } = useSettingsStore();

  const userId = useMemo(() => {
    const userId = `${user.id}@${appName}`;
    const userIdEncrypted = encryptString(userId);

    return userIdEncrypted;
  }, [user.id]);

  useEffect(() => {
    if (!trackingInitialized && isSessionReady && isSettingsLoaded) {
      Screeb.load();
      Screeb.init(screebWebsiteId, userId);

      Analytics.init(mixpanelApiKey);
      Analytics.identifyUser({
        customUserId: userId,
        id: user.id,
        appName: user.applicationName,
        username: user.username,
      });

      updateTrackingInitialized();
    }
  }, [
    isSessionReady,
    isSettingsLoaded,
    mixpanelApiKey,
    screebWebsiteId,
    trackingInitialized,
    updateTrackingInitialized,
    user.applicationName,
    user.id,
    user.username,
    userId,
  ]);
};
