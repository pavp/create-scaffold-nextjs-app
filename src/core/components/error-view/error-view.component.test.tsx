import ErrorIcon from '@mui/icons-material/Error';
import { renderWithProviders, screen } from '@test/utils';

import { ERROR_CODE } from '@/core/constants';

import { ErrorView } from './error-view.component';

describe('ErrorView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    error: 500 as ERROR_CODE,
    Icon: ErrorIcon,
    subtitle: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again later.',
  };

  it('should render all error view elements', () => {
    renderWithProviders(<ErrorView {...defaultProps} />);

    expect(screen.getByTestId('error-container')).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.getByTestId('error-title')).toBeInTheDocument();
    expect(screen.getByTestId('error-subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('should display the correct error code', () => {
    renderWithProviders(<ErrorView {...defaultProps} />);

    expect(screen.getByTestId('error-title')).toHaveTextContent('500');
  });

  it('should display the correct subtitle', () => {
    const subtitle = 'Custom error subtitle';

    renderWithProviders(<ErrorView {...defaultProps} subtitle={subtitle} />);

    expect(screen.getByTestId('error-subtitle')).toHaveTextContent(subtitle);
  });

  it('should display the correct message', () => {
    const message = 'This is a custom error message for testing purposes.';

    renderWithProviders(<ErrorView {...defaultProps} message={message} />);

    expect(screen.getByTestId('error-message')).toHaveTextContent(message);
  });

  it('should handle custom error code', () => {
    const customError = 404 as ERROR_CODE;

    renderWithProviders(<ErrorView {...defaultProps} error={customError} />);

    expect(screen.getByTestId('error-title')).toHaveTextContent('404');
  });

  it('should render with different icon types', () => {
    const WarningIcon = () => <div data-testid="warning-icon">Warning</div>;

    renderWithProviders(<ErrorView {...defaultProps} Icon={WarningIcon as any} />);

    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
  });

  it('should handle long error messages', () => {
    const longMessage =
      'This is a very long error message that should still be displayed correctly within the error view ' +
      'component without breaking the layout or causing any display issues.';

    renderWithProviders(<ErrorView {...defaultProps} message={longMessage} />);

    expect(screen.getByTestId('error-message')).toHaveTextContent(longMessage);
  });
});
