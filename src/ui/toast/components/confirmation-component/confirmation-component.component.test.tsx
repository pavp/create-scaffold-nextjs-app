import { act, renderWithProviders } from '@test/utils';

import { ConfirmationComponent } from './confirmation-component.component';

// Mock the useToast hook completely
const mockUseToast = jest.fn();

jest.mock('../../hooks', () => ({
  useToast: () => mockUseToast(),
}));

const setup = () => {
  const spyOnHandleClose = jest.fn();

  mockUseToast.mockReturnValue({
    handleClose: spyOnHandleClose,
    snackbarOpen: true,
    severity: 'INFO',
    message: '',
    onConfirmation: jest.fn(),
  });

  const message = 'message';
  const spyOnConfirmation = jest.fn();
  const context = renderWithProviders(<ConfirmationComponent message={message} onConfirmation={spyOnConfirmation} />);

  return { context, message, spyOnConfirmation, spyOnHandleClose };
};

describe('ConfirmationComponent tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all elements', () => {
    const { context, message } = setup();

    expect(context.getByTestId('confirm-delete-container')).toBeInTheDocument();

    const deleteMessage = context.getByTestId('confirm-delete-message');

    expect(deleteMessage).toBeInTheDocument();
    expect(deleteMessage).toHaveTextContent(message);

    expect(context.getByTestId('confirm-delete-button')).toBeInTheDocument();
  });

  it('should execute onConfirmation and clearToast when click on accept button', () => {
    const { context, spyOnConfirmation, spyOnHandleClose } = setup();

    const deleteButton = context.getByTestId('confirm-delete-button');

    act(() => {
      deleteButton.click();
    });

    expect(spyOnConfirmation).toHaveBeenCalled();
    expect(spyOnHandleClose).toHaveBeenCalled();
  });
});
