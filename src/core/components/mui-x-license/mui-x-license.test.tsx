import { faker } from '@faker-js/faker';
import { LicenseInfo } from '@mui/x-license';
import { render } from '@test/utils/test-utils';

import * as hooks from '@/store/settings/hooks';

import { MuiXLicense } from '..';

jest.mock('@/store/settings/hooks', () => ({
  useSettingsStore: jest.fn(),
}));

describe('MuiXLicense', () => {
  const mockApiKey = faker.lorem.word();

  beforeEach(() => {
    LicenseInfo.setLicenseKey = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set license key on mount', () => {
    jest.spyOn(hooks, 'useSettingsStore').mockReturnValueOnce({ muiApiKey: mockApiKey } as any);

    render(<MuiXLicense />);

    expect(LicenseInfo.setLicenseKey).toHaveBeenCalledWith(mockApiKey);
  });

  it('should update license key on muiApiKey change', () => {
    const newApiKey = faker.lorem.word();

    jest
      .spyOn(hooks, 'useSettingsStore')
      .mockReturnValueOnce({ muiApiKey: mockApiKey } as any)
      .mockReturnValueOnce({ muiApiKey: newApiKey } as any);

    const { rerender } = render(<MuiXLicense />);

    expect(LicenseInfo.setLicenseKey).toHaveBeenCalledWith(mockApiKey);

    rerender(<MuiXLicense />);

    expect(LicenseInfo.setLicenseKey).toHaveBeenCalledWith(newApiKey);
  });
});
