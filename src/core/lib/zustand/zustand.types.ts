import type { Draft } from 'immer';

/**
 * Storage type for persistence configuration
 * @example
 * ```typescript
 * // Use localStorage (default)
 * { storage: 'localStorage' }
 *
 * // Use sessionStorage (clears on tab close)
 * { storage: 'sessionStorage' }
 * ```
 */
export type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Configuration options for store middleware
 * @template T - The store state type
 *
 * @example
 * ```typescript
 * const options: StoreOptions<MyState> = {
 *   persist: true,              // Enable persistence
 *   storage: 'localStorage',    // Storage type (default)
 *   version: 1,                 // Schema version for migrations
 *   immer: true,               // Enable Immer (default)
 *   exclude: ['loading']       // Exclude from persistence with IntelliSense
 * };
 * ```
 */
export interface StoreOptions<T extends object> {
  /** Enable state persistence. Default: `false` */
  persist?: boolean;

  /** Schema version for handling migrations. Default: `1` */
  version?: number;

  /** Enable Immer for mutable updates. Default: `true` */
  immer?: boolean;

  /** Storage type for persistence. Default: `'localStorage'` */
  storage?: StorageType;

  /**
   * Properties to exclude from persistence.
   * Type-safe: only shows valid state keys, excludes 'actions' automatically
   *
   * @example
   * ```typescript
   * exclude: ['loading', 'error'] // IntelliSense shows only valid keys
   * ```
   */
  exclude?: Array<Exclude<keyof T, 'actions'>>;
}

/**
 * Enhanced Zustand set function that supports both standard and Immer syntax
 * @template T - The store state type
 *
 * Automatically detects the update pattern:
 * - **Standard syntax**: `set({ key: value })` or `set(state => ({ key: value }))`
 * - **Immer syntax**: `set((draft) => { draft.key = value })`
 *
 * @example
 * Standard immutable updates:
 * ```typescript
 * set({ count: 5 })
 * set(state => ({ count: state.count + 1 }))
 * ```
 *
 * @example
 * Immer mutable updates:
 * ```typescript
 * set((draft) => {
 *   draft.user.name = 'John';
 *   draft.settings.theme = 'dark';
 * })
 * ```
 */
export type ZustandSet<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>) | ((draft: Draft<T>) => void),
  replace?: boolean,
) => void;
