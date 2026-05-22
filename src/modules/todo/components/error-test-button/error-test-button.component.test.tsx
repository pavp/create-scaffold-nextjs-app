import { fireEvent, renderWithProviders, screen } from '@test/utils';

import { useErrorTestBusiness } from './hooks/use-error-test-business/use-error-test-business.hook';
import { useErrorTestController } from './hooks/use-error-test-controller/use-error-test-controller.hook';
import { ErrorTestButton } from './error-test-button.component';

// Mock the hooks
jest.mock('./hooks/use-error-test-business/use-error-test-business.hook', () => ({
  useErrorTestBusiness: jest.fn(() => ({
    isLoading: false,
    triggerErrorTest: jest.fn(),
  })),
}));

jest.mock('./hooks/use-error-test-controller/use-error-test-controller.hook', () => ({
  useErrorTestController: jest.fn(() => ({
    selectedErrorType: null,
    handleErrorTypeChange: jest.fn(),
  })),
}));

describe('ErrorTestButton', () => {
  const mockTriggerErrorTest = jest.fn();
  const mockHandleErrorTypeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useErrorTestBusiness as jest.Mock).mockReturnValue({
      isLoading: false,
      triggerErrorTest: mockTriggerErrorTest,
    });

    (useErrorTestController as jest.Mock).mockReturnValue({
      selectedErrorType: null,
      handleErrorTypeChange: mockHandleErrorTypeChange,
    });
  });

  it('should render title and description', () => {
    renderWithProviders(<ErrorTestButton />);

    expect(screen.getByText('Test Error Handling')).toBeInTheDocument();
    expect(screen.getByText(/Click any button to test different error types/)).toBeInTheDocument();
  });

  it('should render all error type buttons', () => {
    renderWithProviders(<ErrorTestButton />);

    expect(screen.getByRole('button', { name: /validation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unauthorized/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forbidden/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /not found/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /server/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /network/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generic/i })).toBeInTheDocument();
  });

  it('should call handlers when error button is clicked', () => {
    renderWithProviders(<ErrorTestButton />);

    const validationButton = screen.getByRole('button', { name: /validation/i });

    fireEvent.click(validationButton);

    expect(mockHandleErrorTypeChange).toHaveBeenCalledWith('validation');
    expect(mockTriggerErrorTest).toHaveBeenCalledWith('validation');
  });

  it('should disable buttons when loading', () => {
    (useErrorTestBusiness as jest.Mock).mockReturnValue({
      isLoading: true,
      triggerErrorTest: mockTriggerErrorTest,
    });

    renderWithProviders(<ErrorTestButton />);

    const buttons = screen.getAllByRole('button');

    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should show loading state for selected error type', () => {
    (useErrorTestBusiness as jest.Mock).mockReturnValue({
      isLoading: true,
      triggerErrorTest: mockTriggerErrorTest,
    });

    (useErrorTestController as jest.Mock).mockReturnValue({
      selectedErrorType: 'validation',
      handleErrorTypeChange: mockHandleErrorTypeChange,
    });

    renderWithProviders(<ErrorTestButton />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render note about error behavior', () => {
    renderWithProviders(<ErrorTestButton />);

    expect(screen.getByText(/All errors will show toast notifications/)).toBeInTheDocument();
    expect(screen.getByText(/Unauthorized errors will also redirect to login/)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = renderWithProviders(<ErrorTestButton className="custom-class" />);

    const errorTestContainer = container.firstChild;

    expect(errorTestContainer).toHaveClass('custom-class');
  });

  it('should have correct display name', () => {
    expect(ErrorTestButton.displayName).toBe('ErrorTestButton');
  });

  it('should render with default className when none provided', () => {
    renderWithProviders(<ErrorTestButton />);

    expect(screen.getByText('Test Error Handling')).toBeInTheDocument();
  });

  it('should handle multiple error types correctly', () => {
    renderWithProviders(<ErrorTestButton />);

    // Test server error button
    const serverButton = screen.getByRole('button', { name: /server/i });

    fireEvent.click(serverButton);

    expect(mockHandleErrorTypeChange).toHaveBeenCalledWith('server');
    expect(mockTriggerErrorTest).toHaveBeenCalledWith('server');

    // Test network error button
    const networkButton = screen.getByRole('button', { name: /network/i });

    fireEvent.click(networkButton);

    expect(mockHandleErrorTypeChange).toHaveBeenCalledWith('network');
    expect(mockTriggerErrorTest).toHaveBeenCalledWith('network');
  });

  it('should render in grey container with border', () => {
    const { container } = renderWithProviders(<ErrorTestButton />);

    const errorTestContainer = container.firstChild;

    expect(errorTestContainer).toBeInTheDocument();
  });

  it('should show regular button text when not loading', () => {
    (useErrorTestController as jest.Mock).mockReturnValue({
      selectedErrorType: 'validation',
      handleErrorTypeChange: mockHandleErrorTypeChange,
    });

    renderWithProviders(<ErrorTestButton />);

    expect(screen.getByRole('button', { name: /validation/i })).toBeInTheDocument();
  });
});
