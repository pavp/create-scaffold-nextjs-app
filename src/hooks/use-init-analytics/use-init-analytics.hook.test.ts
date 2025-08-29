import { renderHook } from '@test/utils';

import { encryptString } from '@/core/helpers';
import Analytics from '@/core/lib/analytics/analytics';
import { useAnalyticsInitializedSelector } from '@/core/lib/analytics/selectors/use-analytics-initialized-selector/use-analytics-initialized-selector.hook';

import { useInitAnalytics } from './use-init-analytics.hook';
import { UseInitAnalyticsParams } from './use-init-analytics.types';

// Mock dependencies
jest.mock('@/core/helpers', () => ({
  encryptString: jest.fn(),
}));

jest.mock('@/core/lib/analytics/analytics', () => ({
  init: jest.fn(),
  identifyUser: jest.fn(),
}));

jest.mock(
  '@/core/lib/analytics/selectors/use-analytics-initialized-selector/use-analytics-initialized-selector.hook',
  () => ({
    useAnalyticsInitializedSelector: jest.fn(),
  }),
);

const mockEncryptString = encryptString as jest.MockedFunction<typeof encryptString>;
const mockUseAnalyticsInitializedSelector = useAnalyticsInitializedSelector as jest.MockedFunction<
  typeof useAnalyticsInitializedSelector
>;
const mockAnalyticsInit = Analytics.init as jest.MockedFunction<typeof Analytics.init>;
const mockAnalyticsIdentifyUser = Analytics.identifyUser as jest.MockedFunction<typeof Analytics.identifyUser>;

