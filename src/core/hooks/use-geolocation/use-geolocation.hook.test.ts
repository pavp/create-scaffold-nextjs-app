import { act, renderHookWithProviders, waitFor } from '@test/utils';

import { useGeolocation } from './use-geolocation.hook';

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Stable mock for useShowToast to avoid new function identity each render (which would retrigger effects)
const mockShowToast = jest.fn();

jest.mock('@/ui/toast/hooks', () => ({
  useShowToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Mock next-intl with stable translation function (avoid new function each render triggering effect deps)
const stableT = (key: string) => key;

jest.mock('next-intl', () => ({
  useTranslations: () => stableT,
  useLocale: () => 'en',
}));

// Helper to create a mock PermissionStatus
const createPermissionStatus = (state: string) => ({
  state,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

// Mock navigator.permissions
const mockPermissions = {
  query: jest.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  configurable: true,
});

Object.defineProperty(global.navigator, 'permissions', {
  value: mockPermissions,
  configurable: true,
});

describe('useGeolocation', () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    mockConsoleError.mockClear();
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true,
    });
    // Default permission state -> prompt
    mockPermissions.query.mockResolvedValue(createPermissionStatus('prompt'));
    // Provide a default successful implementation to avoid pending Promises; individual tests override as needed.
    mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
      const defaultPosition = {
        coords: {
          latitude: 1,
          longitude: 1,
          accuracy: 1,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as GeolocationPosition;

      // Direct sync invoke inside act to avoid timer complexities
      act(() => {
        success(defaultPosition);
      });
    });
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it('should initialize with default state', () => {
    const { result } = renderHookWithProviders(() => useGeolocation());

    expect(result.current.state.isEnabled).toBe(false);
    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.latitude).toBeNull();
    expect(result.current.state.longitude).toBeNull();
    expect(result.current.state.accuracy).toBeNull();
    expect(result.current.state.error).toBeUndefined();
    expect(typeof result.current.methods.requestLocation).toBe('function');
    expect(typeof result.current.methods.checkGeolocationPermission).toBe('function');
  });

  it('should successfully request location', async () => {
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    // Override default permission to granted so initial effect auto-requests location
    mockPermissions.query.mockResolvedValue(createPermissionStatus('granted'));

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const { result } = renderHookWithProviders(() => useGeolocation());

    await waitFor(() => {
      // After auto permission check triggers requestLocation
      expect(result.current.state.isEnabled).toBe(true);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.latitude).toBe(40.7128);
      expect(result.current.state.longitude).toBe(-74.006);
      expect(result.current.state.accuracy).toBe(10);
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it('should handle request location error', async () => {
    const mockError = {
      code: 1,
      message: 'User denied the request for Geolocation.',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError);
    });

    const { result } = renderHookWithProviders(() => useGeolocation());

    await expect(result.current.methods.requestLocation()).rejects.toEqual(mockError);

    await waitFor(() => {
      expect(result.current.state.isEnabled).toBe(false);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toEqual(mockError);
    });
  });

  it('should handle unsupported geolocation', async () => {
    // Mock geolocation as undefined
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHookWithProviders(() => useGeolocation());

    await act(async () => {
      await expect(result.current.methods.requestLocation()).rejects.toBeInstanceOf(Error);
    });

    expect(mockConsoleError).not.toHaveBeenCalled();
    // Since geolocation unsupported, isEnabled should remain false after failed request attempt.
    expect(result.current.state.isEnabled).toBe(false);
    // Restore mock for subsequent tests

    // Restore geolocation
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true,
    });
  });

  it('should check geolocation permission when granted', async () => {
    const mockPermissionState = {
      state: 'granted',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    mockPermissions.query.mockResolvedValue(mockPermissionState);
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 0);
    });

    const { result } = renderHookWithProviders(() => useGeolocation());

    let position: GeolocationPosition | null = null;

    position = await result.current.methods.checkGeolocationPermission(true);

    await waitFor(() => {
      expect(result.current.state.isEnabled).toBe(true);
      expect(position).toEqual(mockPosition);
    });

    expect(mockPermissions.query).toHaveBeenCalledWith({ name: 'geolocation' });
  });

  it('should check geolocation permission when denied', async () => {
    const mockPermissionState = {
      state: 'denied',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    mockPermissions.query.mockResolvedValue(mockPermissionState);

    const { result } = renderHookWithProviders(() => useGeolocation());

    let position: GeolocationPosition | null = null;

    position = await result.current.methods.checkGeolocationPermission(false);

    await waitFor(() => {
      expect(result.current.state.isEnabled).toBe(false);
      expect(position).toBeNull();
    });
  });

  it('should handle permission check without requesting location', async () => {
    const mockPermissionState = {
      state: 'granted',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    mockPermissions.query.mockResolvedValue(mockPermissionState);

    const { result } = renderHookWithProviders(() => useGeolocation());

    let position: GeolocationPosition | null = null;

    position = await result.current.methods.checkGeolocationPermission(false);

    await waitFor(() => {
      expect(result.current.state.isEnabled).toBe(true);
      expect(position).toBeNull();
    });
  });

  it('should handle missing permissions API', async () => {
    // Mock permissions as undefined
    Object.defineProperty(global.navigator, 'permissions', {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHookWithProviders(() => useGeolocation());

    let position: GeolocationPosition | null = null;

    position = await result.current.methods.checkGeolocationPermission();

    expect(position).toBeNull();

    // Restore permissions
    Object.defineProperty(global.navigator, 'permissions', {
      value: mockPermissions,
      configurable: true,
    });
  });

  it('should remove permission change listener on unmount', async () => {
    const permissionStatus = createPermissionStatus('granted');

    mockPermissions.query.mockResolvedValue(permissionStatus);

    const { unmount } = renderHookWithProviders(() => useGeolocation());

    // Wait until query resolves and listener added
    await waitFor(() => {
      expect(mockPermissions.query).toHaveBeenCalled();
      expect(permissionStatus.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    unmount();

    // Cleanup should remove listener
    expect(permissionStatus.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should react to permission change events', async () => {
    const permissionStatus = createPermissionStatus('granted');

    mockPermissions.query.mockResolvedValue(permissionStatus);

    renderHookWithProviders(() => useGeolocation());

    // Two initial queries happen: (1) auto permission check effect, (2) setupPermissionListener
    await waitFor(() => {
      expect(mockPermissions.query).toHaveBeenCalledTimes(2);
      expect(permissionStatus.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    const changeHandler = permissionStatus.addEventListener.mock.calls[0][1];

    changeHandler();

    await waitFor(() => {
      expect(mockPermissions.query).toHaveBeenCalledTimes(3);
    });
  });

  it('should handle console.error when requesting location fails', async () => {
    const mockError = new Error('Test error');

    // Mock getCurrentPosition to throw an error
    mockGeolocation.getCurrentPosition.mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHookWithProviders(() => useGeolocation());

    await expect(result.current.methods.requestLocation()).rejects.toThrow(mockError);

    expect(mockConsoleError).toHaveBeenCalledWith('Error requesting location:', mockError);
  });
});
