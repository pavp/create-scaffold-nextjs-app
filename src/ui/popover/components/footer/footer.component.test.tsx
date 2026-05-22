import { render, screen } from '@testing-library/react';

import { Footer } from './footer.component';

// Mock MUI components
jest.mock('@mui/material', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe('Footer', () => {
  describe('Basic rendering', () => {
    it('should render footer component', () => {
      render(
        <Footer>
          <div>Test footer content</div>
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByText('Test footer content')).toBeInTheDocument();
    });

    it('should render without children', () => {
      render(<Footer />);

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
    });
  });

  describe('Children handling', () => {
    it('should render single child element', () => {
      render(
        <Footer>
          <button data-testid="footer-button">Footer Button</button>
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByTestId('footer-button')).toBeInTheDocument();
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });

    it('should render multiple child elements', () => {
      render(
        <Footer>
          <button data-testid="cancel-btn">Cancel</button>
          <button data-testid="save-btn">Save</button>
          <button data-testid="submit-btn">Submit</button>
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
      expect(screen.getByTestId('save-btn')).toBeInTheDocument();
      expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should render text content', () => {
      render(<Footer>Footer text content</Footer>);

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByText('Footer text content')).toBeInTheDocument();
    });

    it('should render mixed content types', () => {
      render(
        <Footer>
          <span>Footer text</span>
          <div data-testid="footer-element">Footer element</div>
          <span>More footer text</span>
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByText('Footer text')).toBeInTheDocument();
      expect(screen.getByTestId('footer-element')).toBeInTheDocument();
      expect(screen.getByText('More footer text')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply container CSS class', () => {
      render(
        <Footer>
          <div>Styled footer</div>
        </Footer>,
      );

      const container = screen.getByTestId('footer-container');

      expect(container).toHaveClass('container');
    });
  });

  describe('Component structure', () => {
    it('should have proper nested structure', () => {
      render(
        <Footer>
          <div data-testid="footer-wrapper">
            <span data-testid="footer-inner">Nested footer content</span>
          </div>
        </Footer>,
      );

      const container = screen.getByTestId('footer-container');
      const wrapper = screen.getByTestId('footer-wrapper');
      const inner = screen.getByTestId('footer-inner');

      expect(container).toContainElement(wrapper);
      expect(wrapper).toContainElement(inner);
    });
  });

  describe('Common footer use cases', () => {
    it('should render button group in footer', () => {
      render(
        <Footer>
          <div data-testid="button-group">
            <button>Cancel</button>
            <button>Apply</button>
          </div>
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByTestId('button-group')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it('should render form actions in footer', () => {
      render(
        <Footer>
          <form data-testid="footer-form">
            <button type="button">Reset</button>
            <button type="submit">Submit</button>
          </form>
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByTestId('footer-form')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should render pagination in footer', () => {
      render(
        <Footer>
          <div data-testid="pagination">
            <button>Previous</button>
            <span>1 of 5</span>
            <button>Next</button>
          </div>
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('1 of 5')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('React elements as children', () => {
    it('should render React component children', () => {
      const FooterComponent = () => <div data-testid="footer-component">Footer Component</div>;

      render(
        <Footer>
          <FooterComponent />
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByTestId('footer-component')).toBeInTheDocument();
      expect(screen.getByText('Footer Component')).toBeInTheDocument();
    });

    it('should render fragments as children', () => {
      render(
        <Footer>
          <>
            <button data-testid="fragment-btn-1">Action 1</button>
            <button data-testid="fragment-btn-2">Action 2</button>
          </>
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-btn-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-btn-2')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render with null children', () => {
      render(<Footer>{null}</Footer>);

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
    });

    it('should render with undefined children', () => {
      render(<Footer>{undefined}</Footer>);

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
    });

    it('should render with empty string children', () => {
      render(<Footer>{''}</Footer>);

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
    });

    it('should render with number children', () => {
      render(<Footer>{123}</Footer>);

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should render with boolean children', () => {
      render(
        <Footer>
          {true}
          {false}
        </Footer>,
      );

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
    });
  });

  describe('PropsWithChildren type compatibility', () => {
    it('should accept children prop correctly', () => {
      const childrenContent = <div data-testid="footer-children-prop">Footer children prop</div>;

      render(<Footer>{childrenContent}</Footer>);

      expect(screen.getByTestId('footer-container')).toBeInTheDocument();
      expect(screen.getByTestId('footer-children-prop')).toBeInTheDocument();
      expect(screen.getByText('Footer children prop')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(
        <Footer>
          <div data-testid="footer-memo-test">Footer memo test</div>
        </Footer>,
      );

      const firstRender = screen.getByTestId('footer-container');

      rerender(
        <Footer>
          <div data-testid="footer-memo-test">Footer memo test</div>
        </Footer>,
      );

      const secondRender = screen.getByTestId('footer-container');

      expect(firstRender).toBe(secondRender);
    });

    it('should re-render when children change', () => {
      const { rerender } = render(
        <Footer>
          <div>Original footer</div>
        </Footer>,
      );

      expect(screen.getByText('Original footer')).toBeInTheDocument();

      rerender(
        <Footer>
          <div>Updated footer</div>
        </Footer>,
      );

      expect(screen.getByText('Updated footer')).toBeInTheDocument();
      expect(screen.queryByText('Original footer')).not.toBeInTheDocument();
    });
  });
});
