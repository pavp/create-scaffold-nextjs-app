import { act, renderWithProviders } from '@test/utils/test-utils';

import { useToast } from '../../hooks';

import { ConfirmationComponent } from './confirmation-component';

jest.mock('../../hooks/use-toast/use-toast');
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

const setup = () => {
  const spyOnHandleClose = jest.fn();

  mockUseToast.mockImplementation(() => {
    return {
      handleClose: spyOnHandleClose,
      snackbarOpen: true,
      severity: 'INFO',
      message: '',
      onConfirmation: jest.fn(),
    };
  });

  const message = 'message';
  const spyOnConfirmation = jest.fn();
  const context = renderWithProviders(<ConfirmationComponent message={message} onConfirmation={spyOnConfirmation} />);

  return { context, message, spyOnConfirmation, spyOnHandleClose };
};

describe('ConfirmationComponent tests', () => {
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
