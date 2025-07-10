import { removeFirstSegmentFromPathname } from './remove-first-segment-from-pathname';

describe('removeFirstSegmentFromPathname', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove the first segment from the pathname', () => {
    const pathname = '/en-US/about';
    const expected = '/about';

    const result = removeFirstSegmentFromPathname(pathname);

    expect(result).toEqual(expected);
  });

  it('should handle empty pathname', () => {
    const pathname = '';
    const expected = '';

    const result = removeFirstSegmentFromPathname(pathname);

    expect(result).toEqual(expected);
  });

  it('should handle pathname with only one segment', () => {
    const pathname = '/about';
    const expected = '';

    const result = removeFirstSegmentFromPathname(pathname);

    expect(result).toEqual(expected);
  });
});
