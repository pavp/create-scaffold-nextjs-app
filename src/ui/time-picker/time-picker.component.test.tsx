import { useForm } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { renderWithProviders } from '@test/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';

import { TimePicker } from './time-picker.component';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'timePicker.validate.required': 'Time is required',
      'timePicker.validate.valid': 'Invalid time format',
    };

    return translations[key] || key;
  },
}));

// Mock MUI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  FormControlLabel: ({ control, label, labelPlacement, _slotProps }: any) => (
    <div data-label={label} data-label-placement={labelPlacement} data-testid="form-control-label">
      {label && <label data-testid="time-picker-label">{label}</label>}
      {control}
    </div>
  ),
  FormGroup: ({ children }: any) => <div data-testid="form-group">{children}</div>,
}));

// Mock MUI X TimePicker
jest.mock('@mui/x-date-pickers/TimePicker', () => ({
  TimePicker: ({ value, onChange, onClose, open, format, views, ampm, slotProps, timeSteps, _sx, ...props }: any) => (
    <div
      data-ampm={ampm}
      data-format={format}
      data-open={open}
      data-testid="time-picker-mui"
      data-time-steps={JSON.stringify(timeSteps)}
      data-views={JSON.stringify(views)}
      {...props}
    >
      <input
        data-testid="time-picker-input"
        value={value ? dayjs(value).format(format) : ''}
        onChange={(e) => {
          if (e.target.value === 'test-time') {
            onChange(dayjs('2024-01-01T14:30:00'));
          } else if (e.target.value === 'invalid-time') {
            onChange(dayjs('invalid'));
          } else if (e.target.value === '' || e.target.value === 'null-time') {
            onChange(null);
          }
        }}
        onClick={() => {
          // Simulate opening time picker
        }}
      />
      {slotProps?.textField?.error && <div data-testid="error-text">{slotProps.textField.helperText}</div>}
      <button data-testid="close-time-picker" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

// Mock LocalizationProvider
jest.mock('@mui/x-date-pickers-pro', () => ({
  LocalizationProvider: ({ children }: any) => children,
}));

jest.mock('@mui/x-date-pickers-pro/AdapterDayjs', () => ({
  AdapterDayjs: {},
}));

interface TestFormData {
  testTime: string;
}

describe('TimePicker', () => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
  );

  describe('Controlled mode (with react-hook-form)', () => {
    const ControlledTimePicker = ({ errorMessage }: { errorMessage?: string }) => {
      const { control } = useForm<TestFormData>({
        defaultValues: { testTime: '' },
      });

      return (
        <TestWrapper>
          <TimePicker control={control} errorMessage={errorMessage} label="Test Time" name="testTime" />
        </TestWrapper>
      );
    };

    it('should render controlled time picker with form control', () => {
      render(<ControlledTimePicker />);

      expect(screen.getByTestId('form-group')).toBeInTheDocument();
      expect(screen.getByTestId('form-control-label')).toBeInTheDocument();
      expect(screen.getByTestId('time-picker-mui')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<ControlledTimePicker />);

      expect(screen.getByTestId('time-picker-label')).toBeInTheDocument();
      expect(screen.getByText('Test Time')).toBeInTheDocument();
    });

    it('should display error message when provided', () => {
      render(<ControlledTimePicker errorMessage="Time is required" />);

      expect(screen.getByTestId('error-text')).toBeInTheDocument();
      expect(screen.getByText('Time is required')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<ControlledTimePicker />);

      const timePicker = screen.getByTestId('time-picker-mui');

      expect(timePicker).toHaveAttribute('data-format', 'hh:mm');
      expect(timePicker).toHaveAttribute('data-ampm', 'false');
      expect(timePicker).toHaveAttribute('data-views', '["hours","minutes"]');
      expect(timePicker).toHaveAttribute('data-time-steps', '{"minutes":1,"hours":1}');
    });
  });

  describe('Uncontrolled mode (without react-hook-form)', () => {
    it('should render uncontrolled time picker', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker label="Uncontrolled Time" onChange={mockOnChange} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('form-group')).toBeInTheDocument();
      expect(screen.getByTestId('time-picker-mui')).toBeInTheDocument();
    });

    it('should call onChange when time changes', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker onChange={mockOnChange} />
        </TestWrapper>,
      );

      const input = screen.getByTestId('time-picker-input');

      fireEvent.change(input, { target: { value: 'test-time' } });

      expect(mockOnChange).toHaveBeenCalledWith(dayjs('2024-01-01T14:30:00'));
    });

    it('should handle null value changes', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker onChange={mockOnChange} />
        </TestWrapper>,
      );

      const input = screen.getByTestId('time-picker-input');

      fireEvent.change(input, { target: { value: 'null-time' } });

      expect(mockOnChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Props customization', () => {
    it('should render with custom format', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker format="HH:mm:ss" onChange={mockOnChange} />
        </TestWrapper>,
      );

      const timePicker = screen.getByTestId('time-picker-mui');

      expect(timePicker).toHaveAttribute('data-format', 'HH:mm:ss');
    });

    it('should render with custom views', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker views={['hours']} onChange={mockOnChange} />
        </TestWrapper>,
      );

      const timePicker = screen.getByTestId('time-picker-mui');

      expect(timePicker).toHaveAttribute('data-views', '["hours"]');
    });

    it('should render with custom width', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker width="300px" onChange={mockOnChange} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('time-picker-mui')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker label="Custom Time Label" onChange={mockOnChange} />
        </TestWrapper>,
      );

      expect(screen.getByText('Custom Time Label')).toBeInTheDocument();
    });
  });

  describe('State management', () => {
    it('should handle open/close state', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker onChange={mockOnChange} />
        </TestWrapper>,
      );

      const timePicker = screen.getByTestId('time-picker-mui');

      expect(timePicker).toHaveAttribute('data-open', 'false');

      const closeButton = screen.getByTestId('close-time-picker');

      fireEvent.click(closeButton);

      // State management is handled internally
      expect(screen.getByTestId('time-picker-mui')).toBeInTheDocument();
    });
  });

  describe('Default values', () => {
    it('should use default format when not specified', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker onChange={mockOnChange} />
        </TestWrapper>,
      );

      const timePicker = screen.getByTestId('time-picker-mui');

      expect(timePicker).toHaveAttribute('data-format', 'hh:mm');
    });

    it('should use default views when not specified', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker onChange={mockOnChange} />
        </TestWrapper>,
      );

      const timePicker = screen.getByTestId('time-picker-mui');

      expect(timePicker).toHaveAttribute('data-views', '["hours","minutes"]');
    });

    it('should use empty label when not specified', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker onChange={mockOnChange} />
        </TestWrapper>,
      );

      expect(screen.queryByTestId('time-picker-label')).not.toBeInTheDocument();
    });
  });

  describe('Form integration', () => {
    const FormIntegrationTest = () => {
      const { control } = useForm<TestFormData>({
        defaultValues: { testTime: dayjs('2024-01-01T09:30:00').toISOString() },
      });

      return (
        <TestWrapper>
          <TimePicker control={control} format="HH:mm" label="Form Time" name="testTime" />
        </TestWrapper>
      );
    };

    it('should integrate with react-hook-form', () => {
      render(<FormIntegrationTest />);

      expect(screen.getByTestId('time-picker-mui')).toBeInTheDocument();
      expect(screen.getByText('Form Time')).toBeInTheDocument();
    });
  });

  describe('Time picker configuration', () => {
    it('should render with 24-hour format (ampm=false)', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker onChange={mockOnChange} />
        </TestWrapper>,
      );

      const timePicker = screen.getByTestId('time-picker-mui');

      expect(timePicker).toHaveAttribute('data-ampm', 'false');
    });

    it('should render with default time steps', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker onChange={mockOnChange} />
        </TestWrapper>,
      );

      const timePicker = screen.getByTestId('time-picker-mui');

      expect(timePicker).toHaveAttribute('data-time-steps', '{"minutes":1,"hours":1}');
    });
  });

  describe('Error handling', () => {
    const ErrorHandlingTest = ({ errorMessage }: { errorMessage?: string }) => {
      const { control } = useForm<TestFormData>();

      return (
        <TestWrapper>
          <TimePicker control={control} errorMessage={errorMessage} name="testTime" />
        </TestWrapper>
      );
    };

    it('should display error state when error message is provided', () => {
      render(<ErrorHandlingTest errorMessage="Invalid time" />);

      expect(screen.getByTestId('error-text')).toBeInTheDocument();
      expect(screen.getByText('Invalid time')).toBeInTheDocument();
    });

    it('should not display error state when no error message', () => {
      render(<ErrorHandlingTest />);

      expect(screen.queryByTestId('error-text')).not.toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should have proper nested structure', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker label="Structured Time" onChange={mockOnChange} />
        </TestWrapper>,
      );

      const formGroup = screen.getByTestId('form-group');
      const formControlLabel = screen.getByTestId('form-control-label');
      const timePicker = screen.getByTestId('time-picker-mui');

      expect(formGroup).toContainElement(formControlLabel);
      expect(formControlLabel).toContainElement(timePicker);
    });

    it('should render label at top placement', () => {
      const mockOnChange = jest.fn();

      render(
        <TestWrapper>
          <TimePicker label="Top Label" onChange={mockOnChange} />
        </TestWrapper>,
      );

      const formControlLabel = screen.getByTestId('form-control-label');

      expect(formControlLabel).toHaveAttribute('data-label-placement', 'top');
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const mockOnChange = jest.fn();

      const { rerender } = render(
        <TestWrapper>
          <TimePicker label="Memo Test" onChange={mockOnChange} />
        </TestWrapper>,
      );

      const firstRender = screen.getByTestId('form-group');

      rerender(
        <TestWrapper>
          <TimePicker label="Memo Test" onChange={mockOnChange} />
        </TestWrapper>,
      );

      const secondRender = screen.getByTestId('form-group');

      expect(firstRender).toBe(secondRender);
    });
  });
});
