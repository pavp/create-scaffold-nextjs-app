import { localeToLowerCaseFromPathname } from './locale-to-lower-case-from-pathname.helper';

describe('localeToLowerCaseFromPathname', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return locale in lower case', () => {
    const pathname = '/EN/about';
    const expected = '/en/about';

    const result = localeToLowerCaseFromPathname(pathname);

    expect(result).toEqual(expected);
  });
});
