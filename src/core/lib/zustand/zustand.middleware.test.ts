import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { config } from '@/config';

import { createStoreWithMiddleware } from './zustand.middleware';

// Mock config
jest.mock('@/config', () => ({
  config: {
    isDev: false,
  },
}));

// Mock zustand and middleware
jest.mock('zustand', () => ({
  create: jest.fn(),
}));

jest.mock('zustand/middleware', () => ({
  createJSONStorage: jest.fn(),
  devtools: jest.fn(),
  persist: jest.fn(),
}));

jest.mock('zustand/middleware/immer', () => ({
  immer: jest.fn(),
}));

const mockCreate = create as jest.MockedFunction<typeof create>;
const mockDevtools = devtools as jest.MockedFunction<typeof devtools>;
const mockPersist = persist as jest.MockedFunction<typeof persist>;
const mockImmer = immer as jest.MockedFunction<typeof immer>;
const mockCreateJSONStorage = createJSONStorage as jest.MockedFunction<typeof createJSONStorage>;
const mockConfig = config as jest.Mocked<typeof config>;

describe('zustand.middleware', () => {
  let mockStoreInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock store instance
    mockStoreInstance = {
      getState: jest.fn(),
      setState: jest.fn(),
      subscribe: jest.fn(),
    };

    // Setup create to return a function that returns the store
    mockCreate.mockImplementation(() => () => mockStoreInstance);

    // Setup middleware to pass through
    mockDevtools.mockImplementation((fn: any) => fn);
    mockPersist.mockImplementation((fn: any) => fn);
    mockImmer.mockImplementation((fn: any) => fn);
    mockCreateJSONStorage.mockReturnValue({} as any);

    // Mock config
    mockConfig.isDev = false;
  });

  describe('createStoreWithMiddleware', () => {
    const mockStoreCreator = jest.fn().mockReturnValue({
      count: 0,
      increment: jest.fn(),
    });

    it('should create basic store with immer by default', () => {
      createStoreWithMiddleware(mockStoreCreator, 'test-store');

      expect(mockCreate).toHaveBeenCalled();
      expect(mockImmer).toHaveBeenCalled();
      expect(mockPersist).not.toHaveBeenCalled();
      expect(mockDevtools).not.toHaveBeenCalled();
    });

    it('should apply devtools middleware in development', () => {
      mockConfig.isDev = true;

      createStoreWithMiddleware(mockStoreCreator, 'test-store');

      expect(mockDevtools).toHaveBeenCalledWith(expect.any(Function), { name: 'test-store' });
    });

    it('should not apply devtools middleware in production', () => {
      mockConfig.isDev = false;

      createStoreWithMiddleware(mockStoreCreator, 'test-store');

      expect(mockDevtools).not.toHaveBeenCalled();
    });

    it('should not apply immer middleware when disabled', () => {
      createStoreWithMiddleware(mockStoreCreator, 'test-store', { immer: false });

      expect(mockImmer).not.toHaveBeenCalled();
    });

    it('should apply persist middleware when enabled', () => {
      createStoreWithMiddleware(mockStoreCreator, 'test-store', { persist: true });

      expect(mockPersist).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          name: 'test-store-storage',
          version: 1,
        }),
      );
    });

    it('should use localStorage by default', () => {
      createStoreWithMiddleware(mockStoreCreator, 'test-store', { persist: true });

      expect(mockCreateJSONStorage).toHaveBeenCalledWith(expect.any(Function));

      // Get the storage factory function and test it returns localStorage
      const storageFactory = mockCreateJSONStorage.mock.calls[0][0];

      expect(storageFactory()).toBe(localStorage);
    });

    it('should use sessionStorage when specified', () => {
      createStoreWithMiddleware(mockStoreCreator, 'test-store', {
        persist: true,
        storage: 'sessionStorage',
      });

      const storageFactory = mockCreateJSONStorage.mock.calls[0][0];

      expect(storageFactory()).toBe(sessionStorage);
    });

    it('should use custom version when provided', () => {
      createStoreWithMiddleware(mockStoreCreator, 'test-store', {
        persist: true,
        version: 2,
      });

      expect(mockPersist).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          version: 2,
        }),
      );
    });

    it('should call store creator with proper arguments', () => {
      const mockSet = jest.fn();
      const mockGet = jest.fn();

      // Setup create to call the enhanced store creator
      mockCreate.mockImplementation(() => (enhancedCreator) => {
        enhancedCreator(mockSet, mockGet, mockStoreInstance);

        return mockStoreInstance;
      });

      createStoreWithMiddleware(mockStoreCreator, 'test-store');

      expect(mockStoreCreator).toHaveBeenCalledWith(
        expect.any(Function), // Enhanced set function
        mockGet,
        mockStoreInstance, // API object passed by Zustand
      );
    });

    describe('partialize function', () => {
      it('should exclude actions from persistence', () => {
        createStoreWithMiddleware(mockStoreCreator, 'test-store', { persist: true });

        const persistConfig = mockPersist.mock.calls[0][1];
        const mockState = {
          count: 5,
          user: 'test',
          actions: {
            increment: jest.fn(),
            decrement: jest.fn(),
          },
        };

        const result = persistConfig.partialize!(mockState);

        expect(result).toEqual({
          count: 5,
          user: 'test',
        });
        expect(result).not.toHaveProperty('actions');
      });

      it('should exclude specified keys from persistence', () => {
        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: true,
          exclude: ['loading', 'error'],
        });

        const persistConfig = mockPersist.mock.calls[0][1];
        const mockState = {
          data: [1, 2, 3],
          loading: true,
          error: 'Some error',
          user: 'test',
        };

        const result = persistConfig.partialize!(mockState);

        expect(result).toEqual({
          data: [1, 2, 3],
          user: 'test',
        });
        expect(result).not.toHaveProperty('loading');
        expect(result).not.toHaveProperty('error');
      });

      it('should handle state without actions property', () => {
        createStoreWithMiddleware(mockStoreCreator, 'test-store', { persist: true });

        const persistConfig = mockPersist.mock.calls[0][1];
        const mockState = {
          count: 5,
          user: 'test',
        };

        const result = persistConfig.partialize!(mockState);

        expect(result).toEqual({
          count: 5,
          user: 'test',
        });
      });

      it('should handle empty exclude array', () => {
        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: true,
          exclude: [],
        });

        const persistConfig = mockPersist.mock.calls[0][1];
        const mockState = { count: 5 };
        const result = persistConfig.partialize!(mockState);

        expect(result).toEqual({ count: 5 });
      });
    });

    describe('middleware combinations', () => {
      it('should apply immer + persist + devtools in development', () => {
        mockConfig.isDev = true;

        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: true,
          immer: true,
        });

        expect(mockImmer).toHaveBeenCalled();
        expect(mockPersist).toHaveBeenCalled();
        expect(mockDevtools).toHaveBeenCalled();
      });

      it('should apply immer + persist without devtools in production', () => {
        mockConfig.isDev = false;

        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: true,
          immer: true,
        });

        expect(mockImmer).toHaveBeenCalled();
        expect(mockPersist).toHaveBeenCalled();
        expect(mockDevtools).not.toHaveBeenCalled();
      });

      it('should handle persist without immer', () => {
        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: true,
          immer: false,
        });

        expect(mockImmer).not.toHaveBeenCalled();
        expect(mockPersist).toHaveBeenCalled();
      });

      it('should handle immer without persist', () => {
        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: false,
          immer: true,
        });

        expect(mockImmer).toHaveBeenCalled();
        expect(mockPersist).not.toHaveBeenCalled();
      });

      it('should handle no middleware', () => {
        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: false,
          immer: false,
        });

        expect(mockImmer).not.toHaveBeenCalled();
        expect(mockPersist).not.toHaveBeenCalled();
        expect(mockDevtools).not.toHaveBeenCalled();
      });

      it('should handle persist without immer in development', () => {
        mockConfig.isDev = true;

        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: true,
          immer: false,
        });

        expect(mockImmer).not.toHaveBeenCalled();
        expect(mockPersist).toHaveBeenCalled();
        expect(mockDevtools).toHaveBeenCalled();
      });

      it('should handle devtools only in development', () => {
        mockConfig.isDev = true;

        createStoreWithMiddleware(mockStoreCreator, 'test-store', {
          persist: false,
          immer: false,
        });

        expect(mockImmer).not.toHaveBeenCalled();
        expect(mockPersist).not.toHaveBeenCalled();
        expect(mockDevtools).toHaveBeenCalled();
      });
    });
  });
});
