import { faker } from '@faker-js/faker';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { renderHookWithProviders } from '@test/utils/test-utils';

import * as reduxHooks from '@/store/hooks';
import { SettingsState } from '@/store/settings';

import { useSettingsStore } from './use-settings-store';

describe('useSettingsStore', () => {
  it('should return settings', () => {
    const settingsMock: SettingsState = {
      mixpanelApiKey: faker.lorem.word(),
      screebWebsiteId: faker.lorem.word(),
      muiApiKey: faker.lorem.word(),
      status: QueryStatus.uninitialized,
    };

    jest.spyOn(reduxHooks, 'useAppSelector').mockReturnValueOnce(settingsMock);

    const { result } = renderHookWithProviders(useSettingsStore);

    expect(result.current).toEqual(settingsMock);
  });
});
