import { render, screen } from '@testing-library/react';

import { Content } from './content.component';

// Mock MUI components efficiently
jest.mock('@mui/material', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe('Content', () => {
  describe('Basic rendering', () => {
    it('should render content component', () => {
      render(
        <Content>
          <div>Test content</div>
        </Content>,
      );

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render without children', () => {
      render(<Content />);

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
    });
  });

  describe('Children handling', () => {
    it('should render single child element', () => {
      render(
        <Content>
          <span data-testid="single-child">Single child</span>
        </Content>,
      );

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByTestId('single-child')).toBeInTheDocument();
      expect(screen.getByText('Single child')).toBeInTheDocument();
    });

    it('should render multiple child elements', () => {
      render(
        <Content>
          <div data-testid="child-1">First child</div>
          <div data-testid="child-2">Second child</div>
          <span data-testid="child-3">Third child</span>
        </Content>,
      );

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });

    it('should render text content', () => {
      render(<Content>Plain text content</Content>);

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByText('Plain text content')).toBeInTheDocument();
    });

    it('should render mixed content types', () => {
      render(
        <Content>
          <span>Plain text</span>
          <div data-testid="mixed-element">Mixed element</div>
          <span>More text</span>
        </Content>,
      );

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByText('Plain text')).toBeInTheDocument();
      expect(screen.getByTestId('mixed-element')).toBeInTheDocument();
      expect(screen.getByText('More text')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply container CSS class', () => {
      render(
        <Content>
          <div>Styled content</div>
        </Content>,
      );

      const container = screen.getByTestId('container-content');

      expect(container).toHaveClass('container');
    });
  });

  describe('Component structure', () => {
    it('should have proper nested structure', () => {
      render(
        <Content>
          <div data-testid="nested-child">
            <span data-testid="deep-nested">Deep nested content</span>
          </div>
        </Content>,
      );

      const container = screen.getByTestId('container-content');
      const nestedChild = screen.getByTestId('nested-child');
      const deepNested = screen.getByTestId('deep-nested');

      expect(container).toContainElement(nestedChild);
      expect(nestedChild).toContainElement(deepNested);
    });
  });

  describe('React elements as children', () => {
    it('should render React component children', () => {
      const TestComponent = () => <div data-testid="test-component">React Component</div>;

      render(
        <Content>
          <TestComponent />
        </Content>,
      );

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('React Component')).toBeInTheDocument();
    });

    it('should render fragments as children', () => {
      render(
        <Content>
          <>
            <div data-testid="fragment-child-1">Fragment child 1</div>
            <div data-testid="fragment-child-2">Fragment child 2</div>
          </>
        </Content>,
      );

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render with null children', () => {
      render(<Content>{null}</Content>);

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
    });

    it('should render with undefined children', () => {
      render(<Content>{undefined}</Content>);

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
    });

    it('should render with empty string children', () => {
      render(<Content>{''}</Content>);

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
    });

    it('should render with number children', () => {
      render(<Content>{42}</Content>);

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render with boolean children', () => {
      render(
        <Content>
          {true}
          {false}
        </Content>,
      );

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
    });
  });

  describe('PropsWithChildren type compatibility', () => {
    it('should accept children prop correctly', () => {
      const childrenContent = <div data-testid="children-prop">Children prop content</div>;

      render(<Content>{childrenContent}</Content>);

      expect(screen.getByTestId('container-content')).toBeInTheDocument();
      expect(screen.getByTestId('children-prop')).toBeInTheDocument();
      expect(screen.getByText('Children prop content')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(
        <Content>
          <div data-testid="memo-test">Memo test content</div>
        </Content>,
      );

      const firstRender = screen.getByTestId('container-content');

      rerender(
        <Content>
          <div data-testid="memo-test">Memo test content</div>
        </Content>,
      );

      const secondRender = screen.getByTestId('container-content');

      expect(firstRender).toBe(secondRender);
    });

    it('should re-render when children change', () => {
      const { rerender } = render(
        <Content>
          <div>Original content</div>
        </Content>,
      );

      expect(screen.getByText('Original content')).toBeInTheDocument();

      rerender(
        <Content>
          <div>Changed content</div>
        </Content>,
      );

      expect(screen.getByText('Changed content')).toBeInTheDocument();
      expect(screen.queryByText('Original content')).not.toBeInTheDocument();
    });
  });
});
