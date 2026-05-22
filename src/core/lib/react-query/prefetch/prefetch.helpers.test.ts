import { createPrefetchFunction } from './prefetch.helpers';

describe('prefetch.helpers', () => {
  let mockQueryClient: {
    prefetchQuery: jest.Mock;
  };

  beforeEach(() => {
    mockQueryClient = {
      prefetchQuery: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPrefetchFunction', () => {
    it('should create a function that calls queryClient.prefetchQuery', async () => {
      const mockFactory = jest.fn().mockReturnValue({
        queryKey: ['test', 'key'],
        queryFn: jest.fn().mockResolvedValue('test data'),
      });

      const prefetchFunction = createPrefetchFunction(mockFactory);

      await prefetchFunction(mockQueryClient as any, 'arg1', 'arg2');

      expect(mockFactory).toHaveBeenCalledWith('arg1', 'arg2');
      expect(mockQueryClient.prefetchQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['test', 'key'],
          queryFn: expect.any(Function),
        }),
      );
    });

    it('should pass through factory function parameters correctly', async () => {
      const mockFactory = jest.fn().mockReturnValue({
        queryKey: ['user', 1],
        queryFn: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
      });

      const prefetchFunction = createPrefetchFunction(mockFactory);
      const filters = { active: true };
      const dataSource = 'http';

      await prefetchFunction(mockQueryClient as any, filters, dataSource);

      expect(mockFactory).toHaveBeenCalledWith(filters, dataSource);
    });

    it('should handle factory functions with no parameters', async () => {
      const mockFactory = jest.fn().mockReturnValue({
        queryKey: ['static'],
        queryFn: jest.fn().mockResolvedValue('static data'),
      });

      const prefetchFunction = createPrefetchFunction(mockFactory);

      await prefetchFunction(mockQueryClient as any);

      expect(mockFactory).toHaveBeenCalledWith();
      expect(mockQueryClient.prefetchQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['static'],
          queryFn: expect.any(Function),
        }),
      );
    });

    it('should propagate errors from factory function', async () => {
      const mockFactory = jest.fn().mockImplementation(() => {
        throw new Error('Factory error');
      });

      const prefetchFunction = createPrefetchFunction(mockFactory);

      await expect(prefetchFunction(mockQueryClient as any)).rejects.toThrow('Factory error');
    });

    it('should propagate errors from queryClient.prefetchQuery', async () => {
      const mockFactory = jest.fn().mockReturnValue({
        queryKey: ['failing'],
        queryFn: jest.fn().mockRejectedValue(new Error('Prefetch failed')),
      });

      mockQueryClient.prefetchQuery.mockRejectedValue(new Error('Prefetch failed'));

      const prefetchFunction = createPrefetchFunction(mockFactory);

      await expect(prefetchFunction(mockQueryClient as any)).rejects.toThrow('Prefetch failed');
    });

    it('should extract queryKey and queryFn from factory result', async () => {
      const mockQueryFn = jest.fn().mockResolvedValue('result');
      const mockFactory = jest.fn().mockReturnValue({
        queryKey: ['test', 'extract'],
        queryFn: mockQueryFn,
      });

      const prefetchFunction = createPrefetchFunction(mockFactory);

      await prefetchFunction(mockQueryClient as any);

      const prefetchCall = mockQueryClient.prefetchQuery.mock.calls[0][0];

      expect(prefetchCall.queryKey).toEqual(['test', 'extract']);
      expect(typeof prefetchCall.queryFn).toBe('function');
    });

    it('should handle complex factory return objects', async () => {
      const mockFactory = jest.fn().mockReturnValue({
        queryKey: ['complex', { filters: { active: true } }],
        queryFn: async () => [{ id: 1 }, { id: 2 }],
        additionalProperty: 'ignored', // Should be ignored
      });

      const prefetchFunction = createPrefetchFunction(mockFactory);

      await prefetchFunction(mockQueryClient as any, { active: true });

      expect(mockQueryClient.prefetchQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['complex', { filters: { active: true } }],
          queryFn: expect.any(Function),
        }),
      );
    });

    it('should work with different parameter types', async () => {
      const mockFactory = jest.fn().mockReturnValue({
        queryKey: ['typed'],
        queryFn: jest.fn(),
      });

      const prefetchFunction = createPrefetchFunction(mockFactory);

      // Test with string
      await prefetchFunction(mockQueryClient as any, 'string-param');
      expect(mockFactory).toHaveBeenCalledWith('string-param');

      // Test with number
      await prefetchFunction(mockQueryClient as any, 123);
      expect(mockFactory).toHaveBeenCalledWith(123);

      // Test with object
      await prefetchFunction(mockQueryClient as any, { key: 'value' });
      expect(mockFactory).toHaveBeenCalledWith({ key: 'value' });

      // Test with multiple params
      await prefetchFunction(mockQueryClient as any, 'a', 'b', 'c');
      expect(mockFactory).toHaveBeenCalledWith('a', 'b', 'c');
    });

    it('should handle successful queryFn execution with actual data', async () => {
      const expectedData = { id: 1, name: 'Test' };
      const mockQueryFn = jest.fn().mockResolvedValue(expectedData);
      const mockFactory = jest.fn().mockReturnValue({
        queryKey: ['success'],
        queryFn: mockQueryFn,
      });

      // Configure prefetchQuery to actually call the queryFn
      mockQueryClient.prefetchQuery.mockImplementation(async ({ queryFn }) => {
        const result = await queryFn();

        return result;
      });

      const prefetchFunction = createPrefetchFunction(mockFactory);

      await prefetchFunction(mockQueryClient as any);

      expect(mockQueryFn).toHaveBeenCalled();
    });
  });
});
