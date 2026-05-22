import { useShallow } from 'zustand/react/shallow';

import { useDialogStore } from '../../dialog.store';

export const useDialogStateSelector = () => {
  const { isVisible, severity, title, message, acceptText, cancelText, handleAccept, handleCancel } = useDialogStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      severity: state.severity,
      title: state.title,
      message: state.message,
      acceptText: state.acceptText,
      cancelText: state.cancelText,
      handleAccept: state.handleAccept,
      handleCancel: state.handleCancel,
    })),
  );

  return {
    isVisible,
    severity,
    title,
    message,
    acceptText,
    cancelText,
    handleAccept,
    handleCancel,
  };
};
