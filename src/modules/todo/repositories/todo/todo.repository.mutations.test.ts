/**
 * @jest-environment jsdom
 */

import { act, renderHookWithProviders, waitFor } from '@test/utils';

import { createTodoGateway } from './gateways';
import { todoQueryKeys } from './todo.repository.keys';
import { todoMutationsRepository } from './todo.repository.mutations';

// Mock dependencies
jest.mock('./gateways', () => ({
  createTodoGateway: jest.fn(),
}));

const mockedCreateTodoGateway = createTodoGateway as jest.MockedFunction<typeof createTodoGateway>;

// Mock data
const mockTodo = {
  id: 1,
  title: 'Test Todo',
  completed: false,
  priority: 'medium' as const,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockCreatedTodo = {
  id: 2,
  title: 'New Todo',
  completed: false,
  priority: 'high' as const,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockUpdatedTodo = {
  ...mockTodo,
  title: 'Updated Todo',
  completed: true,
  updatedAt: '2023-01-01T01:00:00Z',
};

describe('todoMutationsRepository', () => {
  let mockGateway: any;

  beforeAll(() => {
    mockGateway = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockedCreateTodoGateway.mockReturnValue(mockGateway);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset default implementations
    mockGateway.create.mockResolvedValue(mockCreatedTodo);
    mockGateway.update.mockResolvedValue(mockUpdatedTodo);
    mockGateway.delete.mockResolvedValue(undefined);
  });

  describe('useCreateTodo', () => {
    it('should create todo successfully with correct data source', async () => {
      const { result } = renderHookWithProviders(() => todoMutationsRepository.useCreateTodo('localStorage'), {
        queryClientOptions: { retry: false },
      });

      const todoData = { title: 'New Todo', priority: 'high' as const };

      act(() => {
        result.current.mutate(todoData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('localStorage');
      expect(mockGateway.create).toHaveBeenCalledWith(todoData);
      expect(result.current.data).toEqual(mockCreatedTodo);
    });

    it('should use http as default data source', async () => {
      const { result } = renderHookWithProviders(() => todoMutationsRepository.useCreateTodo(), {
        queryClientOptions: { retry: false },
      });

      const todoData = { title: 'New Todo', priority: 'high' as const };

      act(() => {
        result.current.mutate(todoData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('http');
    });

    it('should invalidate queries on success', async () => {
      const { result, queryClient } = renderHookWithProviders(() => todoMutationsRepository.useCreateTodo(), {
        queryClientOptions: { retry: false },
      });

      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
      const setQueryDataSpy = jest.spyOn(queryClient, 'setQueryData');

      act(() => {
        result.current.mutate({ title: 'New Todo' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: todoQueryKeys.lists() });
      expect(setQueryDataSpy).toHaveBeenCalledWith(todoQueryKeys.lists(), expect.any(Function));
    });
  });

  describe('useUpdateTodo', () => {
    it('should update todo successfully with correct data source', async () => {
      const { result } = renderHookWithProviders(() => todoMutationsRepository.useUpdateTodo('localStorage'), {
        queryClientOptions: { retry: false },
      });

      const updateData = { id: 1, data: { title: 'Updated Todo', completed: true } };

      act(() => {
        result.current.mutate(updateData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('localStorage');
      expect(mockGateway.update).toHaveBeenCalledWith(1, { title: 'Updated Todo', completed: true });
      expect(result.current.data).toEqual(mockUpdatedTodo);
    });

    it('should use http as default data source', async () => {
      const { result } = renderHookWithProviders(() => todoMutationsRepository.useUpdateTodo(), {
        queryClientOptions: { retry: false },
      });

      const updateData = { id: 1, data: { title: 'Updated Todo', completed: true } };

      act(() => {
        result.current.mutate(updateData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('http');
    });

    it('should update cache on success', async () => {
      const { result, queryClient } = renderHookWithProviders(() => todoMutationsRepository.useUpdateTodo(), {
        queryClientOptions: { retry: false },
      });

      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
      const setQueryDataSpy = jest.spyOn(queryClient, 'setQueryData');

      act(() => {
        result.current.mutate({ id: 1, data: { title: 'Updated' } });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(setQueryDataSpy).toHaveBeenCalledWith(todoQueryKeys.lists(), expect.any(Function));
      expect(setQueryDataSpy).toHaveBeenCalledWith(todoQueryKeys.detail(1), mockUpdatedTodo);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: todoQueryKeys.lists() });
    });
  });

  describe('useDeleteTodo', () => {
    it('should delete todo successfully with correct data source', async () => {
      const { result } = renderHookWithProviders(() => todoMutationsRepository.useDeleteTodo('localStorage'), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('localStorage');
      expect(mockGateway.delete).toHaveBeenCalledWith(1);
    });

    it('should use http as default data source', async () => {
      const { result } = renderHookWithProviders(() => todoMutationsRepository.useDeleteTodo(), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('http');
    });

    it('should update cache on success', async () => {
      const { result, queryClient } = renderHookWithProviders(() => todoMutationsRepository.useDeleteTodo(), {
        queryClientOptions: { retry: false },
      });

      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
      const setQueryDataSpy = jest.spyOn(queryClient, 'setQueryData');
      const removeQueriesSpy = jest.spyOn(queryClient, 'removeQueries');

      act(() => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(setQueryDataSpy).toHaveBeenCalledWith(todoQueryKeys.lists(), expect.any(Function));
      expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: todoQueryKeys.detail(1) });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: todoQueryKeys.lists() });
    });
  });

  describe('useBulkDeleteTodos', () => {
    it('should bulk delete todos successfully with correct data source', async () => {
      const { result } = renderHookWithProviders(() => todoMutationsRepository.useBulkDeleteTodos('localStorage'), {
        queryClientOptions: { retry: false },
      });

      const idsToDelete = [1, 2, 3];

      act(() => {
        result.current.mutate(idsToDelete);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('localStorage');
      expect(mockGateway.delete).toHaveBeenCalledTimes(3);
      expect(mockGateway.delete).toHaveBeenCalledWith(1);
      expect(mockGateway.delete).toHaveBeenCalledWith(2);
      expect(mockGateway.delete).toHaveBeenCalledWith(3);
      expect(result.current.data).toEqual(idsToDelete);
    });

    it('should use http as default data source', async () => {
      const { result } = renderHookWithProviders(() => todoMutationsRepository.useBulkDeleteTodos(), {
        queryClientOptions: { retry: false },
      });

      const idsToDelete = [1, 2];

      act(() => {
        result.current.mutate(idsToDelete);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('http');
    });

    it('should update cache on success', async () => {
      const { result, queryClient } = renderHookWithProviders(() => todoMutationsRepository.useBulkDeleteTodos(), {
        queryClientOptions: { retry: false },
      });

      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
      const setQueryDataSpy = jest.spyOn(queryClient, 'setQueryData');
      const removeQueriesSpy = jest.spyOn(queryClient, 'removeQueries');

      const idsToDelete = [1, 2];

      act(() => {
        result.current.mutate(idsToDelete);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(setQueryDataSpy).toHaveBeenCalledWith(todoQueryKeys.lists(), expect.any(Function));
      expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: todoQueryKeys.detail(1) });
      expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: todoQueryKeys.detail(2) });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: todoQueryKeys.lists() });
    });
  });

  describe('useTestError', () => {
    it('should test error scenarios with correct data source', async () => {
      const errorResponse = { error: 'Test error' };

      mockGateway.testError = jest.fn().mockResolvedValue(errorResponse);

      const { result } = renderHookWithProviders(() => todoMutationsRepository.useTestError('localStorage'), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate('validation');
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('localStorage');
      expect(mockGateway.testError).toHaveBeenCalledWith('validation');
      expect(result.current.data).toEqual(errorResponse);
    });

    it('should use http as default data source', async () => {
      const errorResponse = { error: 'Test error' };

      mockGateway.testError = jest.fn().mockResolvedValue(errorResponse);

      const { result } = renderHookWithProviders(() => todoMutationsRepository.useTestError(), {
        queryClientOptions: { retry: false },
      });

      act(() => {
        result.current.mutate('validation');
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCreateTodoGateway).toHaveBeenCalledWith('http');
    });

    it('should handle error testing failures', async () => {
      const error = new Error('Error test failed');

      mockGateway.testError = jest.fn().mockRejectedValue(error);

      const { result } = renderHookWithProviders(() => todoMutationsRepository.useTestError(), {
        queryClientOptions: { retry: false },
      });

      result.current.mutate('server');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });
});
