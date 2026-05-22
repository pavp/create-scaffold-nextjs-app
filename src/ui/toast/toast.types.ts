export enum ToastSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export interface Toast {
  snackbarOpen: boolean;
  snackbarMessage: string;
  severity: keyof typeof ToastSeverity;
  needTranslation?: boolean;
  translationParams?: Record<string, any>;
  onConfirmation?: () => void;
}

export interface ShowToast extends Omit<Toast, 'snackbarOpen' | 'severity'> {
  severity: keyof typeof ToastSeverity;
}
