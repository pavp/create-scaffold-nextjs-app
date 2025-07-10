import { faker } from '@faker-js/faker';
import { act, renderHook } from '@test/utils/test-utils';

import { usePagination } from './use-pagination';

describe('usePagination', () => {
  it('should initializes with default page 1', () => {
    const { result } = renderHook(usePagination);

    expect(result.current.page).toBe(1);
  });

  it('should initializes with default page by parameter', () => {
    const defaultPage = faker.number.int();

    const { result } = renderHook(() => usePagination(defaultPage));

    expect(result.current.page).toBe(defaultPage);
  });

  it('should updates page correctly with onChangePage', () => {
    const { result } = renderHook(usePagination);

    expect(result.current.page).toBe(1);

    act(() => result.current.onChangePage(2));

    expect(result.current.page).toBe(2);
  });
});
