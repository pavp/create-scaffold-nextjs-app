'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useShowToast } from '@/ui/toast/hooks';

import { GeoLocationSensorState, IGeolocationPositionError } from './use-geolocation.types';

export const useGeolocation = () => {
  const t = useTranslations('common');
  const { showToast } = useShowToast();
  const [state, setState] = useState<GeoLocationSensorState>({
    isEnabled: false,
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    error: undefined,
    timestamp: Date.now(),
  });

  const onEvent = useCallback((event: GeolocationPosition) => {
    setState({
      isEnabled: true,
      loading: false,
      accuracy: event.coords.accuracy,
      altitude: event.coords.altitude,
      altitudeAccuracy: event.coords.altitudeAccuracy,
      heading: event.coords.heading,
      latitude: event.coords.latitude,
      longitude: event.coords.longitude,
      speed: event.coords.speed,
      timestamp: event.timestamp,
    });
  }, []);

  const onEventError = useCallback(
    (error: IGeolocationPositionError) => {
      setState((oldState) => ({ ...oldState, loading: false, error, isEnabled: false }));
      showToast({ snackbarMessage: t('geolocation.denied'), severity: 'ERROR' });
    },
    [showToast, t],
  );

  const requestLocation = useCallback(async (): Promise<GeolocationPosition | null> => {
    return new Promise((resolve, reject) => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              onEvent(position);
              resolve(position);
            },
            (error) => {
              onEventError(error);
              reject(error);
            },
          );
        } else {
          showToast({ snackbarMessage: t('geolocation.notSupported'), severity: 'ERROR' });
          reject(new Error(t('geolocation.notSupported')));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error requesting location:', error);
        reject(error);
      }
    });
  }, [onEvent, onEventError, showToast, t]);

  const handlePermissionResult = useCallback(
    async (result: PermissionStatus, shouldRequestLocation: boolean) => {
      if (result.state === 'granted') {
        if (shouldRequestLocation) {
          const position = await requestLocation();

          return position;
        } else {
          setState((oldState) => ({ ...oldState, isEnabled: true }));

          return null;
        }
      }
      setState((oldState) => ({ ...oldState, isEnabled: false }));

      return null;
    },
    [requestLocation],
  );

  const checkGeolocationPermission = useCallback(
    async (shouldRequestLocation: boolean = false) => {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'geolocation' });

        return handlePermissionResult(result, shouldRequestLocation);
      }

      return null;
    },
    [handlePermissionResult],
  );

  useEffect(() => {
    checkGeolocationPermission(true);
  }, [checkGeolocationPermission]);

  useEffect(() => {
    let permissionStatus: PermissionStatus;

    const handlePermissionChange = () => {
      checkGeolocationPermission();
    };

    const setupPermissionListener = async () => {
      if (navigator.permissions) {
        permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        permissionStatus.addEventListener('change', handlePermissionChange);
      }
    };

    setupPermissionListener();

    return () => {
      if (permissionStatus) permissionStatus.removeEventListener('change', handlePermissionChange);
    };
  }, [checkGeolocationPermission]);

  return {
    state,
    methods: {
      requestLocation,
      checkGeolocationPermission,
    },
  };
};
