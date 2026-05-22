import { createMockSettings, createStableSettings } from '@test/entities/settings.mock';

import type { SettingsResponse } from '@/shared/settings/settings.types';

import { createSettingsHttpGateway } from './http-gateway';

// Mock dependencies
jest.mock('@/shared/settings/api/settings-api', () => ({
  settingsApi: {
    getSettings: jest.fn(),
  },
}));

// Import the mocked modules after mocking
const { settingsApi } = jest.requireMock('@/shared/settings/api/settings-api');
const mockedSettingsApi = settingsApi as jest.Mocked<typeof settingsApi>;

describe('Settings HTTP Gateway', () => {
  let gateway: ReturnType<typeof createSettingsHttpGateway>;
  let mockSettings: SettingsResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    gateway = createSettingsHttpGateway();
    mockSettings = createStableSettings();
  });

  describe('getSettings', () => {
    it('should get settings successfully', async () => {
      mockedSettingsApi.getSettings.mockResolvedValue(mockSettings);
      const result = await gateway.getSettings();

      expect(result).toEqual(mockSettings);
      expect(mockedSettingsApi.getSettings).toHaveBeenCalledWith(undefined);
      expect(mockedSettingsApi.getSettings).toHaveBeenCalledTimes(1);
    });

    it('should get settings with options', async () => {
      const mockController = new AbortController();
      const options = { signal: mockController.signal };

      mockedSettingsApi.getSettings.mockResolvedValue(mockSettings);
      const result = await gateway.getSettings(options);

      expect(result).toEqual(mockSettings);
      expect(mockedSettingsApi.getSettings).toHaveBeenCalledWith(options);
      expect(mockedSettingsApi.getSettings).toHaveBeenCalledTimes(1);
    });

    it('should handle settings with empty MUI key', async () => {
      const settingsWithEmptyMui = createMockSettings({ muiKey: '' });

      mockedSettingsApi.getSettings.mockResolvedValue(settingsWithEmptyMui);
      const result = await gateway.getSettings();

      expect(result).toEqual(settingsWithEmptyMui);
      expect(result.muiKey).toBe('');
    });

    it('should propagate API errors', async () => {
      const apiError = new Error('API Error: Failed to fetch settings');

      mockedSettingsApi.getSettings.mockRejectedValue(apiError);

      await expect(gateway.getSettings()).rejects.toThrow('API Error: Failed to fetch settings');
      expect(mockedSettingsApi.getSettings).toHaveBeenCalledTimes(1);
    });

    it('should propagate network errors', async () => {
      const networkError = new Error('Network error');

      mockedSettingsApi.getSettings.mockRejectedValue(networkError);

      await expect(gateway.getSettings()).rejects.toThrow('Network error');
    });

    it('should handle AbortController cancellation', async () => {
      const mockController = new AbortController();
      const abortError = new Error('Request aborted');

      abortError.name = 'AbortError';
      mockedSettingsApi.getSettings.mockRejectedValue(abortError);

      await expect(gateway.getSettings({ signal: mockController.signal })).rejects.toThrow('Request aborted');
      expect(mockedSettingsApi.getSettings).toHaveBeenCalledWith({ signal: mockController.signal });
    });
  });

  describe('getSourceInfo', () => {
    it('should return correct source information', () => {
      const sourceInfo = gateway.getSourceInfo();

      expect(sourceInfo).toEqual({
        type: 'http',
        name: 'Settings HTTP Gateway',
        capabilities: {
          offline: false,
          realtime: false,
          persistence: false,
        },
      });
    });

    it('should have consistent source info across multiple calls', () => {
      const sourceInfo1 = gateway.getSourceInfo();
      const sourceInfo2 = gateway.getSourceInfo();

      expect(sourceInfo1).toEqual(sourceInfo2);
      expect(sourceInfo1.type).toBe('http');
      expect(sourceInfo1.capabilities.offline).toBe(false);
      expect(sourceInfo1.capabilities.realtime).toBe(false);
      expect(sourceInfo1.capabilities.persistence).toBe(false);
    });
  });

  describe('gateway factory', () => {
    it('should create gateway with correct interface', () => {
      expect(gateway).toHaveProperty('getSettings');
      expect(gateway).toHaveProperty('getSourceInfo');
      expect(typeof gateway.getSettings).toBe('function');
      expect(typeof gateway.getSourceInfo).toBe('function');
    });

    it('should create independent gateway instances', () => {
      const gateway1 = createSettingsHttpGateway();
      const gateway2 = createSettingsHttpGateway();

      expect(gateway1).not.toBe(gateway2);
      expect(gateway1.getSourceInfo()).toEqual(gateway2.getSourceInfo());
    });
  });

  describe('contract compliance', () => {
    it('should implement SettingsGateway interface', () => {
      expect(gateway).toHaveProperty('getSettings');
      expect(gateway).toHaveProperty('getSourceInfo');
      expect(typeof gateway.getSettings).toBe('function');
      expect(typeof gateway.getSourceInfo).toBe('function');
    });

    it('should extend BaseGateway interface', () => {
      const sourceInfo = gateway.getSourceInfo();

      expect(sourceInfo).toHaveProperty('type');
      expect(sourceInfo).toHaveProperty('name');
      expect(sourceInfo).toHaveProperty('capabilities');
      expect(typeof sourceInfo.type).toBe('string');
      expect(typeof sourceInfo.name).toBe('string');
      expect(typeof sourceInfo.capabilities).toBe('object');
    });
  });

  describe('error scenarios', () => {
    it('should handle malformed API response', async () => {
      const malformedError = new Error('Invalid response format');

      mockedSettingsApi.getSettings.mockRejectedValue(malformedError);

      await expect(gateway.getSettings()).rejects.toThrow('Invalid response format');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');

      mockedSettingsApi.getSettings.mockRejectedValue(timeoutError);

      await expect(gateway.getSettings()).rejects.toThrow('Request timeout');
    });

    it('should handle server errors', async () => {
      const serverError = new Error('HTTP 500 Internal Server Error');

      mockedSettingsApi.getSettings.mockRejectedValue(serverError);

      await expect(gateway.getSettings()).rejects.toThrow('HTTP 500 Internal Server Error');
    });
  });
});
