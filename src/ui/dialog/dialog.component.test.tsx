import React from 'react';
// import { renderWithProviders } from '@test/utils';
import { fireEvent, render, screen } from '@testing-library/react';

import { Dialog } from './dialog.component';
import { useDialog } from './hooks';

// Mock next-intl efficiently
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    ({
      'dialog.title': 'Confirmation',
      'dialog.accept': 'OK',
      'dialog.cancel': 'Cancel',
    })[key] || key,
}));

// Mock the useDialog hook
const mockUseDialog = {
  isVisible: false,
  severity: 'ERROR' as keyof typeof import('./dialog.types').DialogSeverity,
  title: undefined as string | undefined,
  message: '',
  acceptText: undefined as string | undefined,
  cancelText: undefined as string | undefined,
  handleAccept: jest.fn(),
  handleCancel: undefined as (() => void) | undefined,
  openDialog: jest.fn(),
  closeDialog: jest.fn(),
};

jest.mock('./hooks', () => ({
  useDialog: jest.fn(),
}));

// Mock MUI Icons efficiently
jest.mock('@mui/icons-material/Cancel', () => {
  const CancelIcon = () => <div data-testid="cancel-icon" />;

  CancelIcon.displayName = 'CancelIcon';

  return CancelIcon;
});
jest.mock('@mui/icons-material/Warning', () => {
  const WarningIcon = () => <div data-testid="warning-icon" />;

  WarningIcon.displayName = 'WarningIcon';

  return WarningIcon;
});

