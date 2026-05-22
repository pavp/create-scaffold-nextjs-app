import { Toast } from '../toast.types';

export const mockToastData: Toast = {
  snackbarOpen: false,
  snackbarMessage: 'snackbarMessage',
  severity: 'ERROR',
  onConfirmation: jest.fn(),
  needTranslation: false,
};
