import { getNextId } from './id-generator.helper';

describe('getNextId', () => {
  it('should return 1 for empty array', () => {
    expect(getNextId([])).toBe(1);
  });

  it('should return next highest numeric ID', () => {
    const todos = [{ id: 1 }, { id: 3 }, { id: 2 }];

    expect(getNextId(todos)).toBe(4);
  });

  it('should handle string IDs by converting to numbers', () => {
    const todos = [{ id: '1' }, { id: '5' }, { id: '3' }];

    expect(getNextId(todos)).toBe(6);
  });

  it('should handle mixed string/number IDs', () => {
    const todos = [{ id: 1 }, { id: '7' }, { id: 3 }];

    expect(getNextId(todos)).toBe(8);
  });

  it('should filter out non-numeric string IDs', () => {
    const todos = [{ id: 'abc' }, { id: 2 }, { id: 'xyz' }];

    expect(getNextId(todos)).toBe(3);
  });

  it('should return 1 when only non-numeric IDs exist', () => {
    const todos = [{ id: 'abc' }, { id: 'xyz' }];

    expect(getNextId(todos)).toBe(1);
  });
});
