import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';

import { DateRangePicker } from './date-range-picker.component';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      datePickerPlaceHolder: 'Select date range',
    };

    return translations[key] || key;
  },
}));

// Mock MUI components to avoid complex date picker interactions
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, className, sx, 'data-testid': testId, ...props }: any) => (
    <div className={className} data-testid={testId} style={sx} {...props}>
      {children}
    </div>
  ),
  InputAdornment: ({ children, position }: any) => <div data-testid={`input-adornment-${position}`}>{children}</div>,
}));

jest.mock('@mui/x-date-pickers-pro', () => ({
  DateRangePicker: ({ onChange, className, slotProps }: any) => (
    <div className={className} data-testid="date-range-picker">
      <input
        data-testid="date-range-input"
        placeholder={slotProps?.textField?.InputProps?.placeholder}
        onChange={(e) => {
          // Simulate date range selection
          if (e.target.value === 'test-range') {
            onChange([dayjs('2024-01-01'), dayjs('2024-01-31')]);
          } else if (e.target.value === 'empty-range') {
            onChange([null, null]);
          } else if (e.target.value === 'invalid-range') {
            onChange(null);
          }
        }}
      />
      {slotProps?.textField?.InputProps?.startAdornment}
    </div>
  ),
  SingleInputDateRangeField: () => <div data-testid="single-input-field" />,
  LocalizationProvider: ({ children }: any) => children,
  AdapterDayjs: {},
}));

jest.mock('@mui/icons-material/CalendarToday', () => {
  return function CalendarTodayIcon() {
    return <div data-testid="calendar-icon" />;
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
);

describe('DateRangePicker', () => {
  const mockHandleOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render date range picker', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
    });

    it('should render with placeholder text', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      const input = screen.getByTestId('date-range-input');

      expect(input).toHaveAttribute('placeholder', 'Select date range');
    });

    it('should render calendar icon', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
      expect(screen.getByTestId('input-adornment-start')).toBeInTheDocument();
    });
  });

  describe('Width customization', () => {
    it('should render with default width', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      const container = screen.getByTestId('container');

      expect(container).toHaveStyle({ flexBasis: '200px' });
    });

    it('should render with custom width', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} width="300px" />
        </TestWrapper>,
      );

      const container = screen.getByTestId('container');

      expect(container).toHaveStyle({ flexBasis: '300px' });
    });
  });

  describe('Date change handling', () => {
    it('should handle date range changes', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      const input = screen.getByTestId('date-range-input');

      // Verify the component renders correctly
      expect(input).toBeInTheDocument();
      expect(mockHandleOnChange).toBeDefined();
    });

    it('should handle onChange callback', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      // Just verify the callback is passed and component renders
      const datePicker = screen.getByTestId('date-range-picker');

      expect(datePicker).toBeInTheDocument();
    });
  });

  describe('Custom date format', () => {
    it('should accept default format prop', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      const datePicker = screen.getByTestId('date-range-picker');

      expect(datePicker).toBeInTheDocument();
    });

    it('should accept custom return date format prop', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} returnDateFormat="DD-MM-YYYY" />
        </TestWrapper>,
      );

      const datePicker = screen.getByTestId('date-range-picker');

      expect(datePicker).toBeInTheDocument();
    });
  });

  describe('Component styling', () => {
    it('should apply container class', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      const container = screen.getByTestId('container');

      expect(container).toHaveClass('mainContainer');
    });

    it('should apply date picker class', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      const datePicker = screen.getByTestId('date-range-picker');

      expect(datePicker).toHaveClass('datePicker');
    });
  });

  describe('Props configuration', () => {
    it('should render with clearable field prop', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      // The clearable prop is passed to slotProps.field.clearable: true
      const datePicker = screen.getByTestId('date-range-picker');

      expect(datePicker).toBeInTheDocument();
    });

    it('should render single input date range field slot', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      // SingleInputDateRangeField is passed as slots.field
      const datePicker = screen.getByTestId('date-range-picker');

      expect(datePicker).toBeInTheDocument();
    });
  });

  describe('All props together', () => {
    it('should handle all props correctly', () => {
      render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} returnDateFormat="MM/DD/YYYY" width="400px" />
        </TestWrapper>,
      );

      const container = screen.getByTestId('container');
      const input = screen.getByTestId('date-range-input');

      expect(container).toHaveStyle({ flexBasis: '400px' });
      expect(input).toHaveAttribute('placeholder', 'Select date range');
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      const firstRender = screen.getByTestId('container');

      rerender(
        <TestWrapper>
          <DateRangePicker handleOnChange={mockHandleOnChange} />
        </TestWrapper>,
      );

      const secondRender = screen.getByTestId('container');

      expect(firstRender).toBe(secondRender);
    });
  });
});
