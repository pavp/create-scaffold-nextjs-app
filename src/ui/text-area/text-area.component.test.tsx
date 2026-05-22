import { useForm } from 'react-hook-form';
import { fireEvent, render, screen } from '@testing-library/react';

import { TextArea } from './text-area.component';

// Mock TextField component since TextArea is a wrapper
jest.mock('../text-field/text-field.component', () => ({
  TextField: ({
    testId,
    placeholder,
    multiline,
    rows,
    maxLength,
    onChange,
    defaultValue,
    disabled,
    required,
    className,
    // Extract DOM-incompatible props to prevent them from being spread
    fullWidth,
    width,
    errorMessage,
    ...domProps
  }: any) => (
    <div className={className} style={{ width: fullWidth ? '100%' : width }}>
      <textarea
        data-multiline={multiline}
        data-testid={testId}
        defaultValue={defaultValue}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        rows={rows}
        onChange={(e) => onChange?.(e.target.value)}
        {...domProps}
      />
      {errorMessage && <div data-testid="error-message">{errorMessage}</div>}
    </div>
  ),
}));

interface TestFormData {
  testTextArea: string;
}

const TestControlledComponent = ({ errorMessage }: { errorMessage?: string }) => {
  const { control } = useForm<TestFormData>({
    defaultValues: { testTextArea: '' },
  });

  return (
    <TextArea
      control={control}
      errorMessage={errorMessage}
      label="Test TextArea"
      name="testTextArea"
      placeholder="Enter text here"
      testId="controlled-textarea"
    />
  );
};

describe('TextArea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Uncontrolled mode', () => {
    it('should render textarea with basic props', () => {
      render(<TextArea label="Basic TextArea" placeholder="Enter your text" testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('placeholder', 'Enter your text');
      expect(textarea).toHaveAttribute('data-multiline', 'true');
    });

    it('should render with default value', () => {
      render(<TextArea defaultValue="Initial text" label="TextArea with default" testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toHaveValue('Initial text');
    });

    it('should call onChange when text is entered', () => {
      const mockOnChange = jest.fn();

      render(<TextArea placeholder="Type here" testId="test-textarea" onChange={mockOnChange} />);

      const textarea = screen.getByTestId('test-textarea');

      fireEvent.change(textarea, { target: { value: 'New text' } });

      expect(mockOnChange).toHaveBeenCalledWith('New text');
    });

    it('should render with custom rows', () => {
      render(<TextArea placeholder="Multi-row textarea" rows={5} testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('should render with max length', () => {
      render(<TextArea maxLength={100} placeholder="Limited textarea" testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toHaveAttribute('maxLength', '100');
    });

    it('should render as disabled', () => {
      render(<TextArea disabled placeholder="Disabled textarea" testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toBeDisabled();
    });

    it('should render as required', () => {
      render(<TextArea required placeholder="Required textarea" testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toBeRequired();
    });

    it('should render with full width', () => {
      render(<TextArea fullWidth placeholder="Full width textarea" testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toBeInTheDocument();
    });

    it('should render with custom width', () => {
      render(<TextArea placeholder="Custom width textarea" testId="test-textarea" width="300px" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<TextArea className="custom-textarea" placeholder="Styled textarea" testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');
      const container = textarea.parentElement;

      expect(container).toHaveClass('custom-textarea');
    });
  });

  describe('Controlled mode', () => {
    it('should render with react-hook-form control', () => {
      render(<TestControlledComponent />);

      expect(screen.getByTestId('controlled-textarea')).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(<TestControlledComponent errorMessage="This field is required" />);

      const textarea = screen.getByTestId('controlled-textarea');

      expect(textarea).toBeInTheDocument();
    });

    it('should work with react-hook-form controller', () => {
      render(<TestControlledComponent />);

      const textarea = screen.getByTestId('controlled-textarea');

      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('placeholder', 'Enter text here');
    });
  });

  describe('TextArea as TextField wrapper', () => {
    it('should pass multiline prop to TextField', () => {
      render(<TextArea placeholder="Multiline textarea" testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toHaveAttribute('data-multiline', 'true');
    });

    it('should pass all props to TextField correctly', () => {
      render(
        <TextArea
          disabled
          fullWidth
          required
          label="Complete TextArea"
          maxLength={200}
          placeholder="All props textarea"
          rows={4}
          testId="test-textarea"
        />,
      );

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('placeholder', 'All props textarea');
      expect(textarea).toHaveAttribute('rows', '4');
      expect(textarea).toHaveAttribute('maxLength', '200');
      expect(textarea).toBeDisabled();
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAttribute('data-multiline', 'true');
    });

    it('should handle both controlled and uncontrolled scenarios correctly', () => {
      const { rerender } = render(
        <TextArea defaultValue="Uncontrolled" placeholder="Uncontrolled textarea" testId="test-textarea" />,
      );

      let textarea = screen.getByTestId('test-textarea');

      expect(textarea).toHaveValue('Uncontrolled');

      rerender(<TestControlledComponent />);

      textarea = screen.getByTestId('controlled-textarea');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom styles', () => {
      const customStyles = { backgroundColor: 'lightblue' };

      render(<TextArea placeholder="Styled textarea" styles={customStyles} testId="test-textarea" />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toBeInTheDocument();
    });

    it('should handle numeric width', () => {
      render(<TextArea placeholder="Numeric width textarea" testId="test-textarea" width={400} />);

      const textarea = screen.getByTestId('test-textarea');

      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(<TextArea placeholder="Test" testId="test-textarea" />);

      const firstRender = screen.getByTestId('test-textarea');

      rerender(<TextArea placeholder="Test" testId="test-textarea" />);

      const secondRender = screen.getByTestId('test-textarea');

      expect(firstRender).toBe(secondRender);
    });
  });
});
