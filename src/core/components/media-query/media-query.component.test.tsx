import { renderWithProviders, screen } from '@test/utils';

import { useResponsiveScreen } from '@/core/hooks';

import { MediaQuery } from './media-query.component';

// Mock the useResponsiveScreen hook
jest.mock('@/core/hooks', () => ({
  useResponsiveScreen: jest.fn(),
}));

const mockUseResponsiveScreen = useResponsiveScreen as jest.MockedFunction<typeof useResponsiveScreen>;

describe('MediaQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testChild = <div data-testid="test-child">Test Content</div>;

  describe('Mobile only', () => {
    it('should render children when on mobile device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: true,
        isTabletDevice: false,
        isDesktopDevice: false,
        deviceType: 'mobile',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(<MediaQuery mobile>{testChild}</MediaQuery>);

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should not render children when not on mobile device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: false,
        isTabletDevice: true,
        isDesktopDevice: false,
        deviceType: 'tablet',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(<MediaQuery mobile>{testChild}</MediaQuery>);

      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });
  });

  describe('Tablet only', () => {
    it('should render children when on tablet device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: false,
        isTabletDevice: true,
        isDesktopDevice: false,
        deviceType: 'tablet',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(<MediaQuery tablet>{testChild}</MediaQuery>);

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should not render children when not on tablet device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: true,
        isTabletDevice: false,
        isDesktopDevice: false,
        deviceType: 'mobile',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(<MediaQuery tablet>{testChild}</MediaQuery>);

      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });
  });

  describe('Desktop only', () => {
    it('should render children when on desktop device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: false,
        isTabletDevice: false,
        isDesktopDevice: true,
        deviceType: 'desktop',
        isPortrait: false,
        isLandscape: true,
      });

      renderWithProviders(<MediaQuery desktop>{testChild}</MediaQuery>);

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should not render children when not on desktop device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: false,
        isTabletDevice: true,
        isDesktopDevice: false,
        deviceType: 'tablet',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(<MediaQuery desktop>{testChild}</MediaQuery>);

      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });
  });

  describe('Mobile and Tablet', () => {
    it('should render children when on mobile device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: true,
        isTabletDevice: false,
        isDesktopDevice: false,
        deviceType: 'mobile',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(
        <MediaQuery mobile tablet>
          {testChild}
        </MediaQuery>,
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should render children when on tablet device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: false,
        isTabletDevice: true,
        isDesktopDevice: false,
        deviceType: 'tablet',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(
        <MediaQuery mobile tablet>
          {testChild}
        </MediaQuery>,
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should not render children when on desktop device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: false,
        isTabletDevice: false,
        isDesktopDevice: true,
        deviceType: 'desktop',
        isPortrait: false,
        isLandscape: true,
      });

      renderWithProviders(
        <MediaQuery mobile tablet>
          {testChild}
        </MediaQuery>,
      );

      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });
  });

  describe('Tablet and Desktop', () => {
    it('should render children when on tablet device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: false,
        isTabletDevice: true,
        isDesktopDevice: false,
        deviceType: 'tablet',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(
        <MediaQuery desktop tablet>
          {testChild}
        </MediaQuery>,
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should render children when on desktop device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: false,
        isTabletDevice: false,
        isDesktopDevice: true,
        deviceType: 'desktop',
        isPortrait: false,
        isLandscape: true,
      });

      renderWithProviders(
        <MediaQuery desktop tablet>
          {testChild}
        </MediaQuery>,
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should not render children when on mobile device', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: true,
        isTabletDevice: false,
        isDesktopDevice: false,
        deviceType: 'mobile',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(
        <MediaQuery desktop tablet>
          {testChild}
        </MediaQuery>,
      );

      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });
  });

  describe('Multiple children', () => {
    it('should render multiple children when condition is met', () => {
      mockUseResponsiveScreen.mockReturnValue({
        isMobileDevice: true,
        isTabletDevice: false,
        isDesktopDevice: false,
        deviceType: 'mobile',
        isPortrait: true,
        isLandscape: false,
      });

      renderWithProviders(
        <MediaQuery mobile>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <span data-testid="child-3">Child 3</span>
        </MediaQuery>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });
  });
});
