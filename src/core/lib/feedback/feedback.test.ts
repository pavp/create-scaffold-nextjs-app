import { jest } from '@jest/globals';

const mockScreenb = {
  load: jest.fn<() => Promise<void>>(),
  init: jest.fn<(websiteId: string, userId: string) => Promise<void>>(),
  close: jest.fn<() => void>(),
  isLoaded: jest.fn<() => boolean>(),
  setUser: jest.fn<(userId: string) => void>(),
};

jest.mock('@screeb/sdk-browser', () => mockScreenb);

const mockResetFeedbackState = jest.fn();
const mockSetFeedbackInitialized = jest.fn();

jest.mock('./stores/feedback.store.actions', () => ({
  resetFeedbackState: mockResetFeedbackState,
  setFeedbackInitialized: mockSetFeedbackInitialized,
}));

// Import the real feedback module (this is what we're testing)
// Use jest.requireActual to get the real implementation, not a mock
const Feedback = (jest.requireActual('./feedback') as any).default;

describe('Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockScreenb.isLoaded.mockReturnValue(true);
    mockScreenb.load.mockResolvedValue();
    mockScreenb.init.mockResolvedValue();
    mockScreenb.close.mockImplementation(() => {});
  });

  describe('isLoaded', () => {
    it('should return false initially', () => {
      // Reset first to ensure clean state
      Feedback.reset();
      expect(Feedback.isLoaded()).toBe(false);
    });

    it('should return true after successful init', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');

      expect(Feedback.isLoaded()).toBe(true);
    });

    it('should return false after reset', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      Feedback.reset();

      expect(Feedback.isLoaded()).toBe(false);
    });
  });

  describe('isInitialized', () => {
    it('should return false initially', () => {
      Feedback.reset(); // Ensure clean state
      expect(Feedback.isInitialized()).toBe(false);
    });

    it('should return true after successful init', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');

      expect(Feedback.isInitialized()).toBe(true);
    });

    it('should return false after close', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      Feedback.close();

      expect(Feedback.isInitialized()).toBe(false);
    });

    it('should return false after reset', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      Feedback.reset();

      expect(Feedback.isInitialized()).toBe(false);
    });
  });

  describe('init', () => {
    it('should load and initialize Screeb on first call', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');

      expect(mockScreenb.load).toHaveBeenCalledTimes(1);
      expect(mockScreenb.init).toHaveBeenCalledWith('website-id', 'user-id');
      expect(mockSetFeedbackInitialized).toHaveBeenCalledWith(true);
    });

    it('should update store state after successful initialization', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');

      expect(mockSetFeedbackInitialized).toHaveBeenCalledWith(true);
    });

    it('should not load again if already loaded', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      await Feedback.init('website-id-2', 'user-id-2');

      expect(mockScreenb.load).toHaveBeenCalledTimes(1);
      expect(mockScreenb.init).toHaveBeenCalledTimes(1);
    });

    it('should not initialize again if already initialized', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      await Feedback.init('website-id', 'user-id');

      expect(mockScreenb.init).toHaveBeenCalledTimes(1);
    });

    it('should propagate load errors', async () => {
      Feedback.reset(); // Ensure clean state
      const loadError = new Error('Failed to load Screeb');

      mockScreenb.load.mockRejectedValue(loadError as never);

      await expect(Feedback.init('website-id', 'user-id')).rejects.toThrow('Failed to load Screeb');

      expect(Feedback.isLoaded()).toBe(false);
      expect(Feedback.isInitialized()).toBe(false);
    });

    it('should propagate init errors', async () => {
      Feedback.reset(); // Ensure clean state
      const initError = new Error('Failed to initialize Screeb');

      mockScreenb.init.mockRejectedValue(initError as never);

      await expect(Feedback.init('website-id', 'user-id')).rejects.toThrow('Failed to initialize Screeb');

      expect(Feedback.isLoaded()).toBe(true);
      expect(Feedback.isInitialized()).toBe(false);
    });
  });

  describe('close', () => {
    it('should not call Screeb.close if not loaded', () => {
      Feedback.reset(); // Ensure clean state
      jest.clearAllMocks(); // Clear all mocks after reset

      Feedback.close();

      expect(mockScreenb.close).not.toHaveBeenCalled();
    });

    it('should not call Screeb.close if Screeb.isLoaded returns false', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      mockScreenb.isLoaded.mockReturnValue(false);
      jest.clearAllMocks(); // Clear all mocks after init but before the action we want to test

      Feedback.close();

      expect(mockScreenb.close).not.toHaveBeenCalled();
    });

    it('should call Screeb.close when loaded and Screeb.isLoaded returns true', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      mockScreenb.isLoaded.mockReturnValue(true);
      jest.clearAllMocks(); // Clear all mocks after init but before the action we want to test

      Feedback.close();

      expect(mockScreenb.close).toHaveBeenCalledTimes(1);
    });

    it('should handle Screeb.close errors silently', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      mockScreenb.isLoaded.mockReturnValue(true);
      mockScreenb.close.mockImplementation(() => {
        throw new Error('Close failed');
      });

      expect(() => Feedback.close()).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset all internal flags', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');

      Feedback.reset();

      expect(Feedback.isLoaded()).toBe(false);
      expect(Feedback.isInitialized()).toBe(false);
    });

    it('should reset store state', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      jest.clearAllMocks(); // Clear all mocks after init but before the action we want to test

      Feedback.reset();

      expect(mockResetFeedbackState).toHaveBeenCalledTimes(1);
    });

    it('should call close during reset', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      mockScreenb.isLoaded.mockReturnValue(true);

      Feedback.reset();

      expect(mockScreenb.close).toHaveBeenCalledTimes(1);
    });

    it('should handle errors silently', async () => {
      Feedback.reset(); // Ensure clean state
      await Feedback.init('website-id', 'user-id');
      mockScreenb.isLoaded.mockReturnValue(true);
      mockScreenb.close.mockImplementation(() => {
        throw new Error('Close failed');
      });

      expect(() => Feedback.reset()).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete lifecycle: init -> close -> init again', async () => {
      Feedback.reset(); // Ensure clean state

      // First initialization
      await Feedback.init('website-id', 'user-id');
      expect(Feedback.isLoaded()).toBe(true);
      expect(Feedback.isInitialized()).toBe(true);

      // Close
      mockScreenb.isLoaded.mockReturnValue(true);
      Feedback.close();
      expect(Feedback.isInitialized()).toBe(false);
      expect(Feedback.isLoaded()).toBe(true); // Still loaded

      // Second initialization (should not load again, but init again)
      await Feedback.init('website-id-2', 'user-id-2');
      expect(Feedback.isLoaded()).toBe(true);
      expect(Feedback.isInitialized()).toBe(true);

      expect(mockScreenb.load).toHaveBeenCalledTimes(1); // Only called once
      expect(mockScreenb.init).toHaveBeenCalledTimes(2); // Called twice
    });

    it('should handle complete lifecycle: init -> reset -> init again', async () => {
      Feedback.reset(); // Ensure clean state

      // First initialization
      await Feedback.init('website-id', 'user-id');
      expect(Feedback.isLoaded()).toBe(true);
      expect(Feedback.isInitialized()).toBe(true);

      // Reset
      mockScreenb.isLoaded.mockReturnValue(true);
      Feedback.reset();
      expect(Feedback.isLoaded()).toBe(false);
      expect(Feedback.isInitialized()).toBe(false);

      // Second initialization (should load and init again)
      await Feedback.init('website-id-2', 'user-id-2');
      expect(Feedback.isLoaded()).toBe(true);
      expect(Feedback.isInitialized()).toBe(true);

      expect(mockScreenb.load).toHaveBeenCalledTimes(2); // Called twice
      expect(mockScreenb.init).toHaveBeenCalledTimes(2); // Called twice
    });
  });
});
