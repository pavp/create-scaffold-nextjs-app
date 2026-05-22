import { useForm } from 'react-hook-form';
import { fireEvent, render, screen } from '@testing-library/react';

import { RadioButton } from './radio-button.component';

interface TestFormData {
  testRadio: boolean;
}

const TestControlledComponent = () => {
  const { control } = useForm<TestFormData>({
    defaultValues: { testRadio: false },
  });

  return <RadioButton control={control} label="Controlled Radio" name="testRadio" />;
};

describe('RadioButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Uncontrolled mode', () => {
    it('should render radio button with label', () => {
      render(<RadioButton label="Test Radio" value={false} onChange={() => {}} />);

      expect(screen.getByLabelText('Test Radio')).toBeInTheDocument();
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('should render as unchecked by default', () => {
      render(<RadioButton label="Unchecked Radio" value={false} onChange={() => {}} />);

      const radio = screen.getByRole('radio');

      expect(radio).not.toBeChecked();
    });

    it('should render as checked when value is true', () => {
      render(<RadioButton value label="Checked Radio" onChange={() => {}} />);

      const radio = screen.getByRole('radio');

      expect(radio).toBeChecked();
    });

    it('should call onChange when clicked', () => {
      const mockOnChange = jest.fn();

      render(<RadioButton label="Clickable Radio" value={false} onChange={mockOnChange} />);

      const radioLabel = screen.getByLabelText('Clickable Radio');

      fireEvent.click(radioLabel);

      expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it('should toggle from checked to unchecked when clicked', () => {
      const mockOnChange = jest.fn();

      render(<RadioButton value label="Toggle Radio" onChange={mockOnChange} />);

      const radioLabel = screen.getByLabelText('Toggle Radio');

      fireEvent.click(radioLabel);

      expect(mockOnChange).toHaveBeenCalledWith(false);
    });

    it('should render with default label placement', () => {
      render(<RadioButton label="Default Placement" value={false} onChange={() => {}} />);

      const formControlLabel = screen.getByLabelText('Default Placement').closest('.MuiFormControlLabel-root');

      expect(formControlLabel).toHaveClass('MuiFormControlLabel-labelPlacementBottom');
    });

    it('should render with custom label placement', () => {
      render(<RadioButton label="Top Placement" labelPlacement="top" value={false} onChange={() => {}} />);

      const formControlLabel = screen.getByLabelText('Top Placement').closest('.MuiFormControlLabel-root');

      expect(formControlLabel).toHaveClass('MuiFormControlLabel-labelPlacementTop');
    });

    it('should render with different sizes', () => {
      render(<RadioButton label="Large Radio" size="medium" value={false} onChange={() => {}} />);

      const radio = screen.getByRole('radio');

      expect(radio).toBeInTheDocument();
    });

    it('should render with different colors', () => {
      render(<RadioButton color="secondary" label="Secondary Radio" value={false} onChange={() => {}} />);

      const radio = screen.getByRole('radio');

      expect(radio).toBeInTheDocument();
    });

    it('should render as disabled', () => {
      render(<RadioButton disabled label="Disabled Radio" value={false} onChange={() => {}} />);

      const radio = screen.getByRole('radio');

      expect(radio).toBeDisabled();
    });

    it('should render without label when not provided', () => {
      render(<RadioButton value={false} onChange={() => {}} />);

      const radio = screen.getByRole('radio');

      expect(radio).toBeInTheDocument();
    });
  });

  describe('Controlled mode', () => {
    it('should render with react-hook-form control', () => {
      render(<TestControlledComponent />);

      expect(screen.getByLabelText('Controlled Radio')).toBeInTheDocument();
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('should work with react-hook-form', () => {
      render(<TestControlledComponent />);

      const radio = screen.getByRole('radio');

      expect(radio).not.toBeChecked();

      fireEvent.click(screen.getByLabelText('Controlled Radio'));

      expect(radio).toBeChecked();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply custom styles to label', () => {
      const { container } = render(<RadioButton label="Styled Radio" value={false} onChange={() => {}} />);

      const label = container.querySelector('.MuiFormControlLabel-label');

      expect(label).toBeInTheDocument();
    });

    it('should apply margin styles to FormControlLabel', () => {
      const { container } = render(<RadioButton label="Margin Radio" value={false} onChange={() => {}} />);

      const formControlLabel = container.querySelector('.MuiFormControlLabel-root');

      expect(formControlLabel).toHaveStyle({
        marginTop: '-8px',
      });
    });

    it('should render within FormControl', () => {
      const { container } = render(<RadioButton label="Form Control Radio" value={false} onChange={() => {}} />);

      const formControl = container.querySelector('.MuiFormControl-root');

      expect(formControl).toBeInTheDocument();
    });
  });

  describe('Props passing', () => {
    it('should pass additional props to FormControlLabel', () => {
      render(<RadioButton data-testid="custom-radio" label="Props Radio" value={false} onChange={() => {}} />);

      const formControlLabel = screen.getByTestId('custom-radio');

      expect(formControlLabel).toBeInTheDocument();
    });
  });
});
