import { create, type StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { config } from '@/config';

import { StoreOptions, ZustandSet } from './zustand.types';

/**
 * Creates a Zustand store with built-in middleware support (Immer, Persist, DevTools)
 *
 * Features:
 * - **Automatic Immer detection**: Use `set((draft) => { draft.key = value })` directly
 * - **Type-safe persistence**: Exclude properties with IntelliSense support
 * - **Configurable storage**: Choose between localStorage/sessionStorage
 * - **DevTools integration**: Automatic in development mode
 * - **Actions exclusion**: Automatically excludes 'actions' from persistence
 *
 * @template T - The store state type (must extend object)
 * @param storeCreator - Function that defines the store state and actions
 * @param name - Store name used for DevTools and persistence key
 * @param options - Configuration options for middleware behavior
 * @returns Configured Zustand store with applied middleware
 *
 * @example
 * Basic usage with standard Zustand syntax:
 * ```typescript
 * const useStore = createStoreWithMiddleware(
 *   (set, get) => ({
 *     count: 0,
 *     increment: () => set(state => ({ count: state.count + 1 }))
 *   }),
 *   'counter-store'
 * );
 * ```
 *
 * @example
 * Using Immer syntax for complex updates:
 * ```typescript
 * const useStore = createStoreWithMiddleware(
 *   (set, get) => ({
 *     user: { name: '', settings: { theme: 'light' } },
 *     updateTheme: (theme) => set((draft) => {
 *       draft.user.settings.theme = theme;
 *     })
 *   }),
 *   'user-store'
 * );
 * ```
 *
 * @example
 * With persistence and type-safe exclude:
 * ```typescript
 * const useStore = createStoreWithMiddleware(
 *   (set, get) => ({
 *     data: [],
 *     loading: false,
 *     error: null,
 *     actions: {
 *       fetchData: () => set({ loading: true })
 *     }
 *   }),
 *   'api-store',
 *   {
 *     persist: true,
 *     storage: 'sessionStorage',
 *     exclude: ['loading', 'error'] // IntelliSense shows valid keys only
 *   }
 * );
 * ```
 */
export function createStoreWithMiddleware<T extends object>(
  storeCreator: (set: ZustandSet<T>, get: () => T, api: any) => T,
  name: string,
  options: StoreOptions<T> = {},
) {
  const {
    persist: shouldPersist = false,
    version = 1,
    immer: shouldUseImmer = true,
    storage = 'localStorage',
    exclude = [],
  } = options;

  // Enhanced store creator that passes the correct set type
  const enhancedStoreCreator: StateCreator<T, [], [], T> = (set, get, api) =>
    storeCreator(set as ZustandSet<T>, get, api);

  // Build persist configuration with type-safe partialize
  const persistConfig = {
    name: `${name}-storage`,
    version,
    storage: createJSONStorage(() => (storage === 'sessionStorage' ? sessionStorage : localStorage)),
    partialize: (state: T): Partial<T> => {
      const result = { ...state } as Record<string, any>;

      if ('actions' in state) delete result.actions;

      exclude.forEach((key) => {
        delete result[key as string];
      });

      return result as Partial<T>;
    },
  };

  // Apply middleware in the correct order
  if (shouldUseImmer) {
    if (shouldPersist) {
      return config.isDev
        ? create<T>()(devtools(persist(immer(enhancedStoreCreator as any), persistConfig), { name }))
        : create<T>()(persist(immer(enhancedStoreCreator as any), persistConfig));
    } else {
      return config.isDev
        ? create<T>()(devtools(immer(enhancedStoreCreator as any), { name }))
        : create<T>()(immer(enhancedStoreCreator as any));
    }
  } else {
    if (shouldPersist) {
      return config.isDev
        ? create<T>()(devtools(persist(enhancedStoreCreator, persistConfig), { name }))
        : create<T>()(persist(enhancedStoreCreator, persistConfig));
    } else {
      return config.isDev ? create<T>()(devtools(enhancedStoreCreator, { name })) : create<T>()(enhancedStoreCreator);
    }
  }
}
