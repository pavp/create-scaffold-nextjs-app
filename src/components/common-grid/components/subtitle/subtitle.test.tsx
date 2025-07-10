import { faker } from '@faker-js/faker';
import { renderWithProviders, screen } from '@test/utils/test-utils';

import { Subtitle } from '..';

describe('Subtitle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const text = faker.lorem.word();

    renderWithProviders(<Subtitle>{text}</Subtitle>);

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
