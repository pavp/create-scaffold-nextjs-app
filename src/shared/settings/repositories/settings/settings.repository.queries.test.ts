/**
 * @jest-environment jsdom
 */

import { createMockSettings, createStableSettings } from '@test/entities/settings.mock';
import { renderHookWithProviders, waitFor } from '@test/utils';

import { getQueryClient } from '@/core/lib/react-query';

import { createSettingsGateway } from './gateways';
import { settingsQueryKeys } from './settings.repository.keys';
import { settingsQueriesRepository } from './settings.repository.queries';

// Mock dependencies
jest.mock('./gateways', () => ({
  createSettingsGateway: jest.fn(),
}));

jest.mock('@/core/lib/react-query', () => ({
  ...jest.requireActual('@/core/lib/react-query'),
  getQueryClient: jest.fn(),
  createPrefetchFunction: jest.fn((getFactory: any) => async (queryClient: any, ...args: any[]) => {
    const { queryKey, queryFn } = getFactory(...args);

    await queryClient.prefetchQuery({ queryKey, queryFn });
  }),
}));

const mockedCreateSettingsGateway = createSettingsGateway as jest.MockedFunction<typeof createSettingsGateway>;
const mockedGetQueryClient = getQueryClient as jest.MockedFunction<typeof getQueryClient>;

// Mock data using faker factories for consistent testing
const mockSettings = createStableSettings();

