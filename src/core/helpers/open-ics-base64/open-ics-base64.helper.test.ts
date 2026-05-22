import { openICSBase64 } from './open-ics-base64.helper';

// Mock console.error to suppress error messages in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Simple mocks for testing
const mockCreateObjectURL = jest.fn(() => 'mock-url');
const mockRevokeObjectURL = jest.fn();
const mockClick = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

// Mock DOM elements
const mockLink = {
  href: '',
  download: '',
  style: { display: '' },
  click: mockClick,
};

describe('openICSBase64', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockConsoleError.mockClear();

    // Mock global objects
    Object.defineProperty(global, 'URL', {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
      writable: true,
    });

    Object.defineProperty(global, 'Blob', {
      value: jest.fn().mockImplementation((content, options) => ({
        content,
        options,
        type: options?.type || '',
      })),
      writable: true,
    });

    Object.defineProperty(global, 'atob', {
      value: jest.fn().mockImplementation((str: string) => {
        return Buffer.from(str, 'base64').toString('binary');
      }),
      writable: true,
    });

    Object.defineProperty(global.document, 'createElement', {
      value: jest.fn().mockReturnValue(mockLink),
      writable: true,
    });

    Object.defineProperty(global.document.body, 'appendChild', {
      value: mockAppendChild,
      writable: true,
    });

    Object.defineProperty(global.document.body, 'removeChild', {
      value: mockRemoveChild,
      writable: true,
    });
  });

  describe('Successful execution', () => {
    it('should process valid base64 data successfully', () => {
      const validBase64 = btoa('BEGIN:VCALENDAR\nEND:VCALENDAR');
      const filename = 'test-event.ics';

      openICSBase64(validBase64, filename);

      expect(global.atob).toHaveBeenCalledWith(validBase64);
      expect(global.Blob).toHaveBeenCalledWith(expect.any(Array), { type: 'text/calendar' });
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('should use default filename when none provided', () => {
      const validBase64 = btoa('BEGIN:VCALENDAR\nEND:VCALENDAR');

      openICSBase64(validBase64);

      expect(mockLink.download).toBe('event.ics');
    });

    it('should set custom filename when provided', () => {
      const validBase64 = btoa('BEGIN:VCALENDAR\nEND:VCALENDAR');
      const customFilename = 'my-custom-event.ics';

      openICSBase64(validBase64, customFilename);

      expect(mockLink.download).toBe(customFilename);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid base64 gracefully', () => {
      const error = new Error('Invalid base64');

      jest.mocked(global.atob).mockImplementationOnce(() => {
        throw error;
      });

      // Should not throw error - errors are caught internally
      expect(() => openICSBase64('invalid-base64')).not.toThrow();

      // Verify console.error is called with the error
      expect(mockConsoleError).toHaveBeenCalledWith('Error opening ICS file:', error);

      // Verify no DOM operations after error
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('should handle blob creation errors', () => {
      const error = new Error('Blob creation failed');

      jest.mocked(global.Blob).mockImplementationOnce(() => {
        throw error;
      });

      expect(() => openICSBase64(btoa('test'))).not.toThrow();

      // Verify console.error is called with the error
      expect(mockConsoleError).toHaveBeenCalledWith('Error opening ICS file:', error);
    });

    it('should handle URL creation errors', () => {
      const error = new Error('URL creation failed');

      mockCreateObjectURL.mockImplementationOnce(() => {
        throw error;
      });

      expect(() => openICSBase64(btoa('test'))).not.toThrow();

      // Verify console.error is called with the error
      expect(mockConsoleError).toHaveBeenCalledWith('Error opening ICS file:', error);
    });

    it('should handle DOM errors', () => {
      const error = new Error('DOM error');

      mockAppendChild.mockImplementationOnce(() => {
        throw error;
      });

      expect(() => openICSBase64(btoa('test'))).not.toThrow();

      // Verify console.error is called with the error
      expect(mockConsoleError).toHaveBeenCalledWith('Error opening ICS file:', error);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty base64 string', () => {
      expect(() => openICSBase64('')).not.toThrow();
    });

    it('should handle empty filename', () => {
      openICSBase64(btoa('test'), '');
      expect(mockLink.download).toBe('');
    });

    it('should handle special characters in filename', () => {
      const specialFilename = 'événement-spécial-#@$%.ics';

      openICSBase64(btoa('test'), specialFilename);
      expect(mockLink.download).toBe(specialFilename);
    });
  });
});
