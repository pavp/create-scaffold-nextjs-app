import { faker } from '@faker-js/faker';
import { LicenseInfo } from '@mui/x-license';
import { render } from '@test/utils';

import * as selectors from '@/shared/settings/selectors';

import { MuiXLicense } from '..';

jest.mock('@/shared/settings/selectors', () => ({
  useMuiApiKeySelector: jest.fn(),
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
    jest.spyOn(selectors, 'useMuiApiKeySelector').mockReturnValueOnce({ muiApiKey: mockApiKey });

    render(<MuiXLicense />);

    expect(LicenseInfo.setLicenseKey).toHaveBeenCalledWith(mockApiKey);
  });

  it('should update license key on muiApiKey change', () => {
    const newApiKey = faker.lorem.word();

    jest
      .spyOn(selectors, 'useMuiApiKeySelector')
      .mockReturnValueOnce({ muiApiKey: mockApiKey })
      .mockReturnValueOnce({ muiApiKey: newApiKey });

    const { rerender } = render(<MuiXLicense />);

    expect(LicenseInfo.setLicenseKey).toHaveBeenCalledWith(mockApiKey);

    rerender(<MuiXLicense />);

    expect(LicenseInfo.setLicenseKey).toHaveBeenCalledWith(newApiKey);
  });
});