// Mock Button component
jest.mock('@/ui', () => ({
  Button: ({ children, onClick, color, variant, ...props }: any) => (
    <button data-color={color} data-testid="dialog-button" data-variant={variant} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const mockedUseDialog = useDialog as jest.MockedFunction<typeof useDialog>;

// Helper function to create complete mock dialog state
const createMockDialogState = (overrides: Partial<typeof mockUseDialog> = {}) => ({
  ...mockUseDialog,
  ...overrides,
});

describe('Dialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDialog.mockReturnValue(mockUseDialog);
  });

  describe('Basic rendering', () => {
    it('should not render when dialog is not visible', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          isVisible: false,
        }),
      );

      render(<Dialog />);

      expect(screen.queryByTestId('dialog-mui')).not.toBeInTheDocument();
    });

    it('should render when dialog is visible', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
        }),
      );

      render(<Dialog />);

      expect(screen.getByTestId('dialog-mui')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should have proper dialog structure', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
        }),
      );

      render(<Dialog />);

      expect(screen.getByTestId('dialog-mui')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Confirmation')).toBeInTheDocument();
    });
  });

  describe('Severity handling', () => {
    it('should render ERROR severity with cancel icon', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          severity: 'ERROR',
          message: 'Error message',
        }),
      );

      render(<Dialog />);

      expect(screen.getByTestId('cancel-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('warning-icon')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should render WARNING severity with warning icon', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          severity: 'WARNING',
          message: 'Warning message',
        }),
      );

      render(<Dialog />);

      expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('cancel-icon')).not.toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });

  describe('Title handling', () => {
    it('should use default title when no custom title provided', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          title: undefined,
          message: 'Test message',
        }),
      );

      render(<Dialog />);

      expect(screen.getByText('Confirmation')).toBeInTheDocument();
    });

    it('should use custom title when provided', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          title: 'Custom Dialog Title',
          message: 'Test message',
        }),
      );

      render(<Dialog />);

      expect(screen.getByText('Custom Dialog Title')).toBeInTheDocument();
      expect(screen.queryByText('Confirmation')).not.toBeInTheDocument();
    });
  });

  describe('Button text handling', () => {
    it('should use default button texts when not provided', () => {
      const mockHandleCancel = jest.fn();

      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
          acceptText: undefined,
          cancelText: undefined,
          handleCancel: mockHandleCancel,
        }),
      );

      render(<Dialog />);

      expect(screen.getByText('OK')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should use custom button texts when provided', () => {
      const mockHandleCancel = jest.fn();

      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
          acceptText: 'Yes',
          cancelText: 'No',
          handleCancel: mockHandleCancel,
        }),
      );

      render(<Dialog />);

      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });
  });

  describe('Button interactions', () => {
    it('should call handleAccept when accept button is clicked', () => {
      const mockHandleAccept = jest.fn();

      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
          handleAccept: mockHandleAccept,
        }),
      );

      render(<Dialog />);

      const acceptButton = screen.getAllByTestId('dialog-button')[0];

      fireEvent.click(acceptButton);

      expect(mockHandleAccept).toHaveBeenCalledTimes(1);
    });

    it('should call handleCancel when cancel button is clicked', () => {
      const mockHandleCancel = jest.fn();

      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
          handleCancel: mockHandleCancel,
        }),
      );

      render(<Dialog />);

      const buttons = screen.getAllByTestId('dialog-button');
      const cancelButton = buttons[1]; // Cancel button is second

      fireEvent.click(cancelButton);

      expect(mockHandleCancel).toHaveBeenCalledTimes(1);
    });

    it('should not render cancel button when handleCancel is not provided', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
          handleCancel: undefined,
        }),
      );

      render(<Dialog />);

      const buttons = screen.getAllByTestId('dialog-button');

      expect(buttons).toHaveLength(1); // Only accept button
    });

    it('should render both buttons when handleCancel is provided', () => {
      const mockHandleCancel = jest.fn();

      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
          handleCancel: mockHandleCancel,
        }),
      );

      render(<Dialog />);

      const buttons = screen.getAllByTestId('dialog-button');

      expect(buttons).toHaveLength(2); // Both accept and cancel buttons
    });
  });

  describe('Button styling', () => {
    it('should render accept button with correct styling props', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
        }),
      );

      render(<Dialog />);

      const acceptButton = screen.getAllByTestId('dialog-button')[0];

      expect(acceptButton).toHaveAttribute('data-color', 'primary');
      expect(acceptButton).toHaveAttribute('data-variant', 'outlined');
    });

    it('should render cancel button with correct styling props when present', () => {
      const mockHandleCancel = jest.fn();

      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
          handleCancel: mockHandleCancel,
        }),
      );

      render(<Dialog />);

      const buttons = screen.getAllByTestId('dialog-button');
      const cancelButton = buttons[1];

      expect(cancelButton).toHaveAttribute('data-color', 'primary');
      expect(cancelButton).toHaveAttribute('data-variant', 'contained');
    });
  });

  describe('Dialog content', () => {
    it('should render message text in dialog content', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'This is the dialog message content',
        }),
      );

      render(<Dialog />);

      expect(screen.getByText('This is the dialog message content')).toBeInTheDocument();
    });

    it('should render dialog content properly', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
        }),
      );

      render(<Dialog />);

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should have correct id on dialog description', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
        }),
      );

      render(<Dialog />);

      const description = screen.getByText('Test message');

      expect(description).toHaveAttribute('id', 'alert-dialog-description');
    });
  });

  describe('Complete dialog scenarios', () => {
    it('should render complete ERROR dialog with all props', () => {
      const mockHandleAccept = jest.fn();
      const mockHandleCancel = jest.fn();

      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          isVisible: true,
          severity: 'ERROR',
          title: 'Delete Item',
          message: 'Are you sure you want to delete this item?',
          acceptText: 'Delete',
          cancelText: 'Keep',
          handleAccept: mockHandleAccept,
          handleCancel: mockHandleCancel,
        }),
      );

      render(<Dialog />);

      expect(screen.getByTestId('dialog-mui')).toBeInTheDocument();
      expect(screen.getByTestId('cancel-icon')).toBeInTheDocument();
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Keep')).toBeInTheDocument();

      const buttons = screen.getAllByTestId('dialog-button');

      expect(buttons).toHaveLength(2);
    });

    it('should render complete WARNING dialog with minimal props', () => {
      const mockHandleAccept = jest.fn();

      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          isVisible: true,
          severity: 'WARNING',
          title: undefined,
          message: 'This action cannot be undone',
          acceptText: undefined,
          cancelText: undefined,
          handleAccept: mockHandleAccept,
          handleCancel: undefined,
        }),
      );

      render(<Dialog />);

      expect(screen.getByTestId('dialog-mui')).toBeInTheDocument();
      expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
      expect(screen.getByText('Confirmation')).toBeInTheDocument(); // Default title
      expect(screen.getByText('This action cannot be undone')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument(); // Default accept text

      const buttons = screen.getAllByTestId('dialog-button');

      expect(buttons).toHaveLength(1); // Only accept button
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      mockedUseDialog.mockReturnValue(
        createMockDialogState({
          ...mockUseDialog,
          isVisible: true,
          message: 'Test message',
        }),
      );

      const { rerender } = render(<Dialog />);

      const firstRender = screen.getByTestId('dialog-mui');

      rerender(<Dialog />);

      const secondRender = screen.getByTestId('dialog-mui');

      expect(firstRender).toBe(secondRender);
    });
  });
});
