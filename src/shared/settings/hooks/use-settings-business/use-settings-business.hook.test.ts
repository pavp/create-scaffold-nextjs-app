/**
 * @jest-environment jsdom
 */

import { createMockSettings, createStableSettings } from '@test/entities/settings.mock';
import { act, renderHook, renderHookWithProviders } from '@test/utils';

import { settingsRepository } from '@/shared/settings/repositories/settings';
import {
  useMixpanelApiKeySelector,
  useMuiApiKeySelector,
  useScreebWebsiteIdSelector,
} from '@/shared/settings/selectors';
import type { SettingsResponse } from '@/shared/settings/settings.types';
import { useSettingsActions } from '@/shared/settings/stores/settings.store.actions';

import { useSettingsBusiness } from './use-settings-business.hook';

// Mock dependencies
jest.mock('@/shared/settings/repositories/settings');
jest.mock('@/shared/settings/selectors');
jest.mock('@/shared/settings/stores/settings.store');
jest.mock('@/shared/settings/stores/settings.store.actions');

// Mock settings gateway to avoid initialization issues
jest.mock('@/shared/settings/repositories/settings/gateways', () => ({
  createSettingsGateway: jest.fn(() => ({
    getSourceInfo: jest.fn(() => ({ type: 'mock', status: 'available' })),
    getSettings: jest.fn(),
  })),
}));

const mockSettingsRepository = settingsRepository as jest.Mocked<typeof settingsRepository>;
const mockUseSettings = jest.fn() as jest.MockedFunction<any>;
const mockUseMixpanelApiKeySelector = useMixpanelApiKeySelector as jest.MockedFunction<
  typeof useMixpanelApiKeySelector
>;
const mockUseMuiApiKeySelector = useMuiApiKeySelector as jest.MockedFunction<typeof useMuiApiKeySelector>;
const mockUseScreebWebsiteIdSelector = useScreebWebsiteIdSelector as jest.MockedFunction<
  typeof useScreebWebsiteIdSelector
>;
const mockUseSettingsActions = useSettingsActions as jest.MockedFunction<typeof useSettingsActions>;

// Mock data with proper TypeScript types
const mockSettings: SettingsResponse = createStableSettings();

