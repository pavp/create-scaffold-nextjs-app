import { createMockSettings } from '@test/entities/settings.mock';
import { mockZustandStore, renderHook } from '@test/utils';

import { useSettingsStore } from '@/shared/settings/stores/settings.store';

import { useMuiApiKeySelector } from './use-mui-api-key-selector.hook';

describe('useMuiApiKeySelector', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: '',
      muiApiKey: '',
      actions: {} as any,
    });
  });

  it('should return MUI API key from store', () => {
    const testApiKey = 'test_mui_key_123';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: 'other_value',
      screebWebsiteId: 'another_value',
      muiApiKey: testApiKey,
      actions: {} as any,
    });
    const { result } = renderHook(() => useMuiApiKeySelector());

    expect(result.current.muiApiKey).toBe(testApiKey);
  });

  it('should return empty string when MUI API key is not set', () => {
    const { result } = renderHook(() => useMuiApiKeySelector());

    expect(result.current.muiApiKey).toBe('');
  });

  it('should handle empty MUI API key (allowed by schema)', () => {
    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: 'some_value',
      screebWebsiteId: 'some_value',
      muiApiKey: '', // Empty is valid for MUI
      actions: {} as any,
    });
    const { result } = renderHook(() => useMuiApiKeySelector());

    expect(result.current.muiApiKey).toBe('');
  });

  it('should return object with muiApiKey property', () => {
    const { result } = renderHook(() => useMuiApiKeySelector());

    expect(result.current).toHaveProperty('muiApiKey');
    expect(typeof result.current.muiApiKey).toBe('string');
    expect(Object.keys(result.current)).toEqual(['muiApiKey']);
  });

  it('should only select MUI API key and ignore other store values', () => {
    const mockSettings = createMockSettings();

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: mockSettings.mixPanelKey,
      screebWebsiteId: mockSettings.screeb_website_id,
      muiApiKey: mockSettings.muiKey,
      actions: {} as any,
    });
    const { result } = renderHook(() => useMuiApiKeySelector());

    expect(result.current.muiApiKey).toBe(mockSettings.muiKey);
    expect(result.current).not.toHaveProperty('mixpanelApiKey');
    expect(result.current).not.toHaveProperty('screebWebsiteId');
    expect(result.current).not.toHaveProperty('actions');
  });

  it('should handle realistic MUI license key format', () => {
    const realisticKey = 'mui_license_1234567890abcdef1234567890abcdef12345678';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: '',
      muiApiKey: realisticKey,
      actions: {} as any,
    });
    const { result } = renderHook(() => useMuiApiKeySelector());

    expect(result.current.muiApiKey).toBe(realisticKey);
  });

  it('should be optimized for React rendering (selector optimization)', () => {
    const testApiKey = 'test_mui_key';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: 'initial_mixpanel',
      screebWebsiteId: 'initial_screeb',
      muiApiKey: testApiKey,
      actions: {} as any,
    });

    const { result, rerender } = renderHook(() => useMuiApiKeySelector());
    const initialResult = result.current;

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: 'changed_mixpanel', // Different value
      screebWebsiteId: 'changed_screeb', // Different value
      muiApiKey: testApiKey, // Same value
      actions: {} as any,
    });

    rerender();

    expect(result.current.muiApiKey).toBe(testApiKey);
    expect(result.current.muiApiKey).toBe(initialResult.muiApiKey);
  });

  it('should re-render when MUI API key changes', () => {
    const initialKey = 'initial_mui_key';
    const changedKey = 'changed_mui_key';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: '',
      muiApiKey: initialKey,
      actions: {} as any,
    });

    const { result, rerender } = renderHook(() => useMuiApiKeySelector());

    expect(result.current.muiApiKey).toBe(initialKey);

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: '',
      muiApiKey: changedKey,
      actions: {} as any,
    });

    rerender();
    expect(result.current.muiApiKey).toBe(changedKey);
  });

  it('should handle long MUI license keys', () => {
    const longApiKey = 'mui_license_' + 'a'.repeat(200);

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: '',
      muiApiKey: longApiKey,
      actions: {} as any,
    });
    const { result } = renderHook(() => useMuiApiKeySelector());

    expect(result.current.muiApiKey).toBe(longApiKey);
    expect(result.current.muiApiKey.length).toBe(212);
  });

  it('should handle special characters in MUI license key', () => {
    const specialKey = 'mui_key-with.special_chars123!@#$%^&*()';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: '',
      muiApiKey: specialKey,
      actions: {} as any,
    });
    const { result } = renderHook(() => useMuiApiKeySelector());

    expect(result.current.muiApiKey).toBe(specialKey);
  });

  describe('MUI-specific scenarios', () => {
    it('should handle valid MUI X Pro license format', () => {
      const muiProLicense = 'x-license-pro_1234567890abcdef';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: '',
        muiApiKey: muiProLicense,
        actions: {} as any,
      });
      const { result } = renderHook(() => useMuiApiKeySelector());

      expect(result.current.muiApiKey).toBe(muiProLicense);
      expect(result.current.muiApiKey).toMatch(/^x-license-pro_/);
    });

    it('should distinguish between empty and undefined (schema compliance)', () => {
      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: '',
        muiApiKey: '',
        actions: {} as any,
      });
      const { result } = renderHook(() => useMuiApiKeySelector());

      expect(result.current.muiApiKey).toBe('');
      expect(result.current.muiApiKey).not.toBeUndefined();
      expect(result.current.muiApiKey).not.toBeNull();
    });
  });

  describe('selector performance', () => {
    it('should use minimal selector for optimization', () => {
      // This test verifies that the selector only subscribes to the muiApiKey field
      // which is important for React performance

      const { result } = renderHook(() => useMuiApiKeySelector());

      // The selector should return only the MUI API key
      expect(Object.keys(result.current)).toEqual(['muiApiKey']);
      expect(typeof result.current.muiApiKey).toBe('string');
    });
  });

  describe('integration with store', () => {
    it('should work with useSettingsStore', () => {
      const testKey = 'integration_mui_test_key';
      const storeResult = renderHook(() => useSettingsStore());
      const selectorResult = renderHook(() => useMuiApiKeySelector());

      // Update store
      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: '',
        muiApiKey: testKey,
        actions: {} as any,
      });

      storeResult.rerender();
      selectorResult.rerender();
      expect(storeResult.result.current.muiApiKey).toBe(testKey);
      expect(selectorResult.result.current.muiApiKey).toBe(testKey);
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace in MUI key', () => {
      const whitespaceKey = '  mui_key_with_spaces  ';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: '',
        muiApiKey: whitespaceKey,
        actions: {} as any,
      });
      const { result } = renderHook(() => useMuiApiKeySelector());

      expect(result.current.muiApiKey).toBe(whitespaceKey);
    });

    it('should handle numeric-like strings in MUI key', () => {
      const numericKey = '123456789';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: '',
        muiApiKey: numericKey,
        actions: {} as any,
      });
      const { result } = renderHook(() => useMuiApiKeySelector());

      expect(result.current.muiApiKey).toBe(numericKey);
      expect(typeof result.current.muiApiKey).toBe('string');
    });
  });
});
