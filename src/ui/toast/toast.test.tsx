import { renderWithProviders } from '@test/utils/test-utils';

import { ToastSeverity } from '..';

import { useToast } from './hooks';
import { Toast } from './toast';

jest.mock('./hooks/use-toast/use-toast');
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

const mockConfirmationComponent = 'mockConfirmationComponent';

jest.mock('./components', () => {
  return {
    ConfirmationComponent: () => <div data-testid={mockConfirmationComponent} />,
  };
});

interface hookData {
  snackbarOpen: boolean;
  severity: keyof typeof ToastSeverity;
  message: string;
  onConfirmation?: () => void;
  handleClose: () => void;
}

const mockHookData: hookData = {
  snackbarOpen: true,
  severity: 'ERROR',
  message: 'message',
  handleClose: jest.fn(),
};

const setup = ({ snackbarOpen, severity, message, onConfirmation, handleClose }: hookData) => {
  mockUseToast.mockImplementation(() => {
    return {
      snackbarOpen,
      severity,
      message,
      onConfirmation,
      handleClose,
    };
  });

  const context = renderWithProviders(<Toast />);

  return { context };
};

describe('Toast tests', () => {
  it('should render all elements', () => {
    const { context } = setup(mockHookData);

    expect(context.getByTestId('snackbar-toast')).toBeInTheDocument();
    expect(context.getByTestId('alert-toast')).toBeInTheDocument();
  });

  it('should not display toast if snackbarOpen is false', () => {
    const { context } = setup({
      ...mockHookData,
      snackbarOpen: false,
    });

    expect(context.queryByTestId('snackbar-toast')).not.toBeInTheDocument();
    expect(context.queryByTestId('alert-toast')).not.toBeInTheDocument();
  });

  it('should render message if no confirmation', () => {
    const { context } = setup(mockHookData);

    const alert = context.getByTestId('alert-toast');

    expect(alert).toHaveTextContent(mockHookData.message);
    expect(context.queryByTestId(mockConfirmationComponent)).not.toBeInTheDocument();
  });

  it('should render confirmation if required', () => {
    const { context } = setup({
      ...mockHookData,
      onConfirmation: jest.fn(),
    });

    expect(context.queryByTestId(mockConfirmationComponent)).toBeInTheDocument();
  });

  describe('it should have differences depends on severity', () => {
    it('info. should have InfoOutlinedIcon, not hideAction class', () => {
      const { context } = setup({
        ...mockHookData,
        severity: 'INFO',
      });

      const toast = context.queryByTestId('alert-toast');

      expect(toast).toHaveClass('MuiAlert-colorInfo');
      expect(toast).not.toHaveClass('hideAction');

      expect(context.getByTestId('InfoOutlinedIcon')).toBeInTheDocument();
    });

    it('success. should have CheckCircleOutlineIcon and hideAction class', () => {
      const { context } = setup({
        ...mockHookData,
        severity: 'SUCCESS',
      });

      const toast = context.queryByTestId('alert-toast');

      expect(toast).toHaveClass('MuiAlert-colorSuccess');
      expect(toast).toHaveClass('hideAction');

      expect(context.getByTestId('CheckCircleOutlineIcon')).toBeInTheDocument();
    });

    it('warning. should have ReportProblemIcon, not hideAction class', () => {
      const { context } = setup({
        ...mockHookData,
        severity: 'WARNING',
      });

      const toast = context.queryByTestId('alert-toast');

      expect(toast).toHaveClass('MuiAlert-colorWarning');
      expect(toast).not.toHaveClass('hideAction');

      expect(context.getByTestId('ReportProblemIcon')).toBeInTheDocument();
    });

    it('error. should have CancelIcon, not hideAction class', () => {
      const { context } = setup({
        ...mockHookData,
        severity: 'ERROR',
      });

      const toast = context.queryByTestId('alert-toast');

      expect(toast).toHaveClass('MuiAlert-colorError');
      expect(toast).not.toHaveClass('hideAction');

      expect(context.getByTestId('CancelIcon')).toBeInTheDocument();
    });
  });
});
