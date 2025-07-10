import { faker } from '@faker-js/faker';
import { renderWithProviders, screen } from '@test/utils/test-utils';

import { SettingsWrapper } from './settings-wrapper';

describe('SettingsWrapper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const word = faker.lorem.word();

    renderWithProviders(
      <SettingsWrapper>
        <div>{word}</div>
      </SettingsWrapper>,
    );
    const children = screen.getByText(word);

    expect(children).toBeInTheDocument();
  });
});
