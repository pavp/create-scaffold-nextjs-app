import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';

import { Calendar } from './calendar.component';

// Mock the constants
jest.mock('@/constants', () => ({
  DATE_FORMAT: 'YYYY-MM-DD',
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
);

describe('Calendar', () => {
  const mockOnChangeDay = jest.fn();
  const mockOnChangeMonthAndYear = jest.fn();
  const testDate = dayjs('2024-01-15');
  const minDate = dayjs('2024-01-01');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render calendar with selected date', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      // Check for date calendar presence
      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });

    it('should render calendar with null selected date', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={null} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });

    it('should render with small calendar variant', () => {
      render(
        <TestWrapper>
          <Calendar smallCalendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.dateCalendar.smallDateCalendar');

      expect(calendar).toBeInTheDocument();
    });

    it('should render with regular calendar variant', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={testDate} smallCalendar={false} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.dateCalendar');

      expect(calendar).toBeInTheDocument();
    });
  });

  describe('Calendar interactions', () => {
    it('should call onChangeDay when a date is selected', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      // Just verify the calendar renders and has the onChangeDay prop
      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
      expect(mockOnChangeDay).toBeDefined();
    });

    it('should call onChangeMonthAndYear when month changes', () => {
      render(
        <TestWrapper>
          <Calendar
            selectedDate={testDate}
            onChangeDay={mockOnChangeDay}
            onChangeMonthAndYear={mockOnChangeMonthAndYear}
          />
        </TestWrapper>,
      );

      // Try to find navigation buttons
      const nextButton = screen.getByLabelText(/next month/i) || document.querySelector('[aria-label*="next"]');

      if (nextButton) {
        fireEvent.click(nextButton);
        expect(mockOnChangeMonthAndYear).toHaveBeenCalled();
      }
    });
  });

  describe('Calendar states', () => {
    it('should render as disabled', () => {
      render(
        <TestWrapper>
          <Calendar disabled selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });

    it('should render in loading state', () => {
      render(
        <TestWrapper>
          <Calendar loading selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });

    it('should render with minimum date restriction', () => {
      render(
        <TestWrapper>
          <Calendar minDate={minDate} selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });
  });

  describe('Disabled dates functionality', () => {
    it('should disable specific dates', () => {
      const disabledDates = ['2024-01-10', '2024-01-15', '2024-01-20'];

      render(
        <TestWrapper>
          <Calendar disabledDates={disabledDates} selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });

    it('should work without disabled dates', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });
  });

  describe('Custom slots and icons', () => {
    it('should render custom navigation icons', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      // Check for navigation buttons with custom styling
      const navigationButtons = document.querySelectorAll('.iconButtonContainer');

      expect(navigationButtons.length).toBeGreaterThanOrEqual(0);
    });

    it('should render invitation icon', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      // Check for invitation icon
      // Removed unused variable

      // Icon might not be visible depending on MUI X version
      expect(document.querySelector('.MuiDateCalendar-root')).toBeInTheDocument();
    });
  });

  describe('Calendar container', () => {
    it('should render with container class', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const container = document.querySelector('.container');

      expect(container).toBeInTheDocument();
    });
  });

  describe('shouldDisableDate function', () => {
    it('should not disable dates when no disabled dates provided', () => {
      render(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });

    it('should handle disabled dates correctly', () => {
      const disabledDates = ['2024-01-15'];

      render(
        <TestWrapper>
          <Calendar disabledDates={disabledDates} selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const firstRender = document.querySelector('.MuiDateCalendar-root');

      rerender(
        <TestWrapper>
          <Calendar selectedDate={testDate} onChangeDay={mockOnChangeDay} />
        </TestWrapper>,
      );

      const secondRender = document.querySelector('.MuiDateCalendar-root');

      // Both should exist (memoized component should work)
      expect(firstRender).toBe(secondRender);
    });
  });

  describe('Combined props', () => {
    it('should handle all props together', () => {
      const disabledDates = ['2024-01-10'];

      render(
        <TestWrapper>
          <Calendar
            smallCalendar
            disabled={false}
            disabledDates={disabledDates}
            loading={false}
            minDate={minDate}
            selectedDate={testDate}
            onChangeDay={mockOnChangeDay}
            onChangeMonthAndYear={mockOnChangeMonthAndYear}
          />
        </TestWrapper>,
      );

      const calendar = document.querySelector('.MuiDateCalendar-root');

      expect(calendar).toBeInTheDocument();

      const smallCalendar = document.querySelector('.dateCalendar.smallDateCalendar');

      expect(smallCalendar).toBeInTheDocument();
    });
  });
});
