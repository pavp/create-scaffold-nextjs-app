import { useForm } from 'react-hook-form';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TextField } from './text-field.component';

// Mock next-intl more efficiently
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => (key === 'textField.validate.required' ? 'This field is required' : key),
}));

interface TestFormData {
  testTextField: string;
}

const TestControlledComponent = ({ errorMessage, required }: { errorMessage?: string; required?: boolean }) => {
  const { control } = useForm<TestFormData>({
    defaultValues: { testTextField: '' },
  });

  return (
    <TextField
      control={control}
      errorMessage={errorMessage}
      label="Test TextField"
      name="testTextField"
      placeholder="Enter text"
      required={required}
      testId="controlled-textfield"
    />
  );
};

describe('TextField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Uncontrolled mode', () => {
    it('should render textfield with basic props', () => {
      render(<TextField label="Basic TextField" placeholder="Enter your text" testId="test-textfield" />);

      const textfield = screen.getByTestId('test-textfield');
      const input = screen.getByTestId('test-textfield-input');

      expect(textfield).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter your text');
    });

    it('should render with default value', () => {
      render(<TextField defaultValue="Initial text" label="TextField with default" testId="test-textfield" />);

      const input = screen.getByTestId('test-textfield-input');

      expect(input).toHaveValue('Initial text');
    });

    it('should call onChange when text is entered', () => {
      const mockOnChange = jest.fn();

      render(<TextField placeholder="Type here" testId="test-textfield" onChange={mockOnChange} />);

      const input = screen.getByTestId('test-textfield-input');

      fireEvent.change(input, { target: { value: 'New text' } });

      expect(mockOnChange).toHaveBeenCalledWith('New text');
    });

    it('should render with different input types', () => {
      render(<TextField placeholder="Number field" testId="test-textfield" type="number" />);

      const input = screen.getByTestId('test-textfield-input');

      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render as multiline textarea', () => {
      render(<TextField multiline placeholder="Multiline text" rows={4} testId="test-textfield" />);

      const textfield = screen.getByTestId('test-textfield');

      expect(textfield).toBeInTheDocument();
    });

    it('should render with max length', () => {
      render(<TextField maxLength={50} placeholder="Limited text" testId="test-textfield" />);

      const input = screen.getByTestId('test-textfield-input');

      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('should render as disabled', () => {
      render(<TextField disabled placeholder="Disabled text" testId="test-textfield" />);

      const input = screen.getByTestId('test-textfield-input');

      expect(input).toBeDisabled();
    });

    it('should render as readonly', () => {
      render(<TextField readonly placeholder="Readonly text" testId="test-textfield" />);

      const input = screen.getByTestId('test-textfield-input');

      expect(input).toHaveAttribute('readOnly');
    });

    it('should render as required', () => {
      render(<TextField required placeholder="Required text" testId="test-textfield" />);

      const input = screen.getByTestId('test-textfield-input');

      expect(input).toBeRequired();
    });

    it('should render with full width', () => {
      render(<TextField fullWidth placeholder="Full width text" testId="test-textfield" />);

      const textfield = screen.getByTestId('test-textfield');

      expect(textfield).toBeInTheDocument();
    });

    it('should render with custom width', () => {
      render(<TextField placeholder="Custom width text" testId="test-textfield" width="300px" />);

      const textfield = screen.getByTestId('test-textfield');

      expect(textfield).toBeInTheDocument();
    });

    it('should render with start and end adornments', () => {
      const startAdornment = <span data-testid="start-adornment">@</span>;
      const endAdornment = <span data-testid="end-adornment">.com</span>;

      render(
        <TextField
          endAdornment={endAdornment}
          placeholder="With adornments"
          startAdornment={startAdornment}
          testId="test-textfield"
        />,
      );

      expect(screen.getByTestId('start-adornment')).toBeInTheDocument();
      expect(screen.getByTestId('end-adornment')).toBeInTheDocument();
    });

    it('should render with custom input mode', () => {
      render(<TextField inputMode="numeric" placeholder="Numeric input" testId="test-textfield" />);

      const input = screen.getByTestId('test-textfield-input');

      expect(input).toHaveAttribute('inputMode', 'numeric');
    });

    it('should update value when defaultValue changes', async () => {
      const { rerender } = render(
        <TextField defaultValue="Initial" placeholder="Dynamic default" testId="test-textfield" />,
      );

      let input = screen.getByTestId('test-textfield-input');

      expect(input).toHaveValue('Initial');

      rerender(<TextField defaultValue="Updated" placeholder="Dynamic default" testId="test-textfield" />);

      input = screen.getByTestId('test-textfield-input');

      await waitFor(() => {
        expect(input).toHaveValue('Updated');
      });
    });
  });

  describe('Controlled mode', () => {
    it('should render with react-hook-form control', () => {
      render(<TestControlledComponent />);

      expect(screen.getByTestId('controlled-textfield')).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(<TestControlledComponent errorMessage="This field has an error" />);

      expect(screen.getByText('This field has an error')).toBeInTheDocument();
    });

    it('should validate required field with react-hook-form', () => {
      render(<TestControlledComponent required />);

      const input = screen.getByTestId('controlled-textfield-input');

      expect(input).toBeRequired();
    });

    it('should work with react-hook-form controller', () => {
      render(<TestControlledComponent />);

      const input = screen.getByTestId('controlled-textfield-input');

      fireEvent.change(input, { target: { value: 'Test input' } });

      expect(input).toHaveValue('Test input');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom className', () => {
      render(<TextField className="custom-textfield" placeholder="Styled textfield" testId="test-textfield" />);

      const textfield = screen.getByTestId('test-textfield');

      expect(textfield).toHaveClass('custom-textfield');
    });

    it('should apply custom styles', () => {
      const customStyles = { backgroundColor: 'lightblue' };

      render(<TextField placeholder="Styled textfield" styles={customStyles} testId="test-textfield" />);

      const textfield = screen.getByTestId('test-textfield');

      expect(textfield).toBeInTheDocument();
    });

    it('should render with label placement', () => {
      render(<TextField label="Field Label" placeholder="Labeled field" testId="test-textfield" />);

      expect(screen.getByText('Field Label')).toBeInTheDocument();
    });

    it('should handle numeric width', () => {
      render(<TextField placeholder="Numeric width" testId="test-textfield" width={400} />);

      const textfield = screen.getByTestId('test-textfield');

      expect(textfield).toBeInTheDocument();
    });
  });

  describe('Multiline mode', () => {
    it('should render with min and max rows', () => {
      render(
        <TextField multiline maxRows={6} minRows={2} placeholder="Auto-expanding textarea" testId="test-textfield" />,
      );

      const textfield = screen.getByTestId('test-textfield');

      expect(textfield).toBeInTheDocument();
    });

    it('should render with fixed rows', () => {
      render(<TextField multiline placeholder="Fixed textarea" rows={5} testId="test-textfield" />);

      const textfield = screen.getByTestId('test-textfield');

      expect(textfield).toBeInTheDocument();
    });
  });

  describe('Form integration', () => {
    it('should render within FormGroup', () => {
      const { container } = render(<TextField placeholder="Form textfield" testId="test-textfield" />);

      const formGroup = container.querySelector('.MuiFormGroup-root');

      expect(formGroup).toBeInTheDocument();
    });

    it('should show error state', () => {
      render(<TextField errorMessage="Field error" placeholder="Error textfield" testId="test-textfield" />);

      expect(screen.getByText('Field error')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(<TextField placeholder="Test" testId="test-textfield" />);

      const firstRender = screen.getByTestId('test-textfield');

      rerender(<TextField placeholder="Test" testId="test-textfield" />);

      const secondRender = screen.getByTestId('test-textfield');

      expect(firstRender).toBe(secondRender);
    });
  });
});