describe('useInitAnalytics', () => {
  const defaultParams: UseInitAnalyticsParams = {
    apiKey: 'test-api-key',
    user: {
      id: 'user-123',
      username: 'testuser',
      appName: 'TestApp',
    },
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseAnalyticsInitializedSelector.mockReturnValue({ initialized: false });
    mockEncryptString.mockReturnValue('encrypted-user-id');
    mockAnalyticsInit.mockImplementation(() => {});
    mockAnalyticsIdentifyUser.mockImplementation(() => {});
  });

  it('should return initialization status and enabled state', () => {
    const { result } = renderHook(() => useInitAnalytics(defaultParams));

    expect(result.current.initialized).toBe(false);
    expect(result.current.enabled).toBe(true);
  });

  it('should return enabled as false when no API key provided', () => {
    const params = { ...defaultParams, apiKey: '' };
    const { result } = renderHook(() => useInitAnalytics(params));

    expect(result.current.enabled).toBe(false);
  });

  it('should return enabled as false when disabled', () => {
    const params = { ...defaultParams, enabled: false };
    const { result } = renderHook(() => useInitAnalytics(params));

    expect(result.current.enabled).toBe(false);
  });

  it('should initialize analytics when not initialized and conditions met', () => {
    renderHook(() => useInitAnalytics(defaultParams));

    expect(mockAnalyticsInit).toHaveBeenCalledWith('test-api-key');
    expect(mockAnalyticsIdentifyUser).toHaveBeenCalledWith({
      id: 'user-123',
      customUserId: 'encrypted-user-id',
      username: 'testuser',
      appName: 'TestApp',
    });
  });

  it('should not initialize when already initialized', () => {
    mockUseAnalyticsInitializedSelector.mockReturnValue({ initialized: true });

    renderHook(() => useInitAnalytics(defaultParams));

    expect(mockAnalyticsInit).not.toHaveBeenCalled();
    expect(mockAnalyticsIdentifyUser).not.toHaveBeenCalled();
  });

  it('should not initialize when disabled', () => {
    const params = { ...defaultParams, enabled: false };

    renderHook(() => useInitAnalytics(params));

    expect(mockAnalyticsInit).not.toHaveBeenCalled();
    expect(mockAnalyticsIdentifyUser).not.toHaveBeenCalled();
  });

  it('should not initialize when no API key', () => {
    const params = { ...defaultParams, apiKey: '' };

    renderHook(() => useInitAnalytics(params));

    expect(mockAnalyticsInit).not.toHaveBeenCalled();
    expect(mockAnalyticsIdentifyUser).not.toHaveBeenCalled();
  });

  it('should not initialize when no user ID', () => {
    const params = { ...defaultParams, user: { ...defaultParams.user, id: '' } };

    renderHook(() => useInitAnalytics(params));

    expect(mockAnalyticsInit).not.toHaveBeenCalled();
    expect(mockAnalyticsIdentifyUser).not.toHaveBeenCalled();
  });

  it('should use custom userIdTransform when provided', () => {
    const customTransform = jest.fn().mockReturnValue('custom-encrypted-id');
    const params = { ...defaultParams, userIdTransform: customTransform };

    renderHook(() => useInitAnalytics(params));

    expect(customTransform).toHaveBeenCalledWith('user-123', 'TestApp');
    expect(mockEncryptString).not.toHaveBeenCalled();
    expect(mockAnalyticsIdentifyUser).toHaveBeenCalledWith({
      id: 'user-123',
      customUserId: 'custom-encrypted-id',
      username: 'testuser',
      appName: 'TestApp',
    });
  });

  it('should handle user without appName', () => {
    const params = {
      ...defaultParams,
      user: { id: 'user-123', username: 'testuser' },
    };

    renderHook(() => useInitAnalytics(params));

    expect(mockEncryptString).toHaveBeenCalledWith('user-123');
    expect(mockAnalyticsIdentifyUser).toHaveBeenCalledWith({
      id: 'user-123',
      customUserId: 'encrypted-user-id',
      username: 'testuser',
    });
  });

  it('should include all user properties in analytics user', () => {
    const params = {
      ...defaultParams,
      user: {
        id: 'user-123',
        username: 'testuser',
        appName: 'TestApp',
        email: 'test@example.com',
        role: 'admin',
        customProperty: 'value',
      },
    };

    renderHook(() => useInitAnalytics(params));

    expect(mockAnalyticsIdentifyUser).toHaveBeenCalledWith({
      id: 'user-123',
      customUserId: 'encrypted-user-id',
      username: 'testuser',
      appName: 'TestApp',
      email: 'test@example.com',
      role: 'admin',
      customProperty: 'value',
    });
  });

  it('should handle analytics initialization errors silently', () => {
    mockAnalyticsInit.mockImplementation(() => {
      throw new Error('Analytics init failed');
    });

    const { result } = renderHook(() => useInitAnalytics(defaultParams));

    expect(mockAnalyticsInit).toHaveBeenCalled();
    expect(result.current.initialized).toBe(false);
    // Should not throw error
  });

  it('should handle user identification errors silently', () => {
    mockAnalyticsIdentifyUser.mockImplementation(() => {
      throw new Error('User identification failed');
    });

    const { result } = renderHook(() => useInitAnalytics(defaultParams));

    expect(mockAnalyticsInit).toHaveBeenCalled();
    expect(mockAnalyticsIdentifyUser).toHaveBeenCalled();
    expect(result.current.initialized).toBe(false);
    // Should not throw error
  });

  it('should reinitialize when dependencies change', () => {
    const { rerender } = renderHook(({ params }) => useInitAnalytics(params), {
      initialProps: { params: defaultParams },
    });

    expect(mockAnalyticsInit).toHaveBeenCalledTimes(1);

    // Change API key
    const newParams = { ...defaultParams, apiKey: 'new-api-key' };

    rerender({ params: newParams });

    expect(mockAnalyticsInit).toHaveBeenCalledTimes(2);
    expect(mockAnalyticsInit).toHaveBeenLastCalledWith('new-api-key');
  });

  it('should use memoized encrypted user ID', () => {
    const { rerender } = renderHook(() => useInitAnalytics(defaultParams));

    expect(mockEncryptString).toHaveBeenCalledTimes(1);

    // Rerender should not call encryptString again since user.id and appName haven't changed
    rerender();
    expect(mockEncryptString).toHaveBeenCalledTimes(1);
  });

  it('should encrypt user ID with appName when provided', () => {
    renderHook(() => useInitAnalytics(defaultParams));

    expect(mockEncryptString).toHaveBeenCalledWith('user-123@TestApp');
  });

  it('should encrypt only user ID when no appName', () => {
    const params = {
      ...defaultParams,
      user: { id: 'user-123', username: 'testuser' },
    };

    renderHook(() => useInitAnalytics(params));

    expect(mockEncryptString).toHaveBeenCalledWith('user-123');
  });

  it('should handle enabled changing from false to true', () => {
    const { rerender } = renderHook(({ enabled }) => useInitAnalytics({ ...defaultParams, enabled }), {
      initialProps: { enabled: false },
    });

    expect(mockAnalyticsInit).not.toHaveBeenCalled();

    rerender({ enabled: true });

    expect(mockAnalyticsInit).toHaveBeenCalledWith('test-api-key');
  });
});
