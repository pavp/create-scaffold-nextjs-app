// eslint-disable-next-line no-restricted-imports
import useMediaQuery from '@mui/material/useMediaQuery';
import { renderHook } from '@test/utils';

import { useResponsiveScreen } from './use-responsive-screen.hook';

// Mock MUI useMediaQuery
jest.mock('@mui/material/useMediaQuery');

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('useResponsiveScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should detect mobile device correctly', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(true) // isMobileDevice
      .mockReturnValueOnce(false) // isTabletDevice
      .mockReturnValueOnce(false) // isDesktopDevice
      .mockReturnValueOnce(true) // isPortrait
      .mockReturnValueOnce(false); // isLandscape

    const { result } = renderHook(() => useResponsiveScreen());

    expect(result.current.isMobileDevice).toBe(true);
    expect(result.current.isTabletDevice).toBe(false);
    expect(result.current.isDesktopDevice).toBe(false);
    expect(result.current.deviceType).toBe('mobile');
    expect(result.current.isPortrait).toBe(true);
    expect(result.current.isLandscape).toBe(false);
  });

  it('should detect tablet device correctly', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isMobileDevice
      .mockReturnValueOnce(true) // isTabletDevice
      .mockReturnValueOnce(false) // isDesktopDevice
      .mockReturnValueOnce(false) // isPortrait
      .mockReturnValueOnce(true); // isLandscape

    const { result } = renderHook(() => useResponsiveScreen());

    expect(result.current.isMobileDevice).toBe(false);
    expect(result.current.isTabletDevice).toBe(true);
    expect(result.current.isDesktopDevice).toBe(false);
    expect(result.current.deviceType).toBe('tablet');
    expect(result.current.isPortrait).toBe(false);
    expect(result.current.isLandscape).toBe(true);
  });

  it('should detect desktop device correctly', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isMobileDevice
      .mockReturnValueOnce(false) // isTabletDevice
      .mockReturnValueOnce(true) // isDesktopDevice
      .mockReturnValueOnce(false) // isPortrait
      .mockReturnValueOnce(true); // isLandscape

    const { result } = renderHook(() => useResponsiveScreen());

    expect(result.current.isMobileDevice).toBe(false);
    expect(result.current.isTabletDevice).toBe(false);
    expect(result.current.isDesktopDevice).toBe(true);
    expect(result.current.deviceType).toBe('desktop');
    expect(result.current.isPortrait).toBe(false);
    expect(result.current.isLandscape).toBe(true);
  });

  it('should default to desktop when no specific device is detected', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isMobileDevice
      .mockReturnValueOnce(false) // isTabletDevice
      .mockReturnValueOnce(false) // isDesktopDevice
      .mockReturnValueOnce(true) // isPortrait
      .mockReturnValueOnce(false); // isLandscape

    const { result } = renderHook(() => useResponsiveScreen());

    expect(result.current.deviceType).toBe('desktop');
  });

  it('should prioritize mobile over tablet when both are true', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(true) // isMobileDevice
      .mockReturnValueOnce(true) // isTabletDevice (should be ignored)
      .mockReturnValueOnce(false) // isDesktopDevice
      .mockReturnValueOnce(true) // isPortrait
      .mockReturnValueOnce(false); // isLandscape

    const { result } = renderHook(() => useResponsiveScreen());

    expect(result.current.deviceType).toBe('mobile');
  });

  it('should handle portrait orientation correctly', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(true) // isMobileDevice
      .mockReturnValueOnce(false) // isTabletDevice
      .mockReturnValueOnce(false) // isDesktopDevice
      .mockReturnValueOnce(true) // isPortrait
      .mockReturnValueOnce(false); // isLandscape

    const { result } = renderHook(() => useResponsiveScreen());

    expect(result.current.isPortrait).toBe(true);
    expect(result.current.isLandscape).toBe(false);
  });

  it('should handle landscape orientation correctly', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isMobileDevice
      .mockReturnValueOnce(true) // isTabletDevice
      .mockReturnValueOnce(false) // isDesktopDevice
      .mockReturnValueOnce(false) // isPortrait
      .mockReturnValueOnce(true); // isLandscape

    const { result } = renderHook(() => useResponsiveScreen());

    expect(result.current.isPortrait).toBe(false);
    expect(result.current.isLandscape).toBe(true);
  });

  it('should call useMediaQuery with correct queries', () => {
    renderHook(() => useResponsiveScreen());

    expect(mockUseMediaQuery).toHaveBeenCalledTimes(5);

    // Check that media queries were called with expected patterns
    const calls = mockUseMediaQuery.mock.calls;

    expect(calls[0][0]).toMatch(/min-device-width.*max-device-width/); // mobile
    expect(calls[1][0]).toMatch(/min-device-width.*max-device-width/); // tablet
    expect(calls[2][0]).toMatch(/min-device-width/); // desktop
    expect(calls[3][0]).toBe('(orientation: portrait)');
    expect(calls[4][0]).toBe('(orientation: landscape)');
  });
});
