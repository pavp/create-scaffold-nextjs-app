import { faker } from '@faker-js/faker';

import { User } from '@/api/user';

export const userMock: User = {
  id: faker.string.uuid(),
  username: faker.lorem.word(),
  isAdmin: false,
  applicationName: faker.lorem.words(3),
};
