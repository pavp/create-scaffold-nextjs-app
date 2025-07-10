# Unit Testing with Jest in a React Project

## Introduction

In our project, we use [Jest](https://jestjs.io/) and [Jest for React](https://jestjs.io/docs/tutorial-react) to conduct unit tests. Jest is a popular JavaScript testing framework developed by Facebook, designed to ensure the correctness of any JavaScript codebase. It works well with React, making it a great choice for testing React components.

## Why Jest?

- **Easy to Set Up**: Jest is easy to install and configure, offering a simple setup process.
- **Rich API**: It provides a rich API for assertions, mocks, and more.
- **Snapshot Testing**: Jest supports snapshot testing, which is particularly useful for React components.
- **Fast and Safe**: Jest runs tests in parallel to maximize performance and generates unique global state for each test file.

# Running Unit Tests with Jest

## Steps to Run Unit Tests

1. **Write Test Files**:
   Create test files alongside your components, hooks or helpers. Test files should have a `.test.ts` or `.test.tsx` extension.

   Example test file for a React component:

   ```javascript
   // src/components/Hello.test.tsx
   import React from 'react';

   import { render, screen } from '@testing-library/react';

   import Hello from './Hello';

   it('should renders Hello component', () => {
     render(<Hello />);

     expect(screen.getByText('Hello, World!')).toBeInTheDocument();
   });
   ```

2. **Run tests**:

   ```bash
   npm run test
   ```

# Jest Utilities

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