describe('settingsQueriesRepository', () => {
  let mockGateway: any;
  let mockQueryClient: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGateway = {
      getSettings: jest.fn().mockResolvedValue(mockSettings),
      getSourceInfo: jest.fn().mockReturnValue({
        type: 'http',
        name: 'Settings HTTP Gateway',
        capabilities: {
          offline: false,
          realtime: false,
          persistence: false,
        },
      }),
    };

    mockQueryClient = {
      prefetchQuery: jest.fn(),
      cancelQueries: jest.fn(),
    };

    mockedCreateSettingsGateway.mockReturnValue(mockGateway);
    mockedGetQueryClient.mockReturnValue(mockQueryClient);
  });

  describe('useSettings', () => {
    it('should handle successful data fetching with default data source', async () => {
      mockGateway.getSettings.mockResolvedValue(mockSettings);

      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings(), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSettings);
      expect(mockedCreateSettingsGateway).toHaveBeenCalledWith('http');
      expect(mockGateway.getSettings).toHaveBeenCalled();
    });

    it('should handle successful data fetching with explicit data source', async () => {
      mockGateway.getSettings.mockResolvedValue(mockSettings);

      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('http'), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSettings);
      expect(mockedCreateSettingsGateway).toHaveBeenCalledWith('http');
    });

    it('should handle different data sources', async () => {
      const localStorageSettings = createMockSettings({ mixPanelKey: 'localStorage_key' });

      mockGateway.getSettings.mockResolvedValue(localStorageSettings);

      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('localStorage'), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(localStorageSettings);
      expect(mockedCreateSettingsGateway).toHaveBeenCalledWith('localStorage');
    });

    it('should handle query options passed to useSettings', async () => {
      mockGateway.getSettings.mockResolvedValue(mockSettings);

      const { result } = renderHookWithProviders(
        () =>
          settingsQueriesRepository.useSettings('http', {
            enabled: false,
            staleTime: 5000,
          }),
        {
          queryClientOptions: { retry: false },
        },
      );

      // Should not fetch data when enabled: false
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockGateway.getSettings).not.toHaveBeenCalled();
    });

    it('should handle loading state', async () => {
      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('http'), {
        queryClientOptions: { retry: false },
      });

      // Initial state should be loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', async () => {
      const errorMessage = 'Failed to fetch settings';

      mockGateway.getSettings.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('http'), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(expect.objectContaining({ message: errorMessage }));
      expect(result.current.data).toBeUndefined();
    });

    it('should handle settings with empty MUI key', async () => {
      const settingsWithEmptyMui = createMockSettings({ muiKey: '' });

      mockGateway.getSettings.mockResolvedValue(settingsWithEmptyMui);

      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('http'), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(settingsWithEmptyMui);
      expect(result.current.data?.muiKey).toBe('');
    });
  });

  describe('prefetch methods', () => {
    describe('prefetchSettings', () => {
      it('should prefetch settings with default data source', async () => {
        await settingsQueriesRepository.prefetch.prefetchSettings(mockQueryClient);

        expect(mockQueryClient.prefetchQuery).toHaveBeenCalledWith({
          queryKey: settingsQueryKeys.detail('http'),
          queryFn: expect.any(Function),
        });
      });

      it('should prefetch settings with specified data source', async () => {
        await settingsQueriesRepository.prefetch.prefetchSettings(mockQueryClient, 'localStorage');

        expect(mockQueryClient.prefetchQuery).toHaveBeenCalledWith({
          queryKey: settingsQueryKeys.detail('localStorage'),
          queryFn: expect.any(Function),
        });
      });

      it('should call gateway.getSettings when queryFn is executed', async () => {
        let capturedQueryFn: any;

        mockQueryClient.prefetchQuery.mockImplementation(({ queryFn }: { queryFn: any }) => {
          capturedQueryFn = queryFn;

          return Promise.resolve();
        });

        await settingsQueriesRepository.prefetch.prefetchSettings(mockQueryClient, 'http');

        // Execute the captured queryFn
        await capturedQueryFn();

        expect(mockedCreateSettingsGateway).toHaveBeenCalledWith('http');
        expect(mockGateway.getSettings).toHaveBeenCalled();
      });
    });
  });

  describe('cancellation methods', () => {
    describe('cancelSettings', () => {
      it('should cancel settings query for specific data source', async () => {
        await settingsQueriesRepository.cancel.cancelSettings('http');

        expect(mockQueryClient.cancelQueries).toHaveBeenCalledWith({
          queryKey: settingsQueryKeys.detail('http'),
        });
      });

      it('should cancel settings query for localStorage data source', async () => {
        await settingsQueriesRepository.cancel.cancelSettings('localStorage');

        expect(mockQueryClient.cancelQueries).toHaveBeenCalledWith({
          queryKey: settingsQueryKeys.detail('localStorage'),
        });
      });

      it('should handle undefined data source', async () => {
        await settingsQueriesRepository.cancel.cancelSettings(undefined);

        expect(mockQueryClient.cancelQueries).toHaveBeenCalledWith({
          queryKey: settingsQueryKeys.detail(undefined),
        });
      });
    });

    describe('cancelAll', () => {
      it('should cancel all settings queries', async () => {
        await settingsQueriesRepository.cancel.cancelAll();

        expect(mockQueryClient.cancelQueries).toHaveBeenCalledWith({
          queryKey: settingsQueryKeys.all,
        });
      });
    });
  });

  describe('integration with query keys', () => {
    it('should use correct query keys for different data sources', async () => {
      const { result: httpResult } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('http'), {
        queryClientOptions: { retry: false },
      });

      const { result: localStorageResult } = renderHookWithProviders(
        () => settingsQueriesRepository.useSettings('localStorage'),
        {
          queryClientOptions: { retry: false },
        },
      );

      await waitFor(() => {
        expect(httpResult.current.isSuccess || httpResult.current.isError).toBe(true);
        expect(localStorageResult.current.isSuccess || localStorageResult.current.isError).toBe(true);
      });

      expect(mockedCreateSettingsGateway).toHaveBeenCalledWith('http');
      expect(mockedCreateSettingsGateway).toHaveBeenCalledWith('localStorage');
    });
  });

  describe('error scenarios', () => {
    it('should handle network errors', async () => {
      mockGateway.getSettings.mockRejectedValue(new Error('Network error'));

      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('http'), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(expect.objectContaining({ message: 'Network error' }));
    });

    it('should handle gateway creation failures', async () => {
      mockedCreateSettingsGateway.mockImplementation(() => {
        throw new Error('Failed to create gateway');
      });

      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('http'), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('should handle AbortController cancellation', async () => {
      const abortError = new Error('Request aborted');

      abortError.name = 'AbortError';
      mockGateway.getSettings.mockRejectedValue(abortError);

      const { result } = renderHookWithProviders(() => settingsQueriesRepository.useSettings('http'), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(expect.objectContaining({ name: 'AbortError' }));
    });
  });
});
