import { act, renderHookWithProviders } from '@test/utils';
import * as nextIntlHooks from 'next-intl';

import { useFormatDate } from './use-format-date.hook';

jest.mock('@/core/hooks');

const useFormatterMock = {
  list: jest.fn(),
  relativeTime: jest.fn(),
  number: jest.fn(),
  dateTime: jest.fn((date) => {
    const formattedDate = new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .format(new Date(date))
      .replace(',', '');

    return formattedDate;
  }),
  dateTimeRange: jest.fn(),
};

const MOCK_ISO_DATE = '2021-12-30T15:30:29'; // If does not have Z at the end of the word is considered localtime
const EXPECTED_DATE = '30/12/2021 15:30';

describe('useFormatDate test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct format date', () => {
    let date;

    jest.spyOn(nextIntlHooks, 'useFormatter').mockReturnValueOnce(useFormatterMock);

    const { result } = renderHookWithProviders(useFormatDate);
    const { formatDate } = result.current;

    act(() => {
      date = formatDate(new Date(MOCK_ISO_DATE));
    });

    expect(date).toEqual(`${EXPECTED_DATE} / ${EXPECTED_DATE}`);
  });
});
