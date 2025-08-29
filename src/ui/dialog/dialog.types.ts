export interface DialogState extends OpenDialog {
  isVisible: boolean;
}

export interface OpenDialog {
  severity: keyof typeof DialogSeverity;
  title?: string;
  message: string;
  acceptText?: string;
  cancelText?: string;
  handleAccept: () => void;
  handleCancel?: () => void;
}

export enum DialogSeverity {
  ERROR = 'error',
  WARNING = 'warning',
}
