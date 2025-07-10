'use client';

import { api } from './api';

export * from './api';

export const { getSettings, getMe } = api.endpoints;

export const { useGetSettingsQuery } = api;
