/**
 * @jest-environment jsdom
 */
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { renderWithProviders, screen } from '@test/utils';

import { config } from '@/config';
import { getQueryClient } from '@/core/lib/react-query/query-client';

import { ReactQueryProvider } from './react-query-provider.component';

// Mock the config
jest.mock('@/config', () => ({
  config: {
    isDev: false,
  },
}));

// Mock the getQueryClient function
jest.mock('@/core/lib/react-query/query-client', () => ({
  getQueryClient: jest.fn(),
}));

// Mock React Query DevTools
jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: ({ children }: { children: React.ReactNode }) => <div data-testid="devtools">{children}</div>,
}));

const mockConfig = config as jest.Mocked<typeof config>;
const mockGetQueryClient = getQueryClient as jest.MockedFunction<typeof getQueryClient>;

describe('ReactQueryProvider', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQueryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockGetQueryClient.mockReturnValue(mockQueryClient);
    mockConfig.isDev = false;
  });

  it('should render children wrapped in QueryClientProvider', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;

    renderWithProviders(
      <ReactQueryProvider>
        <TestChild />
      </ReactQueryProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(mockGetQueryClient).toHaveBeenCalledTimes(1);
  });

  it('should use the query client from getQueryClient', () => {
    const TestChild = () => <div>Child</div>;

    renderWithProviders(
      <ReactQueryProvider>
        <TestChild />
      </ReactQueryProvider>,
    );

    expect(mockGetQueryClient).toHaveBeenCalledTimes(1);
  });

  it('should not render DevTools in production', () => {
    mockConfig.isDev = false;
    const TestChild = () => <div data-testid="test-child">Test Content</div>;

    renderWithProviders(
      <ReactQueryProvider>
        <TestChild />
      </ReactQueryProvider>,
    );

    expect(screen.queryByTestId('devtools')).not.toBeInTheDocument();
  });

  it('should render DevTools in development', () => {
    mockConfig.isDev = true;
    const TestChild = () => <div data-testid="test-child">Test Content</div>;

    renderWithProviders(
      <ReactQueryProvider>
        <TestChild />
      </ReactQueryProvider>,
    );

    expect(screen.getByTestId('devtools')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should use QueryClientProvider with correct client', () => {
    const TestChild = () => <div data-testid="test-child">Child</div>;

    renderWithProviders(
      <ReactQueryProvider>
        <TestChild />
      </ReactQueryProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(mockGetQueryClient).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple children', () => {
    renderWithProviders(
      <ReactQueryProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ReactQueryProvider>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should create a new query client instance on each render', () => {
    const TestChild = () => <div>Child</div>;

    const { rerender } = renderWithProviders(
      <ReactQueryProvider>
        <TestChild />
      </ReactQueryProvider>,
    );

    expect(mockGetQueryClient).toHaveBeenCalledTimes(1);

    rerender(
      <ReactQueryProvider>
        <TestChild />
      </ReactQueryProvider>,
    );

    expect(mockGetQueryClient).toHaveBeenCalledTimes(2);
  });
});
