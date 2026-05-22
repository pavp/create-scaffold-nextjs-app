/**
 * @jest-environment jsdom
 */
import { QueryClient } from '@tanstack/react-query';

import { getQueryClient } from './get-query-client';

describe('get-query-client', () => {
  let originalWindow: any;

  beforeEach(() => {
    // Store original window to restore later
    originalWindow = global.window;
  });

  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
  });

  describe('basic functionality', () => {
    it('should create a QueryClient instance', () => {
      const client = getQueryClient();

      expect(client).toBeInstanceOf(QueryClient);
    });

    it('should create QueryClient with correct default options', () => {
      const client = getQueryClient();

      const defaultOptions = client.getDefaultOptions();

      expect(defaultOptions.queries?.staleTime).toBe(60 * 1000);
      expect(defaultOptions.queries?.retry).toBe(3);
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
      expect(defaultOptions.queries?.refetchOnMount).toBe(true);
      expect(defaultOptions.queries?.refetchOnReconnect).toBe(true);
      expect(defaultOptions.mutations?.retry).toBe(1);
    });
  });

  describe('browser singleton behavior', () => {
    beforeEach(() => {
      // Ensure we're in browser environment
      global.window = {} as any;
    });

    it('should reuse the same QueryClient instance on subsequent calls', () => {
      const client1 = getQueryClient();
      const client2 = getQueryClient();

      // All calls should return the same instance in browser mode
      expect(client1).toBe(client2);
      expect(client1).toBeInstanceOf(QueryClient);
    });
  });

  describe('server vs browser environment', () => {
    it('should handle undefined window correctly', () => {
      // Explicitly set window to undefined
      (global as any).window = undefined;

      const { getQueryClient: serverGetQueryClient } = require('./get-query-client');
      const client = serverGetQueryClient();

      expect(client).toBeInstanceOf(QueryClient);
    });
  });
});
