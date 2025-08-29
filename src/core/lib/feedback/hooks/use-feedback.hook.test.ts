import { renderHook } from '@test/utils';

import { encryptString } from '@/core/helpers';
import { useScreebWebsiteIdSelector } from '@/shared/settings/selectors';

import Feedback from '../feedback';
import { useFeedbackInitializedSelector } from '../selectors/use-feedback-initialized-selector/use-feedback-initialized-selector.hook';

import { useFeedback } from './use-feedback.hook';

// Mock dependencies
jest.mock('@/config', () => ({
  config: {
    appName: 'test-app',
  },
}));

jest.mock('@/core/helpers', () => ({
  encryptString: jest.fn(),
}));

jest.mock('@/shared/settings/selectors', () => ({
  useScreebWebsiteIdSelector: jest.fn(),
}));

jest.mock('../feedback', () => ({
  init: jest.fn(),
}));

jest.mock('../selectors/use-feedback-initialized-selector/use-feedback-initialized-selector.hook', () => ({
  useFeedbackInitializedSelector: jest.fn(),
}));

const mockEncryptString = encryptString as jest.MockedFunction<typeof encryptString>;
const mockUseScreebWebsiteIdSelector = useScreebWebsiteIdSelector as jest.MockedFunction<
  typeof useScreebWebsiteIdSelector
>;
const mockUseFeedbackInitializedSelector = useFeedbackInitializedSelector as jest.MockedFunction<
  typeof useFeedbackInitializedSelector
>;
const mockFeedbackInit = Feedback.init as jest.MockedFunction<typeof Feedback.init>;

describe('useFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: 'test-website-id' });
    mockEncryptString.mockReturnValue('encrypted-user-id');
    mockFeedbackInit.mockResolvedValue(undefined);
  });

  it('should return initialized status', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: true });

    const { result } = renderHook(() => useFeedback());

    expect(result.current.initialized).toBe(true);
  });

  it('should initialize feedback when not initialized and screebWebsiteId is available', async () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: 'test-website-id' });

    renderHook(() => useFeedback());

    expect(mockFeedbackInit).toHaveBeenCalledWith('test-website-id', 'encrypted-user-id');
  });

  it('should not initialize feedback when already initialized', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: true });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: 'test-website-id' });

    renderHook(() => useFeedback());

    expect(mockFeedbackInit).not.toHaveBeenCalled();
  });

  it('should not initialize feedback when screebWebsiteId is empty', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: '' });

    renderHook(() => useFeedback());

    expect(mockFeedbackInit).not.toHaveBeenCalled();
  });

  it('should not initialize feedback when screebWebsiteId is undefined', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: undefined as any });

    renderHook(() => useFeedback());

    expect(mockFeedbackInit).not.toHaveBeenCalled();
  });

  it('should create encrypted user ID correctly', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: 'test-website-id' });

    renderHook(() => useFeedback());

    expect(mockEncryptString).toHaveBeenCalledWith('@test-app');
    expect(mockFeedbackInit).toHaveBeenCalledWith('test-website-id', 'encrypted-user-id');
  });

  it('should handle feedback initialization failure silently', async () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: 'test-website-id' });
    mockFeedbackInit.mockRejectedValue(new Error('Initialization failed'));

    const { result } = renderHook(() => useFeedback());

    expect(mockFeedbackInit).toHaveBeenCalled();
    expect(result.current.initialized).toBe(false);
    // Should not throw error
  });

  it('should reinitialize when dependencies change', () => {
    let screebWebsiteId = 'website-1';

    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId });

    const { rerender } = renderHook(() => useFeedback());

    expect(mockFeedbackInit).toHaveBeenCalledTimes(1);
    expect(mockFeedbackInit).toHaveBeenCalledWith('website-1', 'encrypted-user-id');

    // Change website ID
    screebWebsiteId = 'website-2';
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId });
    rerender();

    expect(mockFeedbackInit).toHaveBeenCalledTimes(2);
    expect(mockFeedbackInit).toHaveBeenLastCalledWith('website-2', 'encrypted-user-id');
  });

  it('should use memoized encrypted user ID', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: 'test-website-id' });

    const { rerender } = renderHook(() => useFeedback());

    expect(mockEncryptString).toHaveBeenCalledTimes(1);

    // Rerender should not call encryptString again since user.id hasn't changed
    rerender();
    expect(mockEncryptString).toHaveBeenCalledTimes(1);
  });

  it('should return feedback interface correctly', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: true });

    const { result } = renderHook(() => useFeedback());

    expect(result.current).toEqual({
      initialized: true,
    });
  });

  it('should handle config.appName correctly', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId: 'test-website-id' });

    renderHook(() => useFeedback());

    expect(mockEncryptString).toHaveBeenCalledWith('@test-app');
  });

  it('should not break with different initialization states', () => {
    const testCases = [
      { initialized: true, screebWebsiteId: 'id-1' },
      { initialized: false, screebWebsiteId: 'id-2' },
      { initialized: false, screebWebsiteId: '' },
      { initialized: true, screebWebsiteId: '' },
    ];

    testCases.forEach(({ initialized, screebWebsiteId }) => {
      jest.clearAllMocks();

      mockUseFeedbackInitializedSelector.mockReturnValue({ initialized });
      mockUseScreebWebsiteIdSelector.mockReturnValue({ screebWebsiteId });

      const { result } = renderHook(() => useFeedback());

      expect(result.current.initialized).toBe(initialized);

      if (!initialized && screebWebsiteId) {
        expect(mockFeedbackInit).toHaveBeenCalled();
      } else {
        expect(mockFeedbackInit).not.toHaveBeenCalled();
      }
    });
  });
});
