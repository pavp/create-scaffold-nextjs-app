import { buildQueryParams } from './query-params.helper';

describe('buildQueryParams', () => {
  it('should return empty object when no filters provided', () => {
    expect(buildQueryParams()).toEqual({});
    expect(buildQueryParams({})).toEqual({});
  });

  it('should build query params for search filter', () => {
    const params = buildQueryParams({ search: 'test search' });

    expect(params).toEqual({ search: 'test search' });
  });

  it('should build query params for completed filter', () => {
    const params = buildQueryParams({ completed: true });

    expect(params).toEqual({ completed: true });
  });

  it('should build query params for priority filter', () => {
    const params = buildQueryParams({ priority: 'high' });

    expect(params).toEqual({ priority: 'high' });
  });

  it('should build query params for date filters', () => {
    const params = buildQueryParams({
      dueBefore: '2023-12-31',
      dueAfter: '2023-01-01',
    });

    expect(params).toEqual({
      dueBefore: '2023-12-31',
      dueAfter: '2023-01-01',
    });
  });

  it('should build query params for sorting', () => {
    const params = buildQueryParams({
      sortBy: 'title',
      sortOrder: 'desc',
    });

    expect(params).toEqual({
      sortBy: 'title',
      sortOrder: 'desc',
    });
  });

  it('should combine multiple filters', () => {
    const params = buildQueryParams({
      search: 'test',
      completed: false,
      priority: 'medium',
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });

    expect(params).toEqual({
      search: 'test',
      completed: false,
      priority: 'medium',
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });
  });
});
