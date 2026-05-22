import { fireEvent, renderWithProviders, screen, waitFor } from '@test/utils';

import { HomeView } from './home-view.view';

// Mock console.log to test component interactions
const mockConsoleLog = jest.fn();

jest.spyOn(console, 'log').mockImplementation(mockConsoleLog);

// Mock the hooks
const mockShowToast = jest.fn();
const mockShowDialog = jest.fn();
const mockOnChangePage = jest.fn();

jest.mock('@/ui/toast/hooks', () => ({
  useShowToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/ui/dialog/hooks', () => ({
  useShowDialog: () => ({ showDialog: mockShowDialog }),
}));

jest.mock('@/ui/pagination/hooks', () => ({
  usePagination: () => ({ onChangePage: mockOnChangePage, page: 1 }),
}));

describe('HomeView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render the main page elements', () => {
    renderWithProviders(<HomeView />);

    expect(screen.getByTestId('main-page')).toBeInTheDocument();
    expect(screen.getByText('Material UI - Next.js App Router example in TypeScript')).toBeInTheDocument();
  });

  it('should render header with title and subtitle', () => {
    renderWithProviders(<HomeView />);

    expect(screen.getByText('Header title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('should render all interactive buttons', () => {
    renderWithProviders(<HomeView />);

    expect(screen.getByText('Show Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Show Modal')).toBeInTheDocument();
    expect(screen.getByText('Show Dialog')).toBeInTheDocument();
  });

  it('should handle success toast button click', () => {
    renderWithProviders(<HomeView />);

    const toastButton = screen.getByText('Show Success Toast');

    fireEvent.click(toastButton);

    expect(mockShowToast).toHaveBeenCalledWith({
      snackbarMessage: 'test',
      severity: 'SUCCESS',
    });
  });

  it('should handle dialog button click', () => {
    renderWithProviders(<HomeView />);

    const dialogButton = screen.getByText('Show Dialog');

    fireEvent.click(dialogButton);

    expect(mockShowDialog).toHaveBeenCalledWith({
      message: 'test',
      severity: 'WARNING',
      handleAccept: expect.any(Function),
      acceptText: 'Continue',
      title: 'Test dialog',
    });
  });

  it('should render and handle checkbox interaction', () => {
    renderWithProviders(<HomeView />);

    const checkbox = screen.getByRole('checkbox', { name: /checkbox/i });

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('should render modal and handle show/hide', () => {
    renderWithProviders(<HomeView />);

    // Initially modal should not be visible
    expect(screen.queryByText('Modal title')).not.toBeInTheDocument();

    // Click show modal button
    const showModalButton = screen.getByText('Show Modal');

    fireEvent.click(showModalButton);

    // Modal should be visible
    expect(screen.getByText('Modal title')).toBeInTheDocument();
    expect(screen.getByText('Test modal')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should render layout components', () => {
    renderWithProviders(<HomeView />);

    expect(screen.getByText('Bottom')).toBeInTheDocument();
    expect(screen.getByText('Right Container')).toBeInTheDocument();
  });

  it('should render radio button and handle change', () => {
    renderWithProviders(<HomeView />);

    const radioButton = screen.getByRole('radio', { name: /radio button/i });

    expect(radioButton).toBeInTheDocument();
    expect(radioButton).not.toBeChecked();

    fireEvent.click(radioButton);
    expect(radioButton).toBeChecked();
  });

  it('should handle calendar date change', async () => {
    renderWithProviders(<HomeView />);

    // Click on a date in the calendar to trigger onChangeDay
    const calendarDates = screen.getAllByRole('gridcell');

    if (calendarDates.length > 0) {
      fireEvent.click(calendarDates[15]);

      await waitFor(() => {
        expect(mockConsoleLog).toHaveBeenCalledWith({ date: expect.any(Object) });
      });
    }
  });

  it('should handle calendar month/year change', async () => {
    renderWithProviders(<HomeView />);

    // Find month/year navigation buttons
    const nextButton = screen.getByLabelText(/next month/i) || screen.getByRole('button', { name: /next/i });

    if (nextButton) {
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockConsoleLog).toHaveBeenCalled();
      });
    }
  });

  it('should have proper component structure', () => {
    renderWithProviders(<HomeView />);

    // Check main container structure
    expect(screen.getByTestId('main-page')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Check layout components are present
    expect(screen.getByText('Header title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
    expect(screen.getByText('Right Container')).toBeInTheDocument();
  });
});
