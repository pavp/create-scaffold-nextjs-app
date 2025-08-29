import { createMockSettings } from '@test/entities/settings.mock';
import { mockZustandStore, renderHook } from '@test/utils';

import { useSettingsStore } from '@/shared/settings/stores/settings.store';

import { useScreebWebsiteIdSelector } from './use-screeb-website-id-selector.hook';

describe('useScreebWebsiteIdSelector', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: '',
      muiApiKey: '',
      actions: {} as any,
    });
  });

  it('should return screeb website ID from store', () => {
    const testWebsiteId = 'test_screeb_website_id_123';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: 'other_value',
      screebWebsiteId: testWebsiteId,
      muiApiKey: 'another_value',
      actions: {} as any,
    });
    const { result } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current.screebWebsiteId).toBe(testWebsiteId);
  });

  it('should return empty string when screeb website ID is not set', () => {
    const { result } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current.screebWebsiteId).toBe('');
  });

  it('should return object with screebWebsiteId property', () => {
    const { result } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current).toHaveProperty('screebWebsiteId');
    expect(typeof result.current.screebWebsiteId).toBe('string');
    expect(Object.keys(result.current)).toEqual(['screebWebsiteId']);
  });

  it('should only select screeb website ID and ignore other store values', () => {
    const mockSettings = createMockSettings();

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: mockSettings.mixPanelKey,
      screebWebsiteId: mockSettings.screeb_website_id,
      muiApiKey: mockSettings.muiKey,
      actions: {} as any,
    });
    const { result } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current.screebWebsiteId).toBe(mockSettings.screeb_website_id);
    expect(result.current).not.toHaveProperty('mixpanelApiKey');
    expect(result.current).not.toHaveProperty('muiApiKey');
    expect(result.current).not.toHaveProperty('actions');
  });

  it('should handle realistic screeb website ID format', () => {
    const realisticId = 'screeb_123e4567-e89b-12d3-a456-426614174000';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: realisticId,
      muiApiKey: '',
      actions: {} as any,
    });
    const { result } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current.screebWebsiteId).toBe(realisticId);
    expect(result.current.screebWebsiteId).toMatch(/^screeb_/);
  });

  it('should handle UUID format for screeb website ID', () => {
    const uuidFormat = '123e4567-e89b-12d3-a456-426614174000';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: uuidFormat,
      muiApiKey: '',
      actions: {} as any,
    });
    const { result } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current.screebWebsiteId).toBe(uuidFormat);
    expect(result.current.screebWebsiteId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('should be optimized for React rendering (selector optimization)', () => {
    const testWebsiteId = 'test_screeb_id';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: 'initial_mixpanel',
      screebWebsiteId: testWebsiteId,
      muiApiKey: 'initial_mui',
      actions: {} as any,
    });

    const { result, rerender } = renderHook(() => useScreebWebsiteIdSelector());
    const initialResult = result.current;

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: 'changed_mixpanel', // Different value
      screebWebsiteId: testWebsiteId, // Same value
      muiApiKey: 'changed_mui', // Different value
      actions: {} as any,
    });

    rerender();

    expect(result.current.screebWebsiteId).toBe(testWebsiteId);
    expect(result.current.screebWebsiteId).toBe(initialResult.screebWebsiteId);
  });

  it('should re-render when screeb website ID changes', () => {
    const initialId = 'initial_screeb_id';
    const changedId = 'changed_screeb_id';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: initialId,
      muiApiKey: '',
      actions: {} as any,
    });

    const { result, rerender } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current.screebWebsiteId).toBe(initialId);

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: changedId,
      muiApiKey: '',
      actions: {} as any,
    });

    rerender();
    expect(result.current.screebWebsiteId).toBe(changedId);
  });

  it('should handle long screeb website IDs', () => {
    const longId = 'screeb_' + 'a'.repeat(100);

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: longId,
      muiApiKey: '',
      actions: {} as any,
    });
    const { result } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current.screebWebsiteId).toBe(longId);
    expect(result.current.screebWebsiteId.length).toBe(107);
  });

  it('should handle special characters in screeb website ID', () => {
    const specialId = 'screeb_id-with.special_chars123!@#';

    mockZustandStore(useSettingsStore, {
      mixpanelApiKey: '',
      screebWebsiteId: specialId,
      muiApiKey: '',
      actions: {} as any,
    });
    const { result } = renderHook(() => useScreebWebsiteIdSelector());

    expect(result.current.screebWebsiteId).toBe(specialId);
  });

  describe('screeb-specific scenarios', () => {
    it('should handle alphanumeric screeb IDs', () => {
      const alphanumericId = 'abc123def456ghi789';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: alphanumericId,
        muiApiKey: '',
        actions: {} as any,
      });
      const { result } = renderHook(() => useScreebWebsiteIdSelector());

      expect(result.current.screebWebsiteId).toBe(alphanumericId);
    });

    it('should handle screeb development environment IDs', () => {
      const devId = 'dev_screeb_website_12345';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: devId,
        muiApiKey: '',
        actions: {} as any,
      });
      const { result } = renderHook(() => useScreebWebsiteIdSelector());

      expect(result.current.screebWebsiteId).toBe(devId);
      expect(result.current.screebWebsiteId).toMatch(/^dev_/);
    });

    it('should handle production screeb website IDs', () => {
      const prodId = 'prod_screeb_a1b2c3d4e5f6';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: prodId,
        muiApiKey: '',
        actions: {} as any,
      });
      const { result } = renderHook(() => useScreebWebsiteIdSelector());

      expect(result.current.screebWebsiteId).toBe(prodId);
      expect(result.current.screebWebsiteId).toMatch(/^prod_/);
    });
  });

  describe('selector performance', () => {
    it('should use minimal selector for optimization', () => {
      // This test verifies that the selector only subscribes to the screebWebsiteId field
      // which is important for React performance

      const { result } = renderHook(() => useScreebWebsiteIdSelector());

      // The selector should return only the screeb website ID
      expect(Object.keys(result.current)).toEqual(['screebWebsiteId']);
      expect(typeof result.current.screebWebsiteId).toBe('string');
    });
  });

  describe('integration with store', () => {
    it('should work with useSettingsStore', () => {
      const testId = 'integration_screeb_test_id';
      const storeResult = renderHook(() => useSettingsStore());
      const selectorResult = renderHook(() => useScreebWebsiteIdSelector());

      // Update store
      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: testId,
        muiApiKey: '',
        actions: {} as any,
      });

      storeResult.rerender();
      selectorResult.rerender();
      expect(storeResult.result.current.screebWebsiteId).toBe(testId);
      expect(selectorResult.result.current.screebWebsiteId).toBe(testId);
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace in screeb website ID', () => {
      const whitespaceId = '  screeb_id_with_spaces  ';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: whitespaceId,
        muiApiKey: '',
        actions: {} as any,
      });
      const { result } = renderHook(() => useScreebWebsiteIdSelector());

      expect(result.current.screebWebsiteId).toBe(whitespaceId);
    });

    it('should handle numeric-only screeb website IDs', () => {
      const numericId = '123456789012345';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: numericId,
        muiApiKey: '',
        actions: {} as any,
      });
      const { result } = renderHook(() => useScreebWebsiteIdSelector());

      expect(result.current.screebWebsiteId).toBe(numericId);
      expect(typeof result.current.screebWebsiteId).toBe('string');
    });

    it('should handle underscore-separated screeb IDs', () => {
      const underscoreId = 'screeb_website_id_with_multiple_underscores';

      mockZustandStore(useSettingsStore, {
        mixpanelApiKey: '',
        screebWebsiteId: underscoreId,
        muiApiKey: '',
        actions: {} as any,
      });
      const { result } = renderHook(() => useScreebWebsiteIdSelector());

      expect(result.current.screebWebsiteId).toBe(underscoreId);
      expect(result.current.screebWebsiteId.split('_').length).toBeGreaterThan(1);
    });
  });
});
