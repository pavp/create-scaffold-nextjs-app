import { faker } from '@faker-js/faker';
import { QueryStatus } from '@reduxjs/toolkit/query';

import { SettingsState } from '@/store/settings';

export const settingsMock: SettingsState = {
  mixpanelApiKey: faker.lorem.word(),
  screebWebsiteId: faker.lorem.word(),
  status: QueryStatus.fulfilled,
  muiApiKey: '',
};
