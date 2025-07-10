import { sortArrayByField } from './sort-array-by-field';

const array = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('sortArrayByField', () => {
  it('should order array asc', () => {
    const result = sortArrayByField(array, 'id');

    expect(result[0].id).toEqual(1);
    expect(result[1].id).toEqual(2);
    expect(result[2].id).toEqual(3);
  });

  it('should order array desc', () => {
    const result = sortArrayByField(array, 'id', false);

    expect(result[0].id).toEqual(3);
    expect(result[1].id).toEqual(2);
    expect(result[2].id).toEqual(1);
  });
});
