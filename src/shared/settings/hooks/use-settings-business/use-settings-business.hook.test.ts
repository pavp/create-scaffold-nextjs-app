/**
 * @jest-environment jsdom
 */

import { createMockSettings, createStableSettings } from '@test/entities/settings.mock';
import { act, renderHook, renderHookWithProviders } from '@test/utils';

import { settingsRepository } from '@/shared/settings/repositories/settings';
import { useMuiApiKeySelector } from '@/shared/settings/selectors';
import type { SettingsResponse } from '@/shared/settings/settings.types';
import { useSettingsActions } from '@/shared/settings/stores/settings.store.actions';

import { useSettingsBusiness } from './use-settings-business.hook';

jest.mock('@/shared/settings/repositories/settings');
jest.mock('@/shared/settings/selectors');
jest.mock('@/shared/settings/stores/settings.store');
jest.mock('@/shared/settings/stores/settings.store.actions');

jest.mock('@/shared/settings/repositories/settings/gateways', () => ({
  createSettingsGateway: jest.fn(() => ({
    getSourceInfo: jest.fn(() => ({ type: 'mock', status: 'available' })),
    getSettings: jest.fn(),
  })),
}));

const mockSettingsRepository = settingsRepository as jest.Mocked<typeof settingsRepository>;
const mockUseSettings = jest.fn() as jest.MockedFunction<any>;
const mockUseMuiApiKeySelector = useMuiApiKeySelector as jest.MockedFunction<typeof useMuiApiKeySelector>;
const mockUseSettingsActions = useSettingsActions as jest.MockedFunction<typeof useSettingsActions>;

const mockSettings: SettingsResponse = createStableSettings();

