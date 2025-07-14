# Testing Guide

This project uses **Jest** with **V8 coverage** and **React Testing Library** for comprehensive testing.

## Quick Start

### Running Tests

```bash
# Run all tests
npm test
# or
yarn test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test src/components/button/button.test.tsx
```

### Writing Tests

Create test files alongside your components with `.test.ts` or `.test.tsx` extension:

```typescript
// src/components/Hello.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from './Hello';

it('should render Hello component', () => {
  // 1. Arrange - Setup
  const expectedText = 'Hello, World!';

  // 2. Act - Render
  render(<Hello />);

  // 3. Assert - Verify
  expect(screen.getByText(expectedText)).toBeInTheDocument();
});
```

## Configuration

The project uses Jest with V8 coverage provider for better performance:

```typescript
// jest.config.ts
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

## Test Structure Best Practices

Follow the **Arrange-Act-Assert** (AAA) pattern:

```typescript
describe('ComponentName', () => {
  it('should handle user interaction', () => {
    // 1. Arrange - Variables and constants
    const mockHandler = jest.fn();
    const buttonText = 'Click me';

    // 2. Act - Render and interact
    render(<Button onClick={mockHandler}>{buttonText}</Button>);
    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);

    // 3. Assert - Verify behavior
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

## Coverage Reports

### HTML Report

- **Location**: `coverage/lcov-report/index.html`
- **Access**: Open the file in your browser to see interactive coverage details

### Console Output

The console shows a summary with coverage percentages for statements, branches, functions, and lines.

## Coverage Ignore Patterns

### In Code Comments

Use `c8` comments to ignore specific lines or blocks:

```javascript
// Ignore next line
/* c8 ignore next */
const unreachableCode = () => {};

// Ignore block
/* c8 ignore start */
function debugOnly() {
  console.log('Debug mode');
}
/* c8 ignore stop */
```

### In Configuration

Ignore entire files or directories from coverage:

```typescript
// jest.config.ts
const config: Config = {
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/src/types/', // Ignore type definition files
    '*.d.ts', // Ignore TypeScript declaration files
    '/src/constants/', // Ignore constants files
  ],
};
```

## Advanced Configuration

### Module Name Mapping

Configure path aliases for testing:

```typescript
moduleNameMapper: {
  '^@/(.*)': '<rootDir>/src/$1',
  '^@/components/(.*)$': '<rootDir>/components/$1',
  '@next/font/(.*)': '<rootDir>/test/__mocks__/nextFontMock.js',
  'server-only': '<rootDir>/test/__mocks__/empty.js',
},
```

## Troubleshooting

### Common Issues

1. **"Coverage threshold not met"**
   - Add more tests to reach the required coverage
   - Use `/* c8 ignore */` for legitimate uncoverable code
   - Review `coverageThreshold` settings

2. **Slow test execution**
   - V8 coverage is faster than Babel
   - Consider using `--maxWorkers=50%` for parallel execution
   - Use `--testPathIgnorePatterns` to exclude unnecessary files

3. **Module resolution errors**
   - Check `moduleNameMapper` in jest.config.ts
   - Ensure all aliases are properly configured
   - Verify mock files exist in `test/__mocks__/`

### Performance Tips

- Use `--coverage=false` during development
- Run specific test suites with `--testPathPattern`
- Utilize `--changedSince` for testing only modified files
- Consider `--watchAll=false` in automated environments

This ensures consistent test execution while maintaining high code quality standards.

# Testing Utilities

The purpose of this utility file is to streamline and enhance the testing process in a React project that uses Redux for state management, MUI (Material-UI) for theming and styling, and a custom `LocalizationProvider` for internationalization. It provides a convenient way to render components and hooks with all necessary providers, ensuring that tests run in an environment that closely mimics the actual application setup.

## Key Functions and Their Roles

### 1. `Wrapper` Component

The `Wrapper` component wraps children components with all the necessary providers:

- **Redux `Provider`**: Supplies the Redux store to the component tree.
- **`LocalizationProvider`**: Provides localization context to the component tree.
- **MUI `ThemeProvider` and `CssBaseline`**: Applies the custom theme and baseline styles to the component tree.

This ensures that any component rendered in the tests has access to the Redux store, theming, and localization, just like in the actual application.

### 2. `renderHookWithProviders` Function

This function is used to render React hooks in a testing environment with all the necessary providers:

- **Parameters**:
  - `render`: The hook rendering function.
  - `preloadedState`: Initial state for the Redux store (optional).
  - `store`: A Redux store instance (optional, will be created if not provided).
  - `renderOptions`: Additional options for the `renderHook` function from React Testing Library.

- **Returns**: An object containing the Redux store and all query functions provided by React Testing Library.

By using this function, hooks can be tested within the context of the Redux store, theming, and localization.

### 3. `renderWithProviders` Function

This function is used to render React components in a testing environment with all the necessary providers:

- **Parameters**:
  - `ui`: The React component to be rendered.
  - `preloadedState`: Initial state for the Redux store (optional).
  - `store`: A Redux store instance (optional, will be created if not provided).
  - `renderOptions`: Additional options for the `render` function from React Testing Library.

- **Returns**: An object containing the Redux store and all query functions provided by React Testing Library.

Using this function ensures that components are rendered with access to the Redux store, theming, and localization, making the tests more reliable and representative of the actual application environment.

## Benefits of Using the Utility File

- **Consistency**: Ensures that all tests run in an environment similar to the actual application, reducing the likelihood of issues due to missing providers.
- **Convenience**: Simplifies the setup of tests by providing pre-configured rendering functions, reducing boilerplate code.
- **Flexibility**: Allows for customization of the initial state and store, making it easier to test different scenarios and edge cases.

# Example: Using `renderWithProviders` Utility

Suppose we have a React component named `MyComponent` that we want to test. This component uses Redux for state management and relies on the MUI theme and localization context provided by `Wrapper`.

## MyComponent.js

```javascript
// MyComponent.ts
import React from 'react';
import { useSelector } from 'react-redux';

export const MyComponent = () => {
  const count = useSelector((state) => state.count);

  return (
    <div>
      <h1>Count: {count}</h1>
    </div>
  );
};
```

## MyComponent.test.js

```javascript
// MyComponent.test.ts
import React from 'react';

import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@test/utils/test-utils'; // Import the renderWithProviders utility

import MyComponent from './MyComponent';

it('renders MyComponent with initial count', () => {
  // Render MyComponent with renderWithProviders
  const { store } = renderWithProviders(<MyComponent />, {
    preloadedState: { count: 5 }, // Initialize the count to 5 for testing
  });

  // Assertion: Check if the component renders with the correct initial count
  expect(screen.getByText('Count: 5')).toBeInTheDocument();

  // Additional assertions or test logic can be added here
});
```
