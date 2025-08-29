import { createMockSettings } from '@test/entities/settings.mock';
import { act, renderHook } from '@test/utils';

import { useSettingsStore } from './settings.store';
import { useSettingsActions } from './settings.store.actions';

describe('useSettingsActions hook', () => {
  let mockSettings: ReturnType<typeof createMockSettings>;

  beforeAll(() => {
    mockSettings = createMockSettings();
  });

  it('should return only actions from store', () => {
    const { result } = renderHook(() => useSettingsActions());

    expect(result.current).toHaveProperty('persistSettings');
    expect(result.current).toHaveProperty('clearSettings');
    expect(typeof result.current.persistSettings).toBe('function');
    expect(typeof result.current.clearSettings).toBe('function');

    // Should not have state properties
    expect(result.current).not.toHaveProperty('mixpanelApiKey');
    expect(result.current).not.toHaveProperty('screebWebsiteId');
    expect(result.current).not.toHaveProperty('muiApiKey');
  });

  it('should work independently of main store hook', () => {
    const actionsResult = renderHook(() => useSettingsActions());
    const storeResult = renderHook(() => useSettingsStore());

    // Actions should be the same reference
    expect(actionsResult.result.current.persistSettings).toBe(storeResult.result.current.actions.persistSettings);
    expect(actionsResult.result.current.clearSettings).toBe(storeResult.result.current.actions.clearSettings);
  });

  it('should trigger state updates when used', () => {
    const actionsResult = renderHook(() => useSettingsActions());
    const storeResult = renderHook(() => useSettingsStore());

    act(() => {
      actionsResult.result.current.persistSettings(mockSettings);
    });

    expect(storeResult.result.current.mixpanelApiKey).toBe(mockSettings.mixPanelKey);
  });
});
