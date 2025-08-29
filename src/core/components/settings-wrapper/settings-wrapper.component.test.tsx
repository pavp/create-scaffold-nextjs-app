import { faker } from '@faker-js/faker';
import { renderWithProviders, screen } from '@test/utils';

import { SettingsWrapper } from './settings-wrapper.component';

// Mock the useSettingsBusiness hook
jest.mock('@/shared/settings/hooks', () => ({
  useSettingsBusiness: jest.fn(() => ({
    mixpanelApiKey: '',
    screebWebsiteId: '',
    muiApiKey: '',
    isLoading: false,
    isError: false,
    isSuccess: true,
    error: null,
  })),
}));

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
