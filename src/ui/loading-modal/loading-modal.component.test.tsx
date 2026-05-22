import { render, screen } from '@testing-library/react';

import { LoadingModal } from './loading-modal.component';

// Mock MUI Modal
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Modal: ({ children, open, ...props }: any) =>
    open ? (
      <div data-testid="modal" {...props}>
        {children}
      </div>
    ) : null,
  Box: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="box" {...props}>
      {children}
    </div>
  ),
}));

// Mock LoadingIndicator component
jest.mock('../loading-indicator/loading-indicator.component', () => ({
  LoadingIndicator: ({ size }: { size?: string | number }) => <div data-size={size} data-testid="loading-indicator" />,
}));

describe('LoadingModal', () => {
  describe('Basic rendering', () => {
    it('should render loading modal', () => {
      render(<LoadingModal />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('box')).toBeInTheDocument();
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('should render with container className', () => {
      render(<LoadingModal />);

      const box = screen.getByTestId('box');

      expect(box).toHaveClass('container');
    });

    it('should always be open', () => {
      render(<LoadingModal />);

      // Modal should be rendered since it's always open
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });

  describe('LoadingIndicator integration', () => {
    it('should render LoadingIndicator without props', () => {
      render(<LoadingModal />);

      const loadingIndicator = screen.getByTestId('loading-indicator');

      expect(loadingIndicator).toBeInTheDocument();
      expect(loadingIndicator).not.toHaveAttribute('data-size');
    });
  });

  describe('Modal structure', () => {
    it('should have proper nested structure', () => {
      render(<LoadingModal />);

      const modal = screen.getByTestId('modal');
      const box = screen.getByTestId('box');
      const loadingIndicator = screen.getByTestId('loading-indicator');

      expect(modal).toContainElement(box);
      expect(box).toContainElement(loadingIndicator);
    });
  });

  describe('Component behavior', () => {
    it('should render consistently on multiple calls', () => {
      const { rerender } = render(<LoadingModal />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

      rerender(<LoadingModal />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('should be a simple static component', () => {
      render(<LoadingModal />);

      // Component should render without any props and be always visible
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('box')).toBeInTheDocument();
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
  });

  describe('Accessibility and structure', () => {
    it('should render modal with default accessibility', () => {
      render(<LoadingModal />);

      const modal = screen.getByTestId('modal');

      expect(modal).toBeInTheDocument();
    });

    it('should have proper Box container', () => {
      render(<LoadingModal />);

      const box = screen.getByTestId('box');

      expect(box).toBeInTheDocument();
      expect(box).toHaveClass('container');
    });
  });

  describe('Integration with styles', () => {
    it('should apply container styles from SCSS module', () => {
      render(<LoadingModal />);

      const box = screen.getByTestId('box');

      expect(box).toHaveClass('container');
    });
  });
});