describe('useSettingsBusiness', () => {
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

    mockUseMuiApiKeySelector.mockReturnValue({ muiApiKey: mockSettings.muiKey });

    mockUseSettingsActions.mockReturnValue({
      persistSettings: mockPersistSettings,
      clearSettings: mockClearSettings,
    });

    mockUseSettings.mockReturnValue(mockQueryResult);
    mockSettingsRepository.queries.useSettings = mockUseSettings;
    mockSettingsRepository.queries.cancel.cancelAll = mockCancelAll;
  });

  describe('initial state and data flow', () => {
    it('should return settings data from store selectors', () => {
      const { result } = renderHook(() => useSettingsBusiness());

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
      mockUseSettings.mockReturnValue({ ...mockQueryResult, isSuccess: true, data: mockSettings });
      renderHook(() => useSettingsBusiness());
      expect(mockPersistSettings).toHaveBeenCalledWith(mockSettings);
    });

    it('should not persist settings when query is not successful', () => {
      mockUseSettings.mockReturnValue({ ...mockQueryResult, isSuccess: false, data: null });
      renderHook(() => useSettingsBusiness());
      expect(mockPersistSettings).not.toHaveBeenCalled();
    });

    it('should not persist settings when data is null', () => {
      mockUseSettings.mockReturnValue({ ...mockQueryResult, isSuccess: true, data: null });
      renderHook(() => useSettingsBusiness());
      expect(mockPersistSettings).not.toHaveBeenCalled();
    });

    it('should update when settings data changes', () => {
      const { result, rerender } = renderHook(() => useSettingsBusiness());
      const newSettings = createMockSettings({ muiKey: 'new_mui_key' });

      mockUseMuiApiKeySelector.mockReturnValue({ muiApiKey: newSettings.muiKey });
      rerender();

      expect(result.current.muiApiKey).toBe(newSettings.muiKey);
    });
  });

  describe('loading states', () => {
    it('should handle loading state', () => {
      mockUseSettings.mockReturnValue({ ...mockQueryResult, isLoading: true, isSuccess: false, data: null });
      const { result } = renderHook(() => useSettingsBusiness());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });

    it('should handle error state', () => {
      mockUseSettings.mockReturnValue({
        ...mockQueryResult,
        isLoading: false,
        isError: true,
        isSuccess: false,
        error: { message: 'Failed to fetch settings' },
        data: null,
      });
      const { result } = renderHook(() => useSettingsBusiness());

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe('Failed to fetch settings');
    });

    it('should handle error without message', () => {
      mockUseSettings.mockReturnValue({ ...mockQueryResult, isError: true, error: {}, data: null });
      const { result } = renderHook(() => useSettingsBusiness());
      expect(result.current.error).toBe(null);
    });

    it('should handle error with null error object', () => {
      mockUseSettings.mockReturnValue({ ...mockQueryResult, isError: true, error: null, data: null });
      const { result } = renderHook(() => useSettingsBusiness());
      expect(result.current.error).toBe(null);
    });
  });

  describe('business methods', () => {
    describe('refreshSettings', () => {
      it('should call refetch when refreshSettings is called', async () => {
        const { result } = renderHook(() => useSettingsBusiness());
        await act(async () => { await result.current.refreshSettings(); });
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });

      it('should be stable across re-renders', () => {
        const { result, rerender } = renderHook(() => useSettingsBusiness());
        const first = result.current.refreshSettings;
        rerender();
        expect(result.current.refreshSettings).toBe(first);
      });

      it('should handle refetch errors gracefully', async () => {
        const mockRefetchWithError = jest.fn().mockRejectedValue(new Error('Refetch failed'));
        mockUseSettings.mockReturnValue({ ...mockQueryResult, refetch: mockRefetchWithError });
        const { result } = renderHook(() => useSettingsBusiness());
        await expect(result.current.refreshSettings()).rejects.toThrow('Refetch failed');
      });
    });

    describe('resetSettings', () => {
      it('should call clearSettings and cancelAll when resetSettings is called', () => {
        const { result } = renderHook(() => useSettingsBusiness());
        act(() => { result.current.resetSettings(); });
        expect(mockClearSettings).toHaveBeenCalledTimes(1);
        expect(mockCancelAll).toHaveBeenCalledTimes(1);
      });

      it('should be stable across re-renders', () => {
        const { result, rerender } = renderHook(() => useSettingsBusiness());
        const first = result.current.resetSettings;
        rerender();
        expect(result.current.resetSettings).toBe(first);
      });
    });
  });

  describe('data source handling', () => {
    it('should handle different data sources', () => {
      (['http', 'localStorage'] as const).forEach((dataSource) => {
        const { result } = renderHook(() => useSettingsBusiness(dataSource));
        expect(result.current.dataSource).toBe(dataSource);
        expect(mockUseSettings).toHaveBeenCalledWith(dataSource);
      });
    });
  });

  describe('React Query integration', () => {
    it('should integrate correctly with React Query hooks', () => {
      renderHookWithProviders(() => useSettingsBusiness(), { queryClientOptions: { retry: false } });
      expect(mockUseSettings).toHaveBeenCalledWith('http');
    });

    it('should handle React Query status changes', () => {
      const { result, rerender } = renderHook(() => useSettingsBusiness());
      expect(result.current.isSuccess).toBe(true);

      mockUseSettings.mockReturnValue({ ...mockQueryResult, isLoading: true, isSuccess: false });
      rerender();

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('performance optimizations', () => {
    it('should use useCallback for business methods', () => {
      const { result, rerender } = renderHook(() => useSettingsBusiness());
      const firstRefresh = result.current.refreshSettings;
      const firstReset = result.current.resetSettings;
      rerender();
      expect(result.current.refreshSettings).toBe(firstRefresh);
      expect(result.current.resetSettings).toBe(firstReset);
    });

    it('should return expected fields', () => {
      const { result } = renderHook(() => useSettingsBusiness());
      expect(result.current).toHaveProperty('muiApiKey');
      expect(result.current).not.toHaveProperty('actions');
    });
  });
});
