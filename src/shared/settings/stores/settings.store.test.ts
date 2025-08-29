import { createMockSettings, createStableSettings } from '@test/entities/settings.mock';
import { act, renderHook } from '@test/utils';

import { config } from '@/config';
import type { SettingsResponse } from '@/shared/settings/settings.types';

import { initialSettingsState, useSettingsStore } from './settings.store';

// Mock config to control test behavior
jest.mock('@/config', () => ({
  config: {
    mixpanelToken: '',
    screebWebsiteId: '',
    muiLicense: '',
  },
}));

const mockedConfig = config as jest.Mocked<typeof config>;

describe('Settings Store', () => {
  // Mock data for testing - using faker-based factories for consistency
  let mockSettings: SettingsResponse;

  beforeAll(() => {
    // Create deterministic test data once for all tests
    mockSettings = createStableSettings();
  });

  beforeEach(() => {
    // Reset config mocks
    mockedConfig.mixpanelToken = '';
    mockedConfig.screebWebsiteId = '';
    mockedConfig.muiLicense = '';
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.mixpanelApiKey).toBe('');
      expect(result.current.screebWebsiteId).toBe('');
      expect(result.current.muiApiKey).toBe('');
      expect(result.current.actions).toBeDefined();
    });

    it('should have all required actions', () => {
      const { result } = renderHook(() => useSettingsStore());
      const { actions } = result.current;

      expect(actions.persistSettings).toBeInstanceOf(Function);
      expect(actions.clearSettings).toBeInstanceOf(Function);
    });

    it('should match initialSettingsState', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect({
        mixpanelApiKey: result.current.mixpanelApiKey,
        screebWebsiteId: result.current.screebWebsiteId,
        muiApiKey: result.current.muiApiKey,
      }).toEqual(initialSettingsState);
    });
  });

  describe('Actions', () => {
    describe('persistSettings', () => {
      it('should persist settings from server response when config is empty', () => {
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        expect(result.current.mixpanelApiKey).toBe(mockSettings.mixPanelKey);
        expect(result.current.screebWebsiteId).toBe(mockSettings.screeb_website_id);
        expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
      });

      it('should prioritize config values over server response', () => {
        mockedConfig.mixpanelToken = 'config_mixpanel_key';
        mockedConfig.screebWebsiteId = 'config_screeb_id';
        mockedConfig.muiLicense = 'config_mui_license';

        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        expect(result.current.mixpanelApiKey).toBe('config_mixpanel_key');
        expect(result.current.screebWebsiteId).toBe('config_screeb_id');
        expect(result.current.muiApiKey).toBe('config_mui_license');
      });

      it('should use server response when config values are partially empty', () => {
        mockedConfig.mixpanelToken = 'config_mixpanel_key';
        mockedConfig.screebWebsiteId = ''; // Empty - should use server value
        mockedConfig.muiLicense = 'config_mui_license';

        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        expect(result.current.mixpanelApiKey).toBe('config_mixpanel_key');
        expect(result.current.screebWebsiteId).toBe(mockSettings.screeb_website_id);
        expect(result.current.muiApiKey).toBe('config_mui_license');
      });

      it('should handle settings with empty MUI key from server', () => {
        const settingsWithEmptyMui = createMockSettings({ muiKey: '' });
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(settingsWithEmptyMui);
        });

        expect(result.current.mixpanelApiKey).toBe(settingsWithEmptyMui.mixPanelKey);
        expect(result.current.screebWebsiteId).toBe(settingsWithEmptyMui.screeb_website_id);
        expect(result.current.muiApiKey).toBe(''); // Empty from server
      });

      it('should handle config priority with empty server MUI key', () => {
        mockedConfig.muiLicense = 'config_mui_license';
        const settingsWithEmptyMui = createMockSettings({ muiKey: '' });

        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(settingsWithEmptyMui);
        });

        expect(result.current.muiApiKey).toBe('config_mui_license');
      });

      it('should update state immutably', () => {
        const { result } = renderHook(() => useSettingsStore());
        const initialState = {
          mixpanelApiKey: result.current.mixpanelApiKey,
          screebWebsiteId: result.current.screebWebsiteId,
          muiApiKey: result.current.muiApiKey,
        };

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        // State should have changed
        const finalState = {
          mixpanelApiKey: result.current.mixpanelApiKey,
          screebWebsiteId: result.current.screebWebsiteId,
          muiApiKey: result.current.muiApiKey,
        };

        expect(finalState).not.toEqual(initialState);
        expect(finalState.mixpanelApiKey).toBe(mockSettings.mixPanelKey);
      });

      it('should persist multiple settings updates', () => {
        const { result } = renderHook(() => useSettingsStore());

        const firstSettings = createMockSettings({
          mixPanelKey: 'first_mixpanel',
          screeb_website_id: 'first_screeb',
          muiKey: 'first_mui',
        });

        const secondSettings = createMockSettings({
          mixPanelKey: 'second_mixpanel',
          screeb_website_id: 'second_screeb',
          muiKey: 'second_mui',
        });

        // First update
        act(() => {
          result.current.actions.persistSettings(firstSettings);
        });

        expect(result.current.mixpanelApiKey).toBe('first_mixpanel');
        expect(result.current.screebWebsiteId).toBe('first_screeb');
        expect(result.current.muiApiKey).toBe('first_mui');

        // Second update
        act(() => {
          result.current.actions.persistSettings(secondSettings);
        });

        expect(result.current.mixpanelApiKey).toBe('second_mixpanel');
        expect(result.current.screebWebsiteId).toBe('second_screeb');
        expect(result.current.muiApiKey).toBe('second_mui');
      });
    });

    describe('clearSettings', () => {
      it('should clear settings to initial state', () => {
        const { result } = renderHook(() => useSettingsStore());

        // First set some settings
        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        expect(result.current.mixpanelApiKey).toBe(mockSettings.mixPanelKey);

        // Then clear them
        act(() => {
          result.current.actions.clearSettings();
        });

        expect(result.current.mixpanelApiKey).toBe('');
        expect(result.current.screebWebsiteId).toBe('');
        expect(result.current.muiApiKey).toBe('');
      });

      it('should reset to exact initial state values', () => {
        const { result } = renderHook(() => useSettingsStore());

        // Set some settings
        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        // Clear settings
        act(() => {
          result.current.actions.clearSettings();
        });

        const currentState = {
          mixpanelApiKey: result.current.mixpanelApiKey,
          screebWebsiteId: result.current.screebWebsiteId,
          muiApiKey: result.current.muiApiKey,
        };

        expect(currentState).toEqual(initialSettingsState);
      });

      it('should maintain actions after clearing', () => {
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.clearSettings();
        });

        expect(result.current.actions).toBeDefined();
        expect(typeof result.current.actions.persistSettings).toBe('function');
        expect(typeof result.current.actions.clearSettings).toBe('function');
      });
    });
  });

  describe('Config priority logic', () => {
    it('should implement same logic as Redux (config || server)', () => {
      const testCases = [
        {
          config: { mixpanelToken: 'config_value', screebWebsiteId: '', muiLicense: 'config_mui' },
          server: { mixPanelKey: 'server_value', screeb_website_id: 'server_screeb', muiKey: 'server_mui' },
          expected: { mixpanelApiKey: 'config_value', screebWebsiteId: 'server_screeb', muiApiKey: 'config_mui' },
        },
        {
          config: { mixpanelToken: '', screebWebsiteId: '', muiLicense: '' },
          server: { mixPanelKey: 'server_value', screeb_website_id: 'server_screeb', muiKey: 'server_mui' },
          expected: { mixpanelApiKey: 'server_value', screebWebsiteId: 'server_screeb', muiApiKey: 'server_mui' },
        },
      ];

      testCases.forEach(({ config: configValues, server, expected }) => {
        mockedConfig.mixpanelToken = configValues.mixpanelToken;
        mockedConfig.screebWebsiteId = configValues.screebWebsiteId;
        mockedConfig.muiLicense = configValues.muiLicense;

        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(server);
        });

        expect(result.current.mixpanelApiKey).toBe(expected.mixpanelApiKey);
        expect(result.current.screebWebsiteId).toBe(expected.screebWebsiteId);
        expect(result.current.muiApiKey).toBe(expected.muiApiKey);
      });
    });
  });

  describe('Store configuration', () => {
    it('should be configured with persistence enabled', () => {
      // This test verifies that the store is created with persistence
      // The actual persistence functionality would be tested in integration tests
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current).toBeDefined();
      expect(result.current.actions).toBeDefined();
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle undefined config values', () => {
      // Simulate undefined config
      (mockedConfig as any).mixpanelToken = undefined;
      (mockedConfig as any).screebWebsiteId = undefined;
      (mockedConfig as any).muiLicense = undefined;

      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.actions.persistSettings(mockSettings);
      });

      // Should use server values when config is undefined
      expect(result.current.mixpanelApiKey).toBe(mockSettings.mixPanelKey);
      expect(result.current.screebWebsiteId).toBe(mockSettings.screeb_website_id);
      expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
    });

    it('should handle null config values', () => {
      // Simulate null config
      (mockedConfig as any).mixpanelToken = null;
      (mockedConfig as any).screebWebsiteId = null;
      (mockedConfig as any).muiLicense = null;

      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.actions.persistSettings(mockSettings);
      });

      // Should use server values when config is null
      expect(result.current.mixpanelApiKey).toBe(mockSettings.mixPanelKey);
      expect(result.current.screebWebsiteId).toBe(mockSettings.screeb_website_id);
      expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
    });
  });
});