describe('useSettingsBusiness', () => {
  // Mock implementations with proper TypeScript types
  const mockPersistSettings = jest.fn<void, [SettingsResponse]>();
  const mockClearSettings = jest.fn<void, []>();
  const mockRefetch = jest.fn();
  const mockCancelAll = jest.fn();

  const mockQueryResult = {
    data: mockSettings,
    isLoading: false,
    isError: false,
    isSuccess: true,
    error: null,
    refetch: mockRefetch,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock selectors
    mockUseMixpanelApiKeySelector.mockReturnValue({
      mixpanelApiKey: mockSettings.mixPanelKey,
    });

    mockUseMuiApiKeySelector.mockReturnValue({
      muiApiKey: mockSettings.muiKey,
    });

    mockUseScreebWebsiteIdSelector.mockReturnValue({
      screebWebsiteId: mockSettings.screeb_website_id,
    });

    // Mock actions
    mockUseSettingsActions.mockReturnValue({
      persistSettings: mockPersistSettings,
      clearSettings: mockClearSettings,
    });

    // Mock repository
    mockUseSettings.mockReturnValue(mockQueryResult);
    mockSettingsRepository.queries.useSettings = mockUseSettings;
    mockSettingsRepository.queries.cancel.cancelAll = mockCancelAll;
  });

  describe('initial state and data flow', () => {
    it('should return settings data from store selectors', () => {
      const { result } = renderHook(() => useSettingsBusiness());

      expect(result.current.mixpanelApiKey).toBe(mockSettings.mixPanelKey);
      expect(result.current.screebWebsiteId).toBe(mockSettings.screeb_website_id);
      expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
    });

    it('should return React Query status', () => {
      const { result } = renderHook(() => useSettingsBusiness());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should use default data source', () => {
      renderHook(() => useSettingsBusiness());

      expect(mockUseSettings).toHaveBeenCalledWith('http');
    });

    it('should use custom data source', () => {
      renderHook(() => useSettingsBusiness('localStorage'));

      expect(mockUseSettings).toHaveBeenCalledWith('localStorage');
    });

    it('should return current data source', () => {
      const { result } = renderHook(() => useSettingsBusiness('localStorage'));

      expect(result.current.dataSource).toBe('localStorage');
    });
  });

  describe('data synchronization', () => {
    it('should persist settings to store when query is successful', () => {
      const successfulQuery = {
        ...mockUseSettings,
        isSuccess: true,
        data: mockSettings,
      };

      mockUseSettings.mockReturnValue(successfulQuery as any);

      renderHook(() => useSettingsBusiness());

      expect(mockPersistSettings).toHaveBeenCalledWith(mockSettings);
    });

    it('should not persist settings when query is not successful', () => {
      const failedQuery = {
        ...mockUseSettings,
        isSuccess: false,
        data: null,
      };

      mockUseSettings.mockReturnValue(failedQuery as any);

      renderHook(() => useSettingsBusiness());

      expect(mockPersistSettings).not.toHaveBeenCalled();
    });

    it('should not persist settings when data is null', () => {
      const queryWithoutData = {
        ...mockUseSettings,
        isSuccess: true,
        data: null,
      };

      mockUseSettings.mockReturnValue(queryWithoutData as any);

      renderHook(() => useSettingsBusiness());

      expect(mockPersistSettings).not.toHaveBeenCalled();
    });

    it('should update when settings data changes', () => {
      const { result, rerender } = renderHook(() => useSettingsBusiness());

      // Change the mock data
      const newSettings = createMockSettings({
        mixPanelKey: 'new_mixpanel_key',
      });

      mockUseMixpanelApiKeySelector.mockReturnValue({
        mixpanelApiKey: newSettings.mixPanelKey,
      });

      rerender();

      expect(result.current.mixpanelApiKey).toBe(newSettings.mixPanelKey);
    });
  });

  describe('loading states', () => {
    it('should handle loading state', () => {
      const loadingQuery = {
        ...mockUseSettings,
        isLoading: true,
        isSuccess: false,
        data: null,
      };

      mockUseSettings.mockReturnValue(loadingQuery as any);

      const { result } = renderHook(() => useSettingsBusiness());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      // Note: data property doesn't exist on the hook return, using selector values instead
    });

    it('should handle error state', () => {
      const errorQuery = {
        ...mockUseSettings,
        isLoading: false,
        isError: true,
        isSuccess: false,
        error: { message: 'Failed to fetch settings' },
        data: null,
      };

      mockUseSettings.mockReturnValue(errorQuery as any);

      const { result } = renderHook(() => useSettingsBusiness());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBe('Failed to fetch settings');
    });

    it('should handle error without message', () => {
      const errorQuery = {
        ...mockUseSettings,
        isError: true,
        error: {},
        data: null,
      };

      mockUseSettings.mockReturnValue(errorQuery as any);

      const { result } = renderHook(() => useSettingsBusiness());

      expect(result.current.error).toBe(null);
    });

    it('should handle error with null error object', () => {
      const errorQuery = {
        ...mockUseSettings,
        isError: true,
        error: null,
        data: null,
      };

      mockUseSettings.mockReturnValue(errorQuery as any);

      const { result } = renderHook(() => useSettingsBusiness());

      expect(result.current.error).toBe(null);
    });
  });

  describe('business methods', () => {
    describe('refreshSettings', () => {
      it('should call refetch when refreshSettings is called', async () => {
        const { result } = renderHook(() => useSettingsBusiness());

        await act(async () => {
          await result.current.refreshSettings();
        });

        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });

      it('should be stable across re-renders', () => {
        const { result, rerender } = renderHook(() => useSettingsBusiness());
        const firstRefreshSettings = result.current.refreshSettings;

        rerender();

        const secondRefreshSettings = result.current.refreshSettings;

        expect(firstRefreshSettings).toBe(secondRefreshSettings);
      });

      it('should handle refetch errors gracefully', async () => {
        const mockRefetchWithError = jest.fn().mockRejectedValue(new Error('Refetch failed'));
        const queryWithErrorRefetch = {
          ...mockUseSettings,
          refetch: mockRefetchWithError,
        };

        mockUseSettings.mockReturnValue(queryWithErrorRefetch as any);

        const { result } = renderHook(() => useSettingsBusiness());

        await expect(result.current.refreshSettings()).rejects.toThrow('Refetch failed');
        expect(mockRefetchWithError).toHaveBeenCalledTimes(1);
      });
    });

    describe('resetSettings', () => {
      it('should call clearSettings and cancelAll when resetSettings is called', () => {
        const { result } = renderHook(() => useSettingsBusiness());

        act(() => {
          result.current.resetSettings();
        });

        expect(mockClearSettings).toHaveBeenCalledTimes(1);
        expect(mockCancelAll).toHaveBeenCalledTimes(1);
      });

      it('should be stable across re-renders', () => {
        const { result, rerender } = renderHook(() => useSettingsBusiness());
        const firstResetSettings = result.current.resetSettings;

        rerender();

        const secondResetSettings = result.current.resetSettings;

        expect(firstResetSettings).toBe(secondResetSettings);
      });
    });
  });

  describe('granular selectors integration', () => {
    it('should use granular selectors for optimal performance', () => {
      renderHook(() => useSettingsBusiness());

      expect(mockUseMixpanelApiKeySelector).toHaveBeenCalledTimes(1);
      expect(mockUseMuiApiKeySelector).toHaveBeenCalledTimes(1);
      expect(mockUseScreebWebsiteIdSelector).toHaveBeenCalledTimes(1);
    });

    it('should re-render only when relevant selector data changes', () => {
      const { result, rerender } = renderHook(() => useSettingsBusiness());

      // Change only mixpanel key
      mockUseMixpanelApiKeySelector.mockReturnValue({
        mixpanelApiKey: 'new_mixpanel_key',
      });

      rerender();

      expect(result.current.mixpanelApiKey).toBe('new_mixpanel_key');
      // Other values should remain the same
      expect(result.current.screebWebsiteId).toBe(mockSettings.screeb_website_id);
      expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
    });
  });

  describe('data source handling', () => {
    it('should handle different data sources', () => {
      const dataSources = ['http', 'localStorage'] as const;

      dataSources.forEach((dataSource) => {
        const { result } = renderHook(() => useSettingsBusiness(dataSource));

        expect(result.current.dataSource).toBe(dataSource);
        expect(mockUseSettings).toHaveBeenCalledWith(dataSource);
      });
    });
  });

  describe('React Query integration', () => {
    it('should integrate correctly with React Query hooks', () => {
      renderHookWithProviders(() => useSettingsBusiness(), {
        queryClientOptions: { retry: false },
      });

      expect(mockUseSettings).toHaveBeenCalledWith('http');
    });

    it('should handle React Query status changes', () => {
      const { result, rerender } = renderHook(() => useSettingsBusiness());

      // Initially success
      expect(result.current.isSuccess).toBe(true);

      // Simulate loading state
      mockUseSettings.mockReturnValue({
        ...mockUseSettings,
        isLoading: true,
        isSuccess: false,
      } as any);

      rerender();

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('hybrid architecture validation', () => {
    it('should implement hybrid approach: React Query for status + Zustand for persistence', () => {
      const { result } = renderHook(() => useSettingsBusiness());

      // React Query provides status
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.isError).toBeDefined();
      expect(result.current.isSuccess).toBeDefined();
      expect(result.current.error).toBeDefined();

      // Zustand store provides persisted data
      expect(result.current.mixpanelApiKey).toBeDefined();
      expect(result.current.screebWebsiteId).toBeDefined();
      expect(result.current.muiApiKey).toBeDefined();

      // Actions combine both systems
      expect(typeof result.current.refreshSettings).toBe('function');
      expect(typeof result.current.resetSettings).toBe('function');
    });

    it('should maintain separation of concerns', () => {
      renderHook(() => useSettingsBusiness());

      // Verify React Query is used for queries
      expect(mockUseSettings).toHaveBeenCalled();

      // Verify Zustand selectors are used for data
      expect(mockUseMixpanelApiKeySelector).toHaveBeenCalled();
      expect(mockUseMuiApiKeySelector).toHaveBeenCalled();
      expect(mockUseScreebWebsiteIdSelector).toHaveBeenCalled();

      // Verify Zustand actions are used for state management
      expect(mockUseSettingsActions).toHaveBeenCalled();
    });
  });

  describe('performance optimizations', () => {
    it('should use useCallback for business methods', () => {
      const { result, rerender } = renderHook(() => useSettingsBusiness());

      const firstRefreshSettings = result.current.refreshSettings;
      const firstResetSettings = result.current.resetSettings;

      rerender();

      const secondRefreshSettings = result.current.refreshSettings;
      const secondResetSettings = result.current.resetSettings;

      expect(firstRefreshSettings).toBe(secondRefreshSettings);
      expect(firstResetSettings).toBe(secondResetSettings);
    });

    it('should minimize re-renders through granular selectors', () => {
      const { result } = renderHook(() => useSettingsBusiness());

      // Selectors should be called once during initial render
      expect(mockUseMixpanelApiKeySelector).toHaveBeenCalledTimes(1);
      expect(mockUseMuiApiKeySelector).toHaveBeenCalledTimes(1);
      expect(mockUseScreebWebsiteIdSelector).toHaveBeenCalledTimes(1);

      // Result should contain specific fields without unnecessary data
      expect(result.current).toHaveProperty('mixpanelApiKey');
      expect(result.current).toHaveProperty('screebWebsiteId');
      expect(result.current).toHaveProperty('muiApiKey');
      expect(result.current).not.toHaveProperty('actions'); // Actions are internal
    });
  });
});
