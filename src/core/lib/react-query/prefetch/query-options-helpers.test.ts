import { useQuery } from '@tanstack/react-query';

import { createPrefetchFunction } from './prefetch.helpers';
import { createPrefetchableQuery } from './query-options-helpers';

// Mock dependencies
jest.mock('@tanstack/react-query');
jest.mock('./prefetch.helpers');

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockCreatePrefetchFunction = createPrefetchFunction as jest.MockedFunction<typeof createPrefetchFunction>;

describe('query-options-helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPrefetchableQuery', () => {
    it('should create an object with useQuery, prefetch, and getQueryOptions methods', () => {
      const mockOptionsFactory = jest.fn();
      const mockPrefetchFn = jest.fn();

      mockCreatePrefetchFunction.mockReturnValue(mockPrefetchFn);

      const result = createPrefetchableQuery(mockOptionsFactory);

      expect(result).toHaveProperty('useQuery');
      expect(result).toHaveProperty('prefetch');
      expect(result).toHaveProperty('getQueryOptions');
      expect(typeof result.useQuery).toBe('function');
      expect(result.prefetch).toBe(mockPrefetchFn);
      expect(result.getQueryOptions).toBe(mockOptionsFactory);
    });

    it('should pass optionsFactory directly as getQueryOptions', () => {
      const mockOptionsFactory = jest.fn();

      mockCreatePrefetchFunction.mockReturnValue(jest.fn());

      const result = createPrefetchableQuery(mockOptionsFactory);

      expect(result.getQueryOptions).toBe(mockOptionsFactory);
    });

    describe('useQuery method', () => {
      it('should call useQuery with result from optionsFactory', () => {
        const mockOptions = {
          queryKey: ['test'],
          queryFn: jest.fn(),
        };
        const mockOptionsFactory = jest.fn().mockReturnValue(mockOptions);
        const mockQueryResult = { data: 'test', isLoading: false };

        mockUseQuery.mockReturnValue(mockQueryResult as any);
        mockCreatePrefetchFunction.mockReturnValue(jest.fn());

        const { useQuery: createdUseQuery } = createPrefetchableQuery(mockOptionsFactory);

        const result = createdUseQuery('param1', 'param2');

        expect(mockOptionsFactory).toHaveBeenCalledWith('param1', 'param2');
        expect(mockUseQuery).toHaveBeenCalledWith(mockOptions);
        expect(result).toBe(mockQueryResult);
      });

      it('should work with no parameters', () => {
        const mockOptions = {
          queryKey: ['static'],
          queryFn: jest.fn(),
        };
        const mockOptionsFactory = jest.fn().mockReturnValue(mockOptions);
        const mockQueryResult = { data: [], isLoading: true };

        mockUseQuery.mockReturnValue(mockQueryResult as any);
        mockCreatePrefetchFunction.mockReturnValue(jest.fn());

        const { useQuery: createdUseQuery } = createPrefetchableQuery(mockOptionsFactory);

        const result = createdUseQuery();

        expect(mockOptionsFactory).toHaveBeenCalledWith();
        expect(mockUseQuery).toHaveBeenCalledWith(mockOptions);
        expect(result).toBe(mockQueryResult);
      });
    });

    describe('prefetch method', () => {
      it('should create prefetch function using createPrefetchFunction', () => {
        const mockOptionsFactory = jest.fn();
        const mockPrefetchFunction = jest.fn();

        mockCreatePrefetchFunction.mockReturnValue(mockPrefetchFunction);

        const result = createPrefetchableQuery(mockOptionsFactory);

        expect(mockCreatePrefetchFunction).toHaveBeenCalledWith(expect.any(Function));
        expect(result.prefetch).toBe(mockPrefetchFunction);
      });

      it('should create factory function that extracts queryKey and queryFn from options', () => {
        const mockOptions = {
          queryKey: ['test', 'key'],
          queryFn: jest.fn(),
          staleTime: 5000,
          gcTime: 10000,
        };
        const mockOptionsFactory = jest.fn().mockReturnValue(mockOptions);

        // Capture the factory function passed to createPrefetchFunction
        let capturedFactory: Function | undefined;

        mockCreatePrefetchFunction.mockImplementation((factory) => {
          capturedFactory = factory;

          return jest.fn();
        });

        createPrefetchableQuery(mockOptionsFactory);

        // Call the captured factory to test its behavior
        expect(capturedFactory).toBeDefined();
        const result = capturedFactory!('param1', 'param2');

        expect(mockOptionsFactory).toHaveBeenCalledWith('param1', 'param2');
        expect(result).toEqual({
          queryKey: ['test', 'key'],
          queryFn: mockOptions.queryFn,
        });
      });

      it('should spread queryKey array to avoid reference issues', () => {
        const originalQueryKey = ['test', 'key'];
        const mockOptions = {
          queryKey: originalQueryKey,
          queryFn: jest.fn(),
        };
        const mockOptionsFactory = jest.fn().mockReturnValue(mockOptions);

        let capturedFactory: Function | undefined;

        mockCreatePrefetchFunction.mockImplementation((factory) => {
          capturedFactory = factory;

          return jest.fn();
        });

        createPrefetchableQuery(mockOptionsFactory);

        expect(capturedFactory).toBeDefined();
        const result = capturedFactory!();

        // Should be a new array, not the same reference
        expect(result.queryKey).toEqual(originalQueryKey);
        expect(result.queryKey).not.toBe(originalQueryKey);
      });
    });

    describe('integration behavior', () => {
      it('should handle complex parameter types', () => {
        interface TestParams {
          id: number;
          filters: { active: boolean };
        }

        const mockOptionsFactory = jest.fn().mockReturnValue({
          queryKey: ['complex'],
          queryFn: jest.fn(),
        });

        mockCreatePrefetchFunction.mockReturnValue(jest.fn());

        const result = createPrefetchableQuery<[TestParams]>(mockOptionsFactory);

        const testParams: TestParams = { id: 1, filters: { active: true } };

        result.getQueryOptions(testParams);

        expect(mockOptionsFactory).toHaveBeenCalledWith(testParams);
      });

      it('should maintain type safety with multiple parameters', () => {
        const mockOptionsFactory = jest.fn().mockReturnValue({
          queryKey: ['multi'],
          queryFn: jest.fn(),
        });

        mockCreatePrefetchFunction.mockReturnValue(jest.fn());

        const result = createPrefetchableQuery<[string, number, boolean]>(mockOptionsFactory);

        result.getQueryOptions('test', 123, true);

        expect(mockOptionsFactory).toHaveBeenCalledWith('test', 123, true);
      });

      it('should work with real-world todo example', () => {
        const mockTodoOptions = {
          queryKey: ['todos', { completed: false }],
          queryFn: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Todo' }]),
          staleTime: 5000,
        };
        const mockOptionsFactory = jest.fn().mockReturnValue(mockTodoOptions);
        const mockQueryResult = { data: [{ id: 1, title: 'Test Todo' }], isLoading: false };

        mockUseQuery.mockReturnValue(mockQueryResult as any);
        mockCreatePrefetchFunction.mockReturnValue(jest.fn());

        const todoQuery = createPrefetchableQuery(mockOptionsFactory);

        // Test useQuery
        const queryResult = todoQuery.useQuery({ completed: false });

        expect(queryResult).toBe(mockQueryResult);

        // Test getQueryOptions
        const options = todoQuery.getQueryOptions({ completed: false });

        expect(options).toBe(mockTodoOptions);

        // Test prefetch
        expect(typeof todoQuery.prefetch).toBe('function');
      });
    });
  });
});
