import { formatTwoDigitsNumber } from './format-two-digits-number';

describe('formatTwoDigitsNumber', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return number with two digits', () => {
    const value = 1;
    const expected = '01';

    const result = formatTwoDigitsNumber(value);

    expect(result).toEqual(expected);
  });
});
