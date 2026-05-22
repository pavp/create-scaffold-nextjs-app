import { renderHookWithProviders } from '@test/utils';
import * as hooksNavigation from 'next/navigation';

import { useGetPathnameWithoutLocale } from './use-get-pathname-without-locale.hook';

const LOCALE = '/es';
const EXPECTED_PATH = '/about';

describe('useGetPathnameWithoutLocale test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove the locale from the pathname', () => {
    jest.spyOn(hooksNavigation, 'usePathname').mockImplementationOnce(() => `${LOCALE}${EXPECTED_PATH}`);

    const { result } = renderHookWithProviders(useGetPathnameWithoutLocale);

    expect(result.current).toMatchObject({ pathname: EXPECTED_PATH });
  });
});
