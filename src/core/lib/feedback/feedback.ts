import * as Screeb from '@screeb/sdk-browser';

import { resetFeedbackState, setFeedbackInitialized } from './stores/feedback.store.actions';

/**
 * Feedback Service - Screeb wrapper functions
 * Provides abstraction layer over Screeb SDK
 * Uses same pattern as Analytics service
 */
let _isLoaded = false;
let _isInitialized = false;

/**
 * Initialize Screeb SDK
 */
const init = async (websiteId: string, userId: string): Promise<void> => {
  try {
    if (!_isLoaded) {
      await Screeb.load();
      _isLoaded = true;
    }

    if (!_isInitialized) {
      await Screeb.init(websiteId, userId);
      _isInitialized = true;
      setFeedbackInitialized(true);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Close Screeb session
 */
const close = (): void => {
  try {
    if (_isLoaded && Screeb.isLoaded()) {
      Screeb.close();
      _isInitialized = false;
    }
  } catch {
    // Feedback close failed silently
  }
};

/**
 * Reset feedback service state
 */
const reset = (): void => {
  try {
    close();
    _isLoaded = false;
    _isInitialized = false;
    // Update store state after successful reset
    resetFeedbackState();
  } catch {
    // Feedback reset failed silently
  }
};

/**
 * Check if feedback service is ready
 */
const isInitialized = (): boolean => _isInitialized;

/**
 * Check if Screeb SDK is loaded
 */
const isLoaded = (): boolean => _isLoaded;

const Feedback = {
  init,
  close,
  reset,
  isInitialized,
  isLoaded,
};

export default Feedback;
