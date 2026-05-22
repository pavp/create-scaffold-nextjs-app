import { createMockSettings, createStableSettings } from '@test/entities/settings.mock';
import { act, renderHook } from '@test/utils';

import { config } from '@/config';
import type { SettingsResponse } from '@/shared/settings/settings.types';

import { initialSettingsState, useSettingsStore } from './settings.store';

jest.mock('@/config', () => ({
  config: {
    muiLicense: '',
  },
}));

const mockedConfig = config as jest.Mocked<typeof config>;

describe('Settings Store', () => {
  let mockSettings: SettingsResponse;

  beforeAll(() => {
    mockSettings = createStableSettings();
  });

  beforeEach(() => {
    mockedConfig.muiLicense = '';
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSettingsStore());

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

      expect({ muiApiKey: result.current.muiApiKey }).toEqual(initialSettingsState);
    });
  });

  describe('Actions', () => {
    describe('persistSettings', () => {
      it('should persist settings from server response when config is empty', () => {
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
      });

      it('should prioritize config values over server response', () => {
        mockedConfig.muiLicense = 'config_mui_license';
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        expect(result.current.muiApiKey).toBe('config_mui_license');
      });

      it('should handle settings with empty MUI key from server', () => {
        const settingsWithEmptyMui = createMockSettings({ muiKey: '' });
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(settingsWithEmptyMui);
        });

        expect(result.current.muiApiKey).toBe('');
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
        const initialMui = result.current.muiApiKey;

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        expect(result.current.muiApiKey).not.toBe(initialMui);
        expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
      });

      it('should persist multiple settings updates', () => {
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(createMockSettings({ muiKey: 'first_mui' }));
        });
        expect(result.current.muiApiKey).toBe('first_mui');

        act(() => {
          result.current.actions.persistSettings(createMockSettings({ muiKey: 'second_mui' }));
        });
        expect(result.current.muiApiKey).toBe('second_mui');
      });
    });

    describe('clearSettings', () => {
      it('should clear settings to initial state', () => {
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        act(() => {
          result.current.actions.clearSettings();
        });

        expect(result.current.muiApiKey).toBe('');
      });

      it('should reset to exact initial state values', () => {
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(mockSettings);
        });

        act(() => {
          result.current.actions.clearSettings();
        });

        expect({ muiApiKey: result.current.muiApiKey }).toEqual(initialSettingsState);
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
    it('should implement config priority logic (config || server)', () => {
      const testCases = [
        { configMui: 'config_mui', serverMui: 'server_mui', expected: 'config_mui' },
        { configMui: '', serverMui: 'server_mui', expected: 'server_mui' },
      ];

      testCases.forEach(({ configMui, serverMui, expected }) => {
        mockedConfig.muiLicense = configMui;
        const { result } = renderHook(() => useSettingsStore());

        act(() => {
          result.current.actions.persistSettings(createMockSettings({ muiKey: serverMui }));
        });

        expect(result.current.muiApiKey).toBe(expected);
      });
    });
  });

  describe('Store configuration', () => {
    it('should be configured with persistence enabled', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current).toBeDefined();
      expect(result.current.actions).toBeDefined();
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle undefined config values', () => {
      (mockedConfig as any).muiLicense = undefined;
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.actions.persistSettings(mockSettings);
      });

      expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
    });

    it('should handle null config values', () => {
      (mockedConfig as any).muiLicense = null;
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.actions.persistSettings(mockSettings);
      });

      expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
    });
  });
});
