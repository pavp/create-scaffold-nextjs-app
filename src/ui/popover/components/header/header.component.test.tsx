import { fireEvent, render, screen } from '@testing-library/react';

import { Header } from './header.component';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'common.translate': 'Translate',
    };

    return translations[key] || key;
  },
}));

// Mock MUI Icons
jest.mock('@mui/icons-material/Close', () => {
  return function CloseIcon({ color }: { color?: string }) {
    return <div data-color={color} data-testid="close-icon" />;
  };
});

jest.mock('@mui/icons-material/Translate', () => {
  return function TranslateIcon({ className }: { className?: string }) {
    return <div className={className} data-testid="translate-icon" />;
  };
});

// Mock MUI components
jest.mock('@mui/material', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  IconButton: ({ children, onClick, size, className, ...props }: any) => (
    <button className={className} data-size={size} onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Typography: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
}));

describe('Header', () => {
  const mockHandleClick = jest.fn();
  const defaultProps = {
    title: 'Test Title',
    handleClick: mockHandleClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render header component', () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByTestId('header-container')).toBeInTheDocument();
      expect(screen.getByTestId('translate-icon')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
      expect(screen.getByTestId('header-button')).toBeInTheDocument();
    });

    it('should render with correct title', () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render translate label', () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText('Translate -')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should have proper nested structure', () => {
      render(<Header {...defaultProps} />);

      const container = screen.getByTestId('header-container');
      const translateIcon = screen.getByTestId('translate-icon');
      const closeIcon = screen.getByTestId('close-icon');
      const button = screen.getByTestId('header-button');

      expect(container).toContainElement(translateIcon);
      expect(container).toContainElement(button);
      expect(button).toContainElement(closeIcon);
    });

    it('should apply correct CSS classes', () => {
      render(<Header {...defaultProps} />);

      const container = screen.getByTestId('header-container');

      expect(container).toHaveClass('container');

      const translateIcon = screen.getByTestId('translate-icon');

      expect(translateIcon).toHaveClass('translateIcon');

      const button = screen.getByTestId('header-button');

      expect(button).toHaveClass('iconButton');
    });
  });

  describe('Typography elements', () => {
    it('should render translate label with correct classes', () => {
      render(<Header {...defaultProps} />);

      const translateLabel = screen.getByText('Translate -');

      expect(translateLabel).toHaveClass('titleText');
      expect(translateLabel).toHaveClass('boldText');
    });

    it('should render title without additional classes', () => {
      render(<Header {...defaultProps} />);

      const titleElement = screen.getByText('Test Title');

      expect(titleElement).toBeInTheDocument();
    });
  });

  describe('Button interactions', () => {
    it('should call handleClick when close button is clicked', () => {
      render(<Header {...defaultProps} />);

      const closeButton = screen.getByTestId('header-button');

      fireEvent.click(closeButton);

      expect(mockHandleClick).toHaveBeenCalledTimes(1);
    });

    it('should stop event propagation when button is clicked', () => {
      render(<Header {...defaultProps} />);

      const closeButton = screen.getByTestId('header-button');

      const mockStopPropagation = jest.fn();
      const clickEvent = new MouseEvent('click', { bubbles: true });

      clickEvent.stopPropagation = mockStopPropagation;

      fireEvent(closeButton, clickEvent);

      expect(mockStopPropagation).toHaveBeenCalled();
      expect(mockHandleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon properties', () => {
    it('should render close icon with primary color', () => {
      render(<Header {...defaultProps} />);

      const closeIcon = screen.getByTestId('close-icon');

      expect(closeIcon).toHaveAttribute('data-color', 'primary');
    });

    it('should render translate icon with proper class', () => {
      render(<Header {...defaultProps} />);

      const translateIcon = screen.getByTestId('translate-icon');

      expect(translateIcon).toHaveClass('translateIcon');
    });
  });

  describe('Button properties', () => {
    it('should render icon button with small size', () => {
      render(<Header {...defaultProps} />);

      const button = screen.getByTestId('header-button');

      expect(button).toHaveAttribute('data-size', 'small');
    });

    it('should have proper button styling classes', () => {
      render(<Header {...defaultProps} />);

      const button = screen.getByTestId('header-button');

      expect(button).toHaveClass('iconButton');
    });
  });

  describe('Props handling', () => {
    it('should handle different title values', () => {
      const customProps = {
        title: 'Custom Header Title',
        handleClick: mockHandleClick,
      };

      render(<Header {...customProps} />);

      expect(screen.getByText('Custom Header Title')).toBeInTheDocument();
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should handle different click handlers', () => {
      const alternativeHandler = jest.fn();
      const customProps = {
        title: 'Test',
        handleClick: alternativeHandler,
      };

      render(<Header {...customProps} />);

      const closeButton = screen.getByTestId('header-button');

      fireEvent.click(closeButton);

      expect(alternativeHandler).toHaveBeenCalledTimes(1);
      expect(mockHandleClick).not.toHaveBeenCalled();
    });
  });

  describe('Translation integration', () => {
    it('should display translated text', () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText('Translate -')).toBeInTheDocument();
    });

    it('should combine translated text with title', () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText('Translate -')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(<Header {...defaultProps} />);

      const firstRender = screen.getByTestId('header-container');

      rerender(<Header {...defaultProps} />);

      const secondRender = screen.getByTestId('header-container');

      expect(firstRender).toBe(secondRender);
    });

    it('should re-render when props change', () => {
      const { rerender } = render(<Header {...defaultProps} />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();

      const newProps = {
        ...defaultProps,
        title: 'Changed Title',
      };

      rerender(<Header {...newProps} />);

      expect(screen.getByText('Changed Title')).toBeInTheDocument();
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });
  });
});
