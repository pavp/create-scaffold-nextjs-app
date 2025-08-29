import { getFirstItemFromArray } from './get-first-item-from-array.helper';

describe('getFirstItemFromArray', () => {
  afterEach(() => jest.clearAllMocks());

  test('If the array has values then we only should get the first item', () => {
    const items = ['1', '2', '3'];

    expect(getFirstItemFromArray(items)).toEqual('1');
  });

  test('If array is empty then we should not expect a value', () => {
    const items: string[] = [];

    expect(getFirstItemFromArray(items)).toBeUndefined();
  });
});
