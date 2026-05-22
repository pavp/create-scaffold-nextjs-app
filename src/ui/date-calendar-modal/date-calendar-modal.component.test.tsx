import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';

import { DateCalendarModal } from './date-calendar-modal.component';

// Mock the UI components
jest.mock('@/ui', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="box" {...props}>
      {children}
    </div>
  ),
  Button: ({ children, className, variant, onClick, ...props }: any) => (
    <button className={className} data-variant={variant} onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Calendar: ({ selectedDate, onChangeDay, onChangeMonthAndYear, disabledDates, minDate }: any) => (
    <div data-testid="calendar">
      <div data-testid="selected-date">{selectedDate?.format('YYYY-MM-DD') || 'null'}</div>
      <button data-testid="change-date" onClick={() => onChangeDay(dayjs('2024-02-15'))}>
        Change Date
      </button>
      <button data-testid="change-month" onClick={() => onChangeMonthAndYear?.(dayjs('2024-03-01'))}>
        Change Month
      </button>
      {disabledDates && <div data-testid="disabled-dates">{disabledDates.join(',')}</div>}
      {minDate && <div data-testid="min-date">{minDate.format('YYYY-MM-DD')}</div>}
    </div>
  ),
  Modal: ({ children, isVisible, handleClose }: any) =>
    isVisible ? (
      <div data-testid="modal">
        <button data-testid="modal-close" onClick={handleClose}>
          Close Modal
        </button>
        {children}
      </div>
    ) : null,
}));

// Add Modal sub-components
const Modal = require('@/ui').Modal;

Modal.Header = function Header({ title, handleClick }: any) {
  return (
    <div data-testid="modal-header">
      <h2>{title}</h2>
      <button data-testid="header-close" onClick={handleClick}>
        ×
      </button>
    </div>
  );
};
Modal.Content = function Content({ children }: any) {
  return <div data-testid="modal-content">{children}</div>;
};
Modal.Footer = function Footer({ children }: any) {
  return <div data-testid="modal-footer">{children}</div>;
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
);

describe('DateCalendarModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnChangeMonthAndYear = jest.fn();
  const testDate = dayjs('2024-01-15');
  const minDate = dayjs('2024-01-01');

  const defaultProps = {
    isVisible: true,
    selectedDate: testDate,
    modalTitle: 'Select Date',
    saveLabel: 'Save',
    onClose: mockOnClose,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render modal when visible', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText('Select Date')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should not render modal when not visible', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} isVisible={false} />
        </TestWrapper>,
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should render with null selected date', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} selectedDate={null} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('selected-date')).toHaveTextContent('null');
    });
  });

  describe('Modal components', () => {
    it('should render modal header with title', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} modalTitle="Custom Title" />
        </TestWrapper>,
      );

      expect(screen.getByTestId('modal-header')).toBeInTheDocument();
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should render modal content with calendar', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    it('should render modal footer with save button', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} saveLabel="Custom Save" />
        </TestWrapper>,
      );

      expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
      expect(screen.getByText('Custom Save')).toBeInTheDocument();
    });
  });

  describe('Calendar integration', () => {
    it('should pass selected date to calendar', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('selected-date')).toHaveTextContent('2024-01-15');
    });

    it('should handle calendar date changes', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const changeDateButton = screen.getByTestId('change-date');

      fireEvent.click(changeDateButton);

      expect(screen.getByTestId('selected-date')).toHaveTextContent('2024-02-15');
    });

    it('should pass disabled dates to calendar', () => {
      const disabledDates = ['2024-01-10', '2024-01-20'];

      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} disabledDates={disabledDates} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('disabled-dates')).toHaveTextContent('2024-01-10,2024-01-20');
    });

    it('should pass min date to calendar', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} minDate={minDate} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('min-date')).toHaveTextContent('2024-01-01');
    });

    it('should handle month and year changes', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} onChangeMonthAndYearCalendar={mockOnChangeMonthAndYear} />
        </TestWrapper>,
      );

      const changeMonthButton = screen.getByTestId('change-month');

      fireEvent.click(changeMonthButton);

      expect(mockOnChangeMonthAndYear).toHaveBeenCalledWith(dayjs('2024-03-01'));
    });
  });

  describe('Save functionality', () => {
    it('should call onSave and onClose when save button is clicked with selected date', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const saveButton = screen.getByText('Save');

      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(testDate);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should save with updated date after calendar change', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      // Change date in calendar first
      const changeDateButton = screen.getByTestId('change-date');

      fireEvent.click(changeDateButton);

      // Then save
      const saveButton = screen.getByText('Save');

      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(dayjs('2024-02-15'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not save when selected date is null', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} selectedDate={null} />
        </TestWrapper>,
      );

      const saveButton = screen.getByText('Save');

      fireEvent.click(saveButton);

      expect(mockOnSave).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should stop event propagation on save', () => {
      const mockStopPropagation = jest.fn();

      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const saveButton = screen.getByText('Save');

      // Create a custom event with stopPropagation
      const clickEvent = new MouseEvent('click', { bubbles: true });

      clickEvent.stopPropagation = mockStopPropagation;

      fireEvent(saveButton, clickEvent);

      expect(mockStopPropagation).toHaveBeenCalled();
    });
  });

  describe('Close functionality', () => {
    it('should call onClose when modal close button is clicked', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const closeButton = screen.getByTestId('modal-close');

      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when header close button is clicked', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const headerCloseButton = screen.getByTestId('header-close');

      fireEvent.click(headerCloseButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply footer class to footer container', () => {
      const { container } = render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const footerBox = container.querySelector('.footer');

      expect(footerBox).toBeInTheDocument();
    });

    it('should apply saveButton class and variant to save button', () => {
      render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const saveButton = screen.getByText('Save');

      expect(saveButton).toHaveClass('saveButton');
      expect(saveButton).toHaveAttribute('data-variant', 'contained');
    });
  });

  describe('Props validation', () => {
    it('should handle all optional props', () => {
      const disabledDates = ['2024-01-10'];

      render(
        <TestWrapper>
          <DateCalendarModal
            disabledDates={disabledDates}
            isVisible={true}
            minDate={minDate}
            modalTitle="Full Props Test"
            saveLabel="Complete"
            selectedDate={testDate}
            onChangeMonthAndYearCalendar={mockOnChangeMonthAndYear}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('Full Props Test')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByTestId('disabled-dates')).toHaveTextContent('2024-01-10');
      expect(screen.getByTestId('min-date')).toHaveTextContent('2024-01-01');
    });

    it('should handle missing optional props', () => {
      render(
        <TestWrapper>
          <DateCalendarModal
            isVisible={true}
            modalTitle="Minimal Props"
            saveLabel="Save"
            selectedDate={testDate}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('Minimal Props')).toBeInTheDocument();
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
      expect(screen.queryByTestId('disabled-dates')).not.toBeInTheDocument();
      expect(screen.queryByTestId('min-date')).not.toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const firstRender = screen.getByTestId('modal');

      rerender(
        <TestWrapper>
          <DateCalendarModal {...defaultProps} />
        </TestWrapper>,
      );

      const secondRender = screen.getByTestId('modal');

      expect(firstRender).toBe(secondRender);
    });
  });
});
