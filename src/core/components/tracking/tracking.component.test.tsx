import { renderWithProviders } from '@test/utils';

import { useInitAnalytics } from '@/hooks/use-init-analytics/use-init-analytics.hook';
import { useInitFeedback } from '@/hooks/use-init-feedback/use-init-feedback.hook';

import { Tracking } from './tracking.component';

// Mock the new initialization hooks
jest.mock('@/hooks/use-init-analytics/use-init-analytics.hook');
jest.mock('@/hooks/use-init-feedback/use-init-feedback.hook');
jest.mock('@/shared/settings/selectors');

const mockUseInitAnalytics = useInitAnalytics as jest.MockedFunction<typeof useInitAnalytics>;
const mockUseInitFeedback = useInitFeedback as jest.MockedFunction<typeof useInitFeedback>;

// Mock settings selectors
jest.mock('@/shared/settings/selectors', () => ({
  useMixpanelApiKeySelector: jest.fn(() => ({ mixpanelApiKey: 'test-mixpanel-key' })),
  useScreebWebsiteIdSelector: jest.fn(() => ({ screebWebsiteId: 'test-screeb-id' })),
}));

describe('Tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock returns
    mockUseInitAnalytics.mockReturnValue({ initialized: true, enabled: true });
    mockUseInitFeedback.mockReturnValue({ initialized: true, enabled: true });
  });

  it('should render children correctly', () => {
    const { getByText } = renderWithProviders(
      <Tracking>
        <div>Test Content</div>
      </Tracking>,
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should call useInitAnalytics hook with correct parameters', () => {
    renderWithProviders(
      <Tracking>
        <div>Test Content</div>
      </Tracking>,
    );

    expect(mockUseInitAnalytics).toHaveBeenCalledWith({
      apiKey: 'test-mixpanel-key',
      user: {
        id: '',
        username: '',
        appName: '',
      },
      enabled: false, // disabled because user.id is empty
    });
  });

  it('should call useInitFeedback hook with correct parameters', () => {
    renderWithProviders(
      <Tracking>
        <div>Test Content</div>
      </Tracking>,
    );

    expect(mockUseInitFeedback).toHaveBeenCalledWith({
      websiteId: 'test-screeb-id',
      userId: '',
      appName: '',
      enabled: false, // disabled because userId is empty
    });
  });

  it('should initialize both analytics and feedback systems', () => {
    renderWithProviders(
      <Tracking>
        <div>Test Content</div>
      </Tracking>,
    );

    // Verify both hooks are called to initialize their respective systems
    expect(mockUseInitAnalytics).toHaveBeenCalledTimes(1);
    expect(mockUseInitFeedback).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state when settings are not available', () => {
    // Mock empty settings
    jest.requireMock('@/shared/settings/selectors').useMixpanelApiKeySelector.mockReturnValue({ mixpanelApiKey: '' });
    jest.requireMock('@/shared/settings/selectors').useScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: '' });

    renderWithProviders(
      <Tracking>
        <div>Test Content</div>
      </Tracking>,
    );

    expect(mockUseInitAnalytics).toHaveBeenCalledWith({
      apiKey: '',
      user: {
        id: '',
        username: '',
        appName: '',
      },
      enabled: false,
    });

    expect(mockUseInitFeedback).toHaveBeenCalledWith({
      websiteId: '',
      userId: '',
      appName: '',
      enabled: false,
    });
  });
});
