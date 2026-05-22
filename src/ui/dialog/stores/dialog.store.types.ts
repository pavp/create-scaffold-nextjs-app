import type { OpenDialog } from '../dialog.types';

export interface DialogActions {
  openDialog: (params: OpenDialog) => void;
  closeDialog: () => void;
  resetDialogState: () => void;
  clearDialog: () => void;
}

export interface DialogState {
  isVisible: boolean;
  severity: keyof typeof DialogSeverity;
  title?: string;
  message: string;
  acceptText?: string;
  cancelText?: string;
  handleAccept: () => void;
  handleCancel?: () => void;
}

export interface DialogStoreState extends DialogState {
  actions: DialogActions;
}

export enum DialogSeverity {
  ERROR = 'error',
  WARNING = 'warning',
}
