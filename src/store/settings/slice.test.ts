import { QueryStatus } from '@reduxjs/toolkit/query';
import { settingsMock } from '@test/entities';
import { buildRtkQueryAction } from '@test/utils/test-utils';

import { SettingsResponse } from '@/api/settings';

import { makeStore } from '../store';

import { clearSettings, initialState, settingsReducer, SettingsState } from './slice';

describe('Settings Store', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set the default values', () => {
    const store = settingsReducer(undefined, {} as any);

    expect(store.mixpanelApiKey).toBe(initialState.mixpanelApiKey);
    expect(store.screebWebsiteId).toBe(initialState.screebWebsiteId);
    expect(store.status).toBe(initialState.status);
  });

  it('should clear settings', () => {
    const store = makeStore({ settings: settingsMock });

    expect(store.getState().settings.screebWebsiteId).toEqual(settingsMock.screebWebsiteId);

    store.dispatch(clearSettings());

    expect(store.getState().settings.screebWebsiteId).toEqual(initialState.screebWebsiteId);
  });

  it('sets loading true when loadSettings action is pending', () => {
    const action = buildRtkQueryAction({ type: 'query', queryType: 'pending', endpointName: 'getSettings' });

    const state = settingsReducer(initialState, action);

    const expected: SettingsState = {
      ...initialState,
      status: QueryStatus.pending,
    };

    expect(state).toEqual(expected);
  });

  it('sets the id and list when loadSettings action is fulfilled', async () => {
    const payload: SettingsResponse = {
      mixPanelKey: settingsMock.mixpanelApiKey,
      screeb_website_id: settingsMock.screebWebsiteId,
      muiKey: '',
    };
    const action = buildRtkQueryAction({
      type: 'query',
      queryType: 'fulfilled',
      endpointName: 'getSettings',
      payload: payload,
    });

    const state = settingsReducer(initialState, action);

    const expected: SettingsState = {
      mixpanelApiKey: payload.mixPanelKey,
      screebWebsiteId: payload.screeb_website_id,
      muiApiKey: payload.muiKey,
      status: QueryStatus.fulfilled,
    };

    expect(state).toEqual(expected);
  });

  it('sets loading false when loadSettings action is rejected', () => {
    const action = buildRtkQueryAction({ type: 'query', queryType: 'rejected', endpointName: 'getSettings' });

    const state = settingsReducer(initialState, action);

    const expected: SettingsState = {
      ...initialState,
      status: QueryStatus.rejected,
    };

    expect(state).toEqual(expected);
  });
});
