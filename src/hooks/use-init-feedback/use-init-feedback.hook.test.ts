import { renderHook } from '@test/utils';

import { encryptString } from '@/core/helpers';
import Feedback from '@/core/lib/feedback/feedback';
import { useFeedbackInitializedSelector } from '@/core/lib/feedback/selectors/use-feedback-initialized-selector/use-feedback-initialized-selector.hook';

import { useInitFeedback } from './use-init-feedback.hook';
import { UseInitFeedbackParams } from './use-init-feedback.types';

// Mock dependencies
jest.mock('@/core/helpers', () => ({
  encryptString: jest.fn(),
}));

jest.mock('@/core/lib/feedback/feedback', () => ({
  init: jest.fn(),
}));

jest.mock(
  '@/core/lib/feedback/selectors/use-feedback-initialized-selector/use-feedback-initialized-selector.hook',
  () => ({
    useFeedbackInitializedSelector: jest.fn(),
  }),
);

const mockEncryptString = encryptString as jest.MockedFunction<typeof encryptString>;
const mockUseFeedbackInitializedSelector = useFeedbackInitializedSelector as jest.MockedFunction<
  typeof useFeedbackInitializedSelector
>;
const mockFeedbackInit = Feedback.init as jest.MockedFunction<typeof Feedback.init>;

describe('useInitFeedback', () => {
  const defaultParams: UseInitFeedbackParams = {
    websiteId: 'test-website-id',
    userId: 'user-123',
    appName: 'TestApp',
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: false });
    mockEncryptString.mockReturnValue('encrypted-user-id');
    mockFeedbackInit.mockResolvedValue(undefined);
  });

  it('should return initialization status and enabled state', () => {
    const { result } = renderHook(() => useInitFeedback(defaultParams));

    expect(result.current.initialized).toBe(false);
    expect(result.current.enabled).toBe(true);
  });

  it('should return enabled as false when no website ID provided', () => {
    const params = { ...defaultParams, websiteId: '' };
    const { result } = renderHook(() => useInitFeedback(params));

    expect(result.current.enabled).toBe(false);
  });

  it('should return enabled as false when disabled', () => {
    const params = { ...defaultParams, enabled: false };
    const { result } = renderHook(() => useInitFeedback(params));

    expect(result.current.enabled).toBe(false);
  });

  it('should initialize feedback when not initialized and conditions met', () => {
    renderHook(() => useInitFeedback(defaultParams));

    expect(mockFeedbackInit).toHaveBeenCalledWith('test-website-id', 'encrypted-user-id');
  });

  it('should not initialize when already initialized', () => {
    mockUseFeedbackInitializedSelector.mockReturnValue({ initialized: true });

    renderHook(() => useInitFeedback(defaultParams));

    expect(mockFeedbackInit).not.toHaveBeenCalled();
  });

  it('should not initialize when disabled', () => {
    const params = { ...defaultParams, enabled: false };

    renderHook(() => useInitFeedback(params));

    expect(mockFeedbackInit).not.toHaveBeenCalled();
  });

  it('should not initialize when no website ID', () => {
    const params = { ...defaultParams, websiteId: '' };

    renderHook(() => useInitFeedback(params));

    expect(mockFeedbackInit).not.toHaveBeenCalled();
  });

  it('should not initialize when no user ID', () => {
    const params = { ...defaultParams, userId: '' };

    renderHook(() => useInitFeedback(params));

    expect(mockFeedbackInit).not.toHaveBeenCalled();
  });

  it('should use custom userIdTransform when provided', () => {
    const customTransform = jest.fn().mockReturnValue('custom-encrypted-id');
    const params = { ...defaultParams, userIdTransform: customTransform };

    renderHook(() => useInitFeedback(params));

    expect(customTransform).toHaveBeenCalledWith('user-123', 'TestApp');
    expect(mockEncryptString).not.toHaveBeenCalled();
    expect(mockFeedbackInit).toHaveBeenCalledWith('test-website-id', 'custom-encrypted-id');
  });

  it('should handle user without appName', () => {
    const params = { ...defaultParams, appName: undefined };

    renderHook(() => useInitFeedback(params));

    expect(mockEncryptString).toHaveBeenCalledWith('user-123');
    expect(mockFeedbackInit).toHaveBeenCalledWith('test-website-id', 'encrypted-user-id');
  });

  it('should encrypt userId with appName when provided', () => {
    renderHook(() => useInitFeedback(defaultParams));

    expect(mockEncryptString).toHaveBeenCalledWith('user-123@TestApp');
  });

  it('should encrypt only userId when no appName', () => {
    const params = { ...defaultParams, appName: undefined };

    renderHook(() => useInitFeedback(params));

    expect(mockEncryptString).toHaveBeenCalledWith('user-123');
  });

  it('should handle feedback initialization errors silently', () => {
    mockFeedbackInit.mockRejectedValue(new Error('Feedback init failed'));

    const { result } = renderHook(() => useInitFeedback(defaultParams));

    expect(mockFeedbackInit).toHaveBeenCalled();
    expect(result.current.initialized).toBe(false);
    // Should not throw error
  });

  it('should reinitialize when dependencies change', () => {
    const { rerender } = renderHook(({ params }) => useInitFeedback(params), {
      initialProps: { params: defaultParams },
    });

    expect(mockFeedbackInit).toHaveBeenCalledTimes(1);

    // Change website ID
    const newParams = { ...defaultParams, websiteId: 'new-website-id' };

    rerender({ params: newParams });

    expect(mockFeedbackInit).toHaveBeenCalledTimes(2);
    expect(mockFeedbackInit).toHaveBeenLastCalledWith('new-website-id', 'encrypted-user-id');
  });

  it('should use memoized encrypted user ID', () => {
    const { rerender } = renderHook(() => useInitFeedback(defaultParams));

    expect(mockEncryptString).toHaveBeenCalledTimes(1);

    // Rerender should not call encryptString again since userId and appName haven't changed
    rerender();
    expect(mockEncryptString).toHaveBeenCalledTimes(1);
  });

  it('should handle enabled changing from false to true', () => {
    const { rerender } = renderHook(({ enabled }) => useInitFeedback({ ...defaultParams, enabled }), {
      initialProps: { enabled: false },
    });

    expect(mockFeedbackInit).not.toHaveBeenCalled();

    rerender({ enabled: true });

    expect(mockFeedbackInit).toHaveBeenCalledWith('test-website-id', 'encrypted-user-id');
  });
});
