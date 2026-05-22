import { faker } from '@faker-js/faker';

import { selectValue } from './select-value.helper';

describe('selectValue', () => {
  const value1 = faker.lorem.word();
  const value2 = faker.lorem.word();
  const list = [
    { key: faker.string.uuid(), value: value1, label: faker.lorem.word() },
    { key: faker.string.uuid(), value: value2, label: faker.lorem.word() },
  ];

  it('should returns other option when value is empty, list length is 2, and dontAllowEmptyValues is true', () => {
    const value: string[] = [];
    const selectedOptions = [value1];
    const dontAllowEmptyValues = true;

    const result = selectValue({ value, selectedOptions, list, dontAllowEmptyValues });

    expect(result).toEqual([value2]);
  });

  it('should returns selected option when list length is 1 and dontAllowEmptyValues is true', () => {
    const value: string[] = [];
    const selectedOptions = [value1];
    const dontAllowEmptyValues = true;

    const result = selectValue({ value, selectedOptions, list: [list[0]], dontAllowEmptyValues });

    expect(result).toEqual([value1]);
  });

  it('should returns values array when value is not empty and dontAllowEmptyValues is false', () => {
    const value = value1;
    const selectedOptions = [value1];
    const dontAllowEmptyValues = false;

    const result = selectValue({ value, selectedOptions, list, dontAllowEmptyValues });

    expect(result).toEqual([value1]);
  });

  it('should returns values array when value is an array and dontAllowEmptyValues is false', () => {
    const value = [value1, value2];
    const selectedOptions = [value1];
    const dontAllowEmptyValues = false;

    const result = selectValue({ value, selectedOptions, list, dontAllowEmptyValues });

    expect(result).toEqual([value1, value2]);
  });

  it('should returns values when list length is 1, dontAllowEmptyValues is true and selectedOptions is empty', () => {
    const value = [value1, value2];
    const selectedOptions: string[] = [];
    const dontAllowEmptyValues = true;

    const result = selectValue({ value, selectedOptions, list: [list[0]], dontAllowEmptyValues });

    expect(result).toEqual([value1, value2]);
  });
});
