import { convertStringArrayToNumberArray } from './convert-string-array-to-number-array';

describe('convertStringArrayToNumberArray', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should convert string array to number array', () => {
    const stringArray = ['1', '2', '3', '4', '5'];

    const result = convertStringArrayToNumberArray(stringArray);

    const expected = [1, 2, 3, 4, 5];

    expect(result).toEqual(expected);
  });

  it('should handle empty array', () => {
    const stringArray: string[] = [];

    const result = convertStringArrayToNumberArray(stringArray);

    const expected: number[] = [];

    expect(result).toEqual(expected);
  });

  it('should handle array with non-numeric strings', () => {
    const stringArray = ['1', '2', 'three', '4', 'five'];

    const result = convertStringArrayToNumberArray(stringArray);

    const expected = [1, 2, NaN, 4, NaN];

    expect(result).toEqual(expected);
  });
});
