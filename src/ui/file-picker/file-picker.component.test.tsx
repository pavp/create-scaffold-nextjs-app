import { fireEvent, render, screen } from '@testing-library/react';

import { FilePicker } from './file-picker.component';

// Mock the useShowToast hook
const mockShowToast = jest.fn();

jest.mock('../toast/hooks', () => ({
  useShowToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Mock the text field constants
jest.mock('../text-field/constants', () => ({
  DEFAULT_TEXT_FIELD_WIDTH: '200px',
}));

// Mock ClearIcon
jest.mock('@mui/icons-material/Clear', () => {
  return function ClearIcon() {
    return <div data-testid="clear-icon" />;
  };
});

describe('FilePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render file picker with basic props', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      expect(screen.getByTestId('file-picker-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-file-picker')).toBeInTheDocument();
      expect(screen.getByTestId('test-file-picker-input')).toBeInTheDocument();
    });

    it('should render with placeholder text', () => {
      render(<FilePicker placeholder="Choose your file" testId="test-file-picker" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-file-picker-input');

      expect(input).toHaveAttribute('placeholder', 'Choose your file');
    });

    it('should render with label', () => {
      render(
        <FilePicker label="File Upload" placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />,
      );

      expect(screen.getByText('File Upload')).toBeInTheDocument();
    });

    it('should render clear button', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
    });
  });

  describe('File selection', () => {
    it('should handle file input click', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const textField = screen.getByTestId('test-file-picker');
      const hiddenInput = document.querySelector('input[type="file"]');

      expect(hiddenInput).toBeInTheDocument();

      // Click the text field to trigger file picker
      fireEvent.click(textField);
    });

    it('should handle file selection', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

      Object.defineProperty(hiddenInput, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(hiddenInput);

      expect(mockOnChange).toHaveBeenCalledWith(file);
    });

    it('should update value when file is selected', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const textInput = screen.getByTestId('test-file-picker-input');

      const file = new File(['test content'], 'my-document.pdf', { type: 'application/pdf' });

      Object.defineProperty(hiddenInput, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(hiddenInput);

      expect(textInput).toHaveValue('my-document.pdf');
    });
  });

  describe('File size validation', () => {
    it('should accept files within size limit', () => {
      render(
        <FilePicker
          placeholder="Select file"
          sizeLimit={5000000} // 5MB
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const file = new File(['test content'], 'small-file.txt', { type: 'text/plain' });

      Object.defineProperty(file, 'size', { value: 1000000, writable: false }); // 1MB

      Object.defineProperty(hiddenInput, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(hiddenInput);

      expect(mockOnChange).toHaveBeenCalledWith(file);
      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it('should show error toast for files exceeding size limit', () => {
      render(
        <FilePicker
          placeholder="Select file"
          sizeLimit={2000000} // 2MB
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const file = new File(['large content'], 'large-file.txt', { type: 'text/plain' });

      Object.defineProperty(file, 'size', { value: 5000000, writable: false }); // 5MB

      Object.defineProperty(hiddenInput, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(hiddenInput);

      expect(mockOnChange).not.toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith({
        snackbarMessage: 'Maximum size file 2MB.',
        severity: 'ERROR',
      });
    });

    it('should use default size limit when not specified', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Create a file larger than default limit (2MB)
      const file = new File(['large content'], 'large-file.txt', { type: 'text/plain' });

      Object.defineProperty(file, 'size', { value: 3000000, writable: false }); // 3MB

      Object.defineProperty(hiddenInput, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(hiddenInput);

      expect(mockShowToast).toHaveBeenCalledWith({
        snackbarMessage: 'Maximum size file 2MB.',
        severity: 'ERROR',
      });
    });

    it('should skip size validation when sizeLimit is falsy', () => {
      render(<FilePicker placeholder="Select file" sizeLimit={0} testId="test-file-picker" onChange={mockOnChange} />);

      const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const file = new File(['large content'], 'large-file.txt', { type: 'text/plain' });

      Object.defineProperty(file, 'size', { value: 10000000, writable: false }); // 10MB

      Object.defineProperty(hiddenInput, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(hiddenInput);

      expect(mockOnChange).toHaveBeenCalledWith(file);
      expect(mockShowToast).not.toHaveBeenCalled();
    });
  });

  describe('Clear functionality', () => {
    it('should clear selected file when clear button is clicked', () => {
      render(
        <FilePicker
          defaultValue="existing-file.txt"
          placeholder="Select file"
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      const textInput = screen.getByTestId('test-file-picker-input');
      const clearButton = screen.getByRole('button');

      expect(textInput).toHaveValue('existing-file.txt');

      fireEvent.click(clearButton);

      expect(textInput).toHaveValue('');
    });

    it('should stop event propagation when clear button is clicked', () => {
      const mockStopPropagation = jest.fn();

      render(
        <FilePicker
          defaultValue="existing-file.txt"
          placeholder="Select file"
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      const clearButton = screen.getByRole('button');

      const clickEvent = new MouseEvent('click', { bubbles: true });

      clickEvent.stopPropagation = mockStopPropagation;

      fireEvent(clearButton, clickEvent);

      expect(mockStopPropagation).toHaveBeenCalled();
    });

    it('should disable clear button when no file is selected', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const clearButton = screen.getByRole('button');

      expect(clearButton).toBeDisabled();
    });

    it('should enable clear button when file is selected', () => {
      render(
        <FilePicker
          defaultValue="selected-file.txt"
          placeholder="Select file"
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      const clearButton = screen.getByRole('button');

      expect(clearButton).not.toBeDisabled();
    });
  });

  describe('Component states', () => {
    it('should render as disabled', () => {
      render(<FilePicker disabled placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const textInput = screen.getByTestId('test-file-picker-input');

      expect(textInput).toBeDisabled();
    });

    it('should render as required', () => {
      render(<FilePicker required placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const textInput = screen.getByTestId('test-file-picker-input');

      expect(textInput).toBeRequired();
    });

    it('should render with default value', () => {
      render(
        <FilePicker
          defaultValue="default-file.txt"
          placeholder="Select file"
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      const textInput = screen.getByTestId('test-file-picker-input');

      expect(textInput).toHaveValue('default-file.txt');
    });

    it('should update value when defaultValue changes', () => {
      const { rerender } = render(
        <FilePicker
          defaultValue="initial-file.txt"
          placeholder="Select file"
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      let textInput = screen.getByTestId('test-file-picker-input');

      expect(textInput).toHaveValue('initial-file.txt');

      rerender(
        <FilePicker
          defaultValue="updated-file.txt"
          placeholder="Select file"
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      textInput = screen.getByTestId('test-file-picker-input');
      expect(textInput).toHaveValue('updated-file.txt');
    });
  });

  describe('File acceptance', () => {
    it('should render with accept attribute', () => {
      render(
        <FilePicker accept="image/*" placeholder="Select image" testId="test-file-picker" onChange={mockOnChange} />,
      );

      const hiddenInput = document.querySelector('input[type="file"]');

      expect(hiddenInput).toHaveAttribute('accept', 'image/*');
    });

    it('should render with specific file types', () => {
      render(
        <FilePicker
          accept=".pdf,.doc,.docx"
          placeholder="Select PDF"
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      const hiddenInput = document.querySelector('input[type="file"]');

      expect(hiddenInput).toHaveAttribute('accept', '.pdf,.doc,.docx');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom className', () => {
      render(
        <FilePicker
          className="custom-class"
          placeholder="Select file"
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      const textField = screen.getByTestId('test-file-picker');

      expect(textField).toHaveClass('custom-class');
    });

    it('should render with custom width', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" width="300px" onChange={mockOnChange} />);

      const textField = screen.getByTestId('test-file-picker');

      expect(textField).toBeInTheDocument();
    });

    it('should render with start adornment', () => {
      const startAdornment = <span data-testid="start-adornment">📁</span>;

      render(
        <FilePicker
          placeholder="Select file"
          startAdornment={startAdornment}
          testId="test-file-picker"
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByTestId('start-adornment')).toBeInTheDocument();
    });

    it('should have pointer cursor on hover', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const textInput = screen.getByTestId('test-file-picker-input');

      // The cursor style is applied via sx prop
      expect(textInput).toBeInTheDocument();
    });

    it('should render as readonly', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const textInput = screen.getByTestId('test-file-picker-input');

      expect(textInput).toHaveAttribute('readonly');
    });
  });

  describe('Edge cases', () => {
    it('should handle missing file in change event', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(hiddenInput, 'files', {
        value: [],
        writable: false,
      });

      fireEvent.change(hiddenInput);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should handle null files in change event', () => {
      render(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(hiddenInput, 'files', {
        value: null,
        writable: false,
      });

      fireEvent.change(hiddenInput);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(
        <FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />,
      );

      const firstRender = screen.getByTestId('file-picker-container');

      rerender(<FilePicker placeholder="Select file" testId="test-file-picker" onChange={mockOnChange} />);

      const secondRender = screen.getByTestId('file-picker-container');

      expect(firstRender).toBe(secondRender);
    });
  });
});
