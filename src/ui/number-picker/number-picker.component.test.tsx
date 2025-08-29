import { useForm } from 'react-hook-form';
import { fireEvent, render, screen } from '@testing-library/react';

import { NumberPicker } from './number-picker.component';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, options?: any) => {
    const translations: Record<string, string> = {
      'numberPicker.validate.required': 'This field is required',
      'numberPicker.validate.valid': 'Please enter a valid number',
      'numberPicker.validate.min': `Minimum value is ${options?.min}`,
      'numberPicker.validate.max': `Maximum value is ${options?.max}`,
    };

    return translations[key] || key;
  },
}));

interface TestFormData {
  testNumber: number;
}

const TestControlledComponent = ({
  errorMessage,
  required,
  min,
  max,
}: {
  errorMessage?: string;
  required?: boolean;
  min?: number;
  max?: number;
}) => {
  const { control } = useForm<TestFormData>({
    defaultValues: { testNumber: 0 },
  });

  return (
    <NumberPicker
      control={control}
      errorMessage={errorMessage}
      label="Test Number"
      max={max}
      min={min}
      name="testNumber"
      placeholder="Enter number"
      required={required}
      testId="controlled-number-picker"
    />
  );
};

describe('NumberPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Uncontrolled mode', () => {
    it('should render number picker with basic props', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker
          defaultValue=""
          label="Basic Number"
          placeholder="Enter number"
          testId="test-number-picker"
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('placeholder', 'Enter number');
    });

    it('should render with default value', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker
          defaultValue={42}
          label="Number with default"
          testId="test-number-picker"
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      expect(input).toHaveValue(42);
    });

    it('should call onChange when number is entered', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker defaultValue="" placeholder="Type number" testId="test-number-picker" onChange={mockOnChange} />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      fireEvent.change(input, { target: { value: '123' } });

      expect(mockOnChange).toHaveBeenCalledWith(123);
    });

    it('should not call onChange for empty value', () => {
      const mockOnChange = jest.fn();

      render(<NumberPicker defaultValue="" testId="test-number-picker" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-number-picker-input');

      fireEvent.change(input, { target: { value: '' } });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should render with min and max constraints', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker
          max={100}
          min={1}
          placeholder="Constrained number"
          testId="test-number-picker"
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '100');
    });

    it('should respect min value constraint', () => {
      const mockOnChange = jest.fn();

      render(<NumberPicker defaultValue="" min={10} testId="test-number-picker" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-number-picker-input');

      fireEvent.change(input, { target: { value: '5' } });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should respect max value constraint', () => {
      const mockOnChange = jest.fn();

      render(<NumberPicker defaultValue="" max={10} testId="test-number-picker" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-number-picker-input');

      fireEvent.change(input, { target: { value: '15' } });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should render with step attribute', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker placeholder="Stepped number" step="0.5" testId="test-number-picker" onChange={mockOnChange} />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      expect(input).toHaveAttribute('step', '0.5');
    });

    it('should render as disabled', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker disabled placeholder="Disabled number" testId="test-number-picker" onChange={mockOnChange} />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      expect(input).toBeDisabled();
    });

    it('should render as required', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker required placeholder="Required number" testId="test-number-picker" onChange={mockOnChange} />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      expect(input).toBeRequired();
    });

    it('should render with custom width', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker
          placeholder="Custom width number"
          testId="test-number-picker"
          width="300px"
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      expect(input).toBeInTheDocument();
    });

    it('should render with label', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker
          label="Number Label"
          placeholder="Labeled number"
          testId="test-number-picker"
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Number Label')).toBeInTheDocument();
    });
  });

  describe('Controlled mode', () => {
    it('should render with react-hook-form control', () => {
      render(<TestControlledComponent />);

      expect(screen.getByTestId('controlled-number-picker')).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(<TestControlledComponent errorMessage="This field has an error" />);

      expect(screen.getByText('This field has an error')).toBeInTheDocument();
    });

    it('should work with react-hook-form controller', () => {
      render(<TestControlledComponent />);

      const input = screen.getByTestId('controlled-number-picker-input');

      fireEvent.change(input, { target: { value: '456' } });

      expect(input).toHaveValue(456);
    });

    it('should validate required field', () => {
      render(<TestControlledComponent required />);

      const input = screen.getByTestId('controlled-number-picker-input');

      expect(input).toBeRequired();
    });

    it('should validate min and max constraints', () => {
      render(<TestControlledComponent max={15} min={5} />);

      const input = screen.getByTestId('controlled-number-picker-input');

      expect(input).toHaveAttribute('min', '5');
      expect(input).toHaveAttribute('max', '15');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom textField style', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker
          placeholder="Styled number picker"
          testId="test-number-picker"
          textFieldStyle="custom-textfield-style"
          onChange={mockOnChange}
        />,
      );

      const textfield = screen.getByTestId('test-number-picker');

      expect(textfield).toHaveClass('custom-textfield-style');
    });

    it('should render with label placement', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker
          label="Top Label"
          placeholder="Placed label"
          testId="test-number-picker"
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Top Label')).toBeInTheDocument();
    });

    it('should handle numeric width', () => {
      const mockOnChange = jest.fn();

      render(
        <NumberPicker placeholder="Numeric width" testId="test-number-picker" width={250} onChange={mockOnChange} />,
      );

      const input = screen.getByTestId('test-number-picker-input');

      expect(input).toBeInTheDocument();
    });
  });

  describe('Form integration', () => {
    it('should render within FormGroup', () => {
      const mockOnChange = jest.fn();

      const { container } = render(
        <NumberPicker placeholder="Form number picker" testId="test-number-picker" onChange={mockOnChange} />,
      );

      const formGroup = container.querySelector('.MuiFormGroup-root');

      expect(formGroup).toBeInTheDocument();
    });

    it('should show error state', () => {
      render(<TestControlledComponent errorMessage="Field error" />);

      expect(screen.getByText('Field error')).toBeInTheDocument();
    });
  });

  describe('Value handling', () => {
    it('should handle valid number input', () => {
      const mockOnChange = jest.fn();

      render(<NumberPicker defaultValue="" testId="test-number-picker" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-number-picker-input');

      fireEvent.change(input, { target: { value: '789' } });

      expect(mockOnChange).toHaveBeenCalledWith(789);
    });

    it('should accept zero as valid value', () => {
      const mockOnChange = jest.fn();

      render(<NumberPicker defaultValue="" testId="test-number-picker" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-number-picker-input');

      fireEvent.change(input, { target: { value: '0' } });

      expect(mockOnChange).toHaveBeenCalledWith(0);
    });

    it('should accept negative numbers when min allows', () => {
      const mockOnChange = jest.fn();

      render(<NumberPicker defaultValue="" min={-100} testId="test-number-picker" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-number-picker-input');

      fireEvent.change(input, { target: { value: '-50' } });

      expect(mockOnChange).toHaveBeenCalledWith(-50);
    });

    it('should accept decimal numbers when step allows', () => {
      const mockOnChange = jest.fn();

      render(<NumberPicker defaultValue="" step="0.1" testId="test-number-picker" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-number-picker-input');

      fireEvent.change(input, { target: { value: '12.5' } });

      expect(mockOnChange).toHaveBeenCalledWith(12.5);
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const mockOnChange = jest.fn();

      const { rerender } = render(
        <NumberPicker defaultValue="" placeholder="Test" testId="test-number-picker" onChange={mockOnChange} />,
      );

      const firstRender = screen.getByTestId('test-number-picker');

      rerender(<NumberPicker defaultValue="" placeholder="Test" testId="test-number-picker" onChange={mockOnChange} />);

      const secondRender = screen.getByTestId('test-number-picker');

      expect(firstRender).toBe(secondRender);
    });
  });
});
