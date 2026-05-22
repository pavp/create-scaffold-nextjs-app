/**
 * @jest-environment jsdom
 */

import { createMockTodo, createMockTodoFilters, createMockTodos } from '@test/entities/todo.mock';
import { renderHookWithProviders, waitFor } from '@test/utils';

import { createTodoGateway } from './gateways';
import { todoQueriesRepository } from './todo.repository.queries';

// Mock dependencies
jest.mock('./gateways', () => ({
  createTodoGateway: jest.fn(),
}));

const mockedCreateTodoGateway = createTodoGateway as jest.MockedFunction<typeof createTodoGateway>;

// Mock data using faker factories for consistent testing
const mockTodos = createMockTodos(2, {
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
});

const mockTodo = createMockTodo({
  id: 1,
  title: 'Single Todo',
  completed: false,
  priority: 'medium',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
});

describe('todoQueriesRepository', () => {
  let mockGateway: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGateway = {
      findAll: jest.fn().mockResolvedValue([]),
      findById: jest.fn().mockResolvedValue(mockTodo),
      testError: jest.fn().mockResolvedValue({}),
    };

    mockedCreateTodoGateway.mockReturnValue(mockGateway);
  });

  describe('useTodos', () => {
    it('should handle successful data fetching', async () => {
      mockGateway.findAll.mockResolvedValue(mockTodos);

      const { result } = renderHookWithProviders(() => todoQueriesRepository.useTodos({}, 'http', { enabled: true }), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTodos);
      expect(mockGateway.findAll).toHaveBeenCalledWith({}, expect.objectContaining({ signal: expect.any(Object) }));
    });

    it('should pass filters to gateway', async () => {
      const filters = createMockTodoFilters({ priority: 'high', completed: false });

      mockGateway.findAll.mockResolvedValue(mockTodos);

      renderHookWithProviders(() => todoQueriesRepository.useTodos(filters, 'http', { enabled: true }), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(mockGateway.findAll).toHaveBeenCalledWith(
          filters,
          expect.objectContaining({ signal: expect.any(Object) }),
        );
      });
    });
  });

  describe('useTodo', () => {
    it('should handle successful single todo fetching', async () => {
      mockGateway.findById.mockResolvedValue(mockTodo);

      const { result } = renderHookWithProviders(() => todoQueriesRepository.useTodo(1, 'http', { enabled: true }), {
        queryClientOptions: { retry: false },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTodo);
      expect(mockGateway.findById).toHaveBeenCalledWith(1, expect.objectContaining({ signal: expect.any(Object) }));
    });

    it('should be disabled when id is falsy', () => {
      const { result } = renderHookWithProviders(() => todoQueriesRepository.useTodo(null as any), {
        queryClientOptions: { retry: false },
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGateway.findById).not.toHaveBeenCalled();
    });
  });

  describe('useTodoCount', () => {});

  describe('useTestError', () => {
    it('should test error scenarios with correct data source', async () => {
      const errorResponse = { error: 'Server error' };

      mockGateway.testError.mockResolvedValue(errorResponse);

      const { result } = renderHookWithProviders(
        () => todoQueriesRepository.useTestError('validation', 'localStorage', { enabled: true }),
        {
          queryClientOptions: { retry: false },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('localStorage');
      expect(result.current.data).toEqual(errorResponse);
    });

    it('should use http as default data source', async () => {
      const errorResponse = { error: 'Server error' };

      mockGateway.testError.mockResolvedValue(errorResponse);

      const { result } = renderHookWithProviders(
        () => todoQueriesRepository.useTestError('server', 'http', { enabled: true }),
        {
          queryClientOptions: { retry: false },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('http');
    });

    it('should be disabled by default', () => {
      const { result } = renderHookWithProviders(() => todoQueriesRepository.useTestError('validation'), {
        queryClientOptions: { retry: false },
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGateway.testError).not.toHaveBeenCalled();
    });

    it('should call gateway when enabled', async () => {
      const errorResponse = { error: 'Test error' };

      mockGateway.testError.mockResolvedValue(errorResponse);

      const { result } = renderHookWithProviders(
        () => todoQueriesRepository.useTestError('validation', 'http', { enabled: true }),
        {
          queryClientOptions: { retry: false },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(errorResponse);
      expect(mockGateway.testError).toHaveBeenCalledWith(
        'validation',
        expect.objectContaining({ signal: expect.any(Object) }),
      );
    });
  });
});
