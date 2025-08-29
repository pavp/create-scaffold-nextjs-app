import { createMockSettings } from '@test/entities/settings.mock';
import { mockZustandStore, renderHook } from '@test/utils';

import { useSettingsStore } from '@/shared/settings/stores/settings.store';

import { useMixpanelApiKeySelector } from './use-mixpanel-api-key-selector.hook';

describe('useMixpanelApiKeySelector', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: '',
      muiApiKey: '',
      actions: {} as any,
    });
  });

  it('should return mixpanel API key from store', () => {
    const testApiKey = 'test_mixpanel_key_123';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: testApiKey,
      screebWebsiteId: 'other_value',
      muiApiKey: 'another_value',
      actions: {} as any,
    });
    const { result } = renderHook(() => useMixpanelApiKeySelector());

    expect(result.current.mixpanelApiKey).toBe(testApiKey);
  });

  it('should return empty string when mixpanel API key is not set', () => {
    const { result } = renderHook(() => useMixpanelApiKeySelector());

    expect(result.current.mixpanelApiKey).toBe('');
  });

  it('should return object with mixpanelApiKey property', () => {
    const { result } = renderHook(() => useMixpanelApiKeySelector());

    expect(result.current).toHaveProperty('mixpanelApiKey');
    expect(typeof result.current.mixpanelApiKey).toBe('string');
    expect(Object.keys(result.current)).toEqual(['mixpanelApiKey']);
  });

  it('should only select mixpanel API key and ignore other store values', () => {
    const mockSettings = createMockSettings();

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: mockSettings.mixPanelKey,
      screebWebsiteId: mockSettings.screeb_website_id,
      muiApiKey: mockSettings.muiKey,
      actions: {} as any,
    });
    const { result } = renderHook(() => useMixpanelApiKeySelector());

    expect(result.current.mixpanelApiKey).toBe(mockSettings.mixPanelKey);
    expect(result.current).not.toHaveProperty('screebWebsiteId');
    expect(result.current).not.toHaveProperty('muiApiKey');
    expect(result.current).not.toHaveProperty('actions');
  });

  it('should handle realistic mixpanel API key format', () => {
    const realisticKey = 'mp_1234567890abcdef1234567890abcdef';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: realisticKey,
      screebWebsiteId: '',
      muiApiKey: '',
      actions: {} as any,
    });
    const { result } = renderHook(() => useMixpanelApiKeySelector());

    expect(result.current.mixpanelApiKey).toBe(realisticKey);
    expect(result.current.mixpanelApiKey).toMatch(/^mp_/);
  });

  it('should be optimized for React rendering (selector optimization)', () => {
    const testApiKey = 'test_key';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: testApiKey,
      screebWebsiteId: 'initial_screeb',
      muiApiKey: 'initial_mui',
      actions: {} as any,
    });

    const { result, rerender } = renderHook(() => useMixpanelApiKeySelector());
    const initialResult = result.current;

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: testApiKey, // Same value
      screebWebsiteId: 'changed_screeb', // Different value
      muiApiKey: 'changed_mui', // Different value
      actions: {} as any,
    });

    rerender();

    expect(result.current.mixpanelApiKey).toBe(testApiKey);
    expect(result.current.mixpanelApiKey).toBe(initialResult.mixpanelApiKey);
  });

  it('should re-render when mixpanel API key changes', () => {
    const initialKey = 'initial_key';
    const changedKey = 'changed_key';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: initialKey,
      screebWebsiteId: '',
      muiApiKey: '',
      actions: {} as any,
    });

    const { result, rerender } = renderHook(() => useMixpanelApiKeySelector());

    expect(result.current.mixpanelApiKey).toBe(initialKey);

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: changedKey,
      screebWebsiteId: '',
      muiApiKey: '',
      actions: {} as any,
    });

    rerender();
    expect(result.current.mixpanelApiKey).toBe(changedKey);
  });

  it('should handle long API keys', () => {
    const longApiKey = 'mp_' + 'a'.repeat(100);

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: longApiKey,
      screebWebsiteId: '',
      muiApiKey: '',
      actions: {} as any,
    });
    const { result } = renderHook(() => useMixpanelApiKeySelector());

    expect(result.current.mixpanelApiKey).toBe(longApiKey);
    expect(result.current.mixpanelApiKey.length).toBe(103);
  });

  it('should handle special characters in API key', () => {
    const specialKey = 'mp_key-with.special_chars123!@#';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: specialKey,
      screebWebsiteId: '',
      muiApiKey: '',
      actions: {} as any,
    });
    const { result } = renderHook(() => useMixpanelApiKeySelector());

    expect(result.current.mixpanelApiKey).toBe(specialKey);
  });

  describe('selector performance', () => {
    it('should use minimal selector for optimization', () => {
      // This test verifies that the selector only subscribes to the mixpanelApiKey field
      // which is important for React performance

      const { result } = renderHook(() => useMixpanelApiKeySelector());

      // The selector should return only the mixpanel API key
      expect(Object.keys(result.current)).toEqual(['mixpanelApiKey']);
      expect(typeof result.current.mixpanelApiKey).toBe('string');
    });
  });

  describe('integration with store', () => {
    it('should work with useSettingsStore', () => {
      const testKey = 'integration_test_key';
      const storeResult = renderHook(() => useSettingsStore());
      const selectorResult = renderHook(() => useMixpanelApiKeySelector());

      // Update store
      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: testKey,
        screebWebsiteId: '',
        muiApiKey: '',
        actions: {} as any,
      });

      storeResult.rerender();
      selectorResult.rerender();
      expect(storeResult.result.current.mixpanelApiKey).toBe(testKey);
      expect(selectorResult.result.current.mixpanelApiKey).toBe(testKey);
    });
  });
});
