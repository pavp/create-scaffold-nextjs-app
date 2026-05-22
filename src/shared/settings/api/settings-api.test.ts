/**
 * @jest-environment jsdom
 */

import { createMockSettings, createStableSettings } from '@test/entities/settings.mock';

import { endpoints } from '@/api/endpoints';
import { httpClient } from '@/api/http-client';
import type { SettingsResponse } from '@/shared/settings/settings.types';
import { SettingsResponseSchema } from '@/shared/settings/settings.types';

import { settingsApi } from './settings-api';

// Mock the httpClient
jest.mock('@/api/http-client');
const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('SettingsApi', () => {
  let mockSettings: SettingsResponse;

  beforeAll(() => {
    // Create reusable test data using faker factories
    mockSettings = createStableSettings();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should fetch settings successfully', async () => {
      mockedHttpClient.get.mockResolvedValue({ data: mockSettings });

      const result = await settingsApi.getSettings();

      expect(result).toEqual(mockSettings);
      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.SETTINGS.BASE, {
        signal: undefined,
        responseSchema: SettingsResponseSchema,
      });
      expect(mockedHttpClient.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch settings with AbortController signal', async () => {
      const mockController = new AbortController();

      mockedHttpClient.get.mockResolvedValue({ data: mockSettings });

      const result = await settingsApi.getSettings({ signal: mockController.signal });

      expect(result).toEqual(mockSettings);
      expect(mockedHttpClient.get).toHaveBeenCalledWith(endpoints.SETTINGS.BASE, {
        signal: mockController.signal,
        responseSchema: SettingsResponseSchema,
      });
      expect(mockedHttpClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle settings with empty MUI key', async () => {
      const settingsWithEmptyMui = createMockSettings({ muiKey: '' });

      mockedHttpClient.get.mockResolvedValue({ data: settingsWithEmptyMui });

      const result = await settingsApi.getSettings();

      expect(result).toEqual(settingsWithEmptyMui);
      expect(result.muiKey).toBe('');
    });

    it('should use correct endpoint', async () => {
      mockedHttpClient.get.mockResolvedValue({ data: mockSettings });

      await settingsApi.getSettings();

      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        endpoints.SETTINGS.BASE,
        expect.objectContaining({
          responseSchema: SettingsResponseSchema,
        }),
      );
    });

    it('should include Zod schema validation in httpClient call', async () => {
      mockedHttpClient.get.mockResolvedValue({ data: mockSettings });

      await settingsApi.getSettings();

      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          responseSchema: SettingsResponseSchema,
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should propagate network errors', async () => {
      const networkError = new Error('Network error');

      mockedHttpClient.get.mockRejectedValue(networkError);

      await expect(settingsApi.getSettings()).rejects.toThrow('Network error');
      expect(mockedHttpClient.get).toHaveBeenCalledTimes(1);
    });

    it('should propagate HTTP client errors', async () => {
      const httpError = new Error('HTTP 500 Internal Server Error');

      mockedHttpClient.get.mockRejectedValue(httpError);

      await expect(settingsApi.getSettings()).rejects.toThrow('HTTP 500 Internal Server Error');
    });

    it('should propagate Zod validation errors from httpClient', async () => {
      const validationError = new Error('Zod validation failed');

      mockedHttpClient.get.mockRejectedValue(validationError);

      await expect(settingsApi.getSettings()).rejects.toThrow('Zod validation failed');
    });

    it('should handle AbortController cancellation', async () => {
      const mockController = new AbortController();
      const abortError = new Error('Request aborted');

      abortError.name = 'AbortError';
      mockedHttpClient.get.mockRejectedValue(abortError);

      await expect(settingsApi.getSettings({ signal: mockController.signal })).rejects.toThrow('Request aborted');
      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        endpoints.SETTINGS.BASE,
        expect.objectContaining({
          signal: mockController.signal,
        }),
      );
    });
  });

  describe('service factory', () => {
    it('should create service instance with correct interface', () => {
      expect(typeof settingsApi.getSettings).toBe('function');
      expect(settingsApi).toHaveProperty('getSettings');
    });

    it('should be a singleton instance', () => {
      const { settingsApi: secondInstance } = require('./settings-api');

      expect(settingsApi).toBe(secondInstance);
    });
  });

  describe('contract compliance', () => {
    it('should implement SettingsApiContract interface', () => {
      expect(settingsApi).toHaveProperty('getSettings');
      expect(typeof settingsApi.getSettings).toBe('function');
    });
  });
});
