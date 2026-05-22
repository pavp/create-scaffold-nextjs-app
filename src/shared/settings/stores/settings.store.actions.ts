import { useSettingsStore } from './settings.store';
import type { SettingsActions } from './settings.store.types';

/**
 * Custom hook that returns only the actions from the settings store
 * Useful for components that only need to perform actions without accessing state
 */
export const useSettingsActions = (): SettingsActions => useSettingsStore((state) => state.actions);
