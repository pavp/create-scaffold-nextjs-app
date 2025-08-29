/**
 * @jest-environment jsdom
 */

import { renderHookWithProviders, setupTodoStoreState } from '@test/utils';

import { useFiltersSelector } from './use-filters-selector.hook';

describe('useFiltersSelector', () => {
  it('should return current filters from store', () => {
    const mockFilters = {
      priority: 'high' as const,
      completed: true,
    };

    const { result } = renderHookWithProviders(() => useFiltersSelector(), {
      initialStoreStates: {
        todo: setupTodoStoreState({
          filters: mockFilters,
        }),
      },
    });

    expect(result.current.filters).toEqual(mockFilters);
  });

  it('should return empty filters when no filters set', () => {
    const { result } = renderHookWithProviders(() => useFiltersSelector(), {
      initialStoreStates: {
        todo: setupTodoStoreState({
          filters: {},
        }),
      },
    });

    expect(result.current.filters).toEqual({});
  });

  it('should return default filters from store state', () => {
    const { result } = renderHookWithProviders(() => useFiltersSelector());

    expect(result.current.filters).toBeDefined();
    expect(typeof result.current.filters).toBe('object');
  });

  it('should handle partial filter states', () => {
    const mockFilters = {
      completed: false,
    };

    const { result } = renderHookWithProviders(() => useFiltersSelector(), {
      initialStoreStates: {
        todo: setupTodoStoreState({
          filters: mockFilters,
        }),
      },
    });

    expect(result.current.filters).toEqual({ completed: false });
  });

  it('should handle complex filter combinations', () => {
    const mockFilters = {
      priority: 'medium' as const,
      completed: false,
      searchTerm: 'test search',
    };

    const { result } = renderHookWithProviders(() => useFiltersSelector(), {
      initialStoreStates: {
        todo: setupTodoStoreState({
          filters: mockFilters,
        }),
      },
    });

    expect(result.current.filters).toEqual(mockFilters);
  });
});
