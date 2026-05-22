/**
 * @jest-environment jsdom
 */

import { createMockCreateTodoRequest, createMockUpdateTodoRequest } from '@test/entities/todo.mock';

import type { CreateTodoRequest, Todo, UpdateTodoRequest } from '@/modules/todo/todo.types';

import { createLocalStorageTodoGateway } from './local-storage-gateway';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LocalStorage Todo Gateway', () => {
  let gateway: ReturnType<typeof createLocalStorageTodoGateway>;
  let mockTodoRequest: CreateTodoRequest;
  let mockUpdateRequest: UpdateTodoRequest;
  const testStorageKey = 'test_todos';

  beforeAll(() => {
    // Create reusable test data using faker factories
    mockTodoRequest = createMockCreateTodoRequest({
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'medium', // Ensure default priority for consistent testing
    });
    mockUpdateRequest = createMockUpdateTodoRequest({
      title: 'Updated Title',
      priority: 'high',
      completed: true,
    });
  });

  beforeEach(() => {
    // Clear localStorage and create fresh gateway
    localStorage.clear();
    gateway = createLocalStorageTodoGateway(testStorageKey);
  });

  describe('create', () => {
    it('should create a todo with default values', async () => {
      const created = await gateway.create(mockTodoRequest);

      expect(created.title).toBe(mockTodoRequest.title);
      expect(created.description).toBe(mockTodoRequest.description);
      expect(created.completed).toBe(false);
      expect(created.priority).toBe('medium');
      expect(created.id).toBeDefined();
      expect(created.createdAt).toBeDefined();
      expect(created.updatedAt).toBeDefined();
    });

    it('should create a todo with specified priority', async () => {
      const highPriorityRequest = createMockCreateTodoRequest({
        title: 'High Priority Task',
        priority: 'high',
      });

      const created = await gateway.create(highPriorityRequest);

      expect(created.priority).toBe('high');
      expect(created.title).toBe(highPriorityRequest.title);
    });

    it('should persist todo in localStorage', async () => {
      const persistentRequest = createMockCreateTodoRequest({
        title: 'Persistent Todo',
        priority: 'low',
      });

      await gateway.create(persistentRequest);

      // Check that data is stored in localStorage
      const stored = localStorage.getItem(testStorageKey);

      expect(stored).toBeTruthy();

      const todos = JSON.parse(stored!);

      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('Persistent Todo');
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      // Create test data using faker factories
      await gateway.create(createMockCreateTodoRequest({ title: 'Buy groceries', priority: 'medium' }));
      await gateway.create(createMockCreateTodoRequest({ title: 'Walk the dog', priority: 'low' }));
      await gateway.create(createMockCreateTodoRequest({ title: 'Finish project', priority: 'high' }));
    });

    it('should return all todos when no filters', async () => {
      const todos = await gateway.findAll();

      expect(todos).toHaveLength(3);
    });

    it('should filter todos by search term', async () => {
      const filtered = await gateway.findAll({ search: 'groceries' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Buy groceries');
    });

    it('should filter todos by priority', async () => {
      const highPriorityTodos = await gateway.findAll({ priority: 'high' });

      expect(highPriorityTodos).toHaveLength(1);
      expect(highPriorityTodos[0].title).toBe('Finish project');
    });

    it('should filter todos by completed status', async () => {
      // Mark one todo as completed
      const todos = await gateway.findAll();

      await gateway.update(todos[0].id, { completed: true });

      const completedTodos = await gateway.findAll({ completed: true });
      const pendingTodos = await gateway.findAll({ completed: false });

      expect(completedTodos).toHaveLength(1);
      expect(pendingTodos).toHaveLength(2);
    });

    it('should combine multiple filters', async () => {
      await gateway.create(
        createMockCreateTodoRequest({
          title: 'High priority groceries',
          priority: 'high',
          description: 'Buy organic groceries',
        }),
      );

      const filtered = await gateway.findAll({
        search: 'groceries',
        priority: 'high',
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('High priority groceries');
    });
  });

  describe('findById', () => {
    it('should return a todo by id', async () => {
      const testRequest = createMockCreateTodoRequest({ title: 'Test Todo', priority: 'medium' });
      const created = await gateway.create(testRequest);
      const found = await gateway.findById(created.id);

      expect(found.id).toBe(created.id);
      expect(found.title).toBe(created.title);
    });

    it('should throw error if todo not found', async () => {
      await expect(gateway.findById('non-existent-id')).rejects.toThrow('Todo with id non-existent-id not found');
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const originalRequest = createMockCreateTodoRequest({ title: 'Original Title', priority: 'low' });
      const created = await gateway.create(originalRequest);

      // Mock Date to ensure different timestamp
      const originalNow = Date.now;
      const mockTime = originalNow() + 1000;

      Date.now = jest.fn(() => mockTime);

      const updated = await gateway.update(created.id, mockUpdateRequest);

      // Restore Date
      Date.now = originalNow;

      expect(updated.title).toBe(mockUpdateRequest.title);
      expect(updated.priority).toBe(mockUpdateRequest.priority);
      expect(updated.completed).toBe(mockUpdateRequest.completed);
      expect(updated.id).toBe(created.id);
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(created.updatedAt).getTime());
    });

    it('should persist updates in localStorage', async () => {
      const originalRequest = createMockCreateTodoRequest({ title: 'Original', priority: 'low' });
      const created = await gateway.create(originalRequest);

      const titleUpdate = createMockUpdateTodoRequest({ title: 'Updated' });

      await gateway.update(created.id, titleUpdate);

      // Check localStorage directly
      const stored = localStorage.getItem(testStorageKey);
      const todos = JSON.parse(stored!);

      expect(todos[0].title).toBe(titleUpdate.title);
    });

    it('should throw error if todo not found', async () => {
      const updateRequest = createMockUpdateTodoRequest({ title: 'New Title' });

      await expect(gateway.update('non-existent-id', updateRequest)).rejects.toThrow(
        'Todo with id non-existent-id not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      const deleteRequest = createMockCreateTodoRequest({ title: 'To be deleted', priority: 'medium' });
      const created = await gateway.create(deleteRequest);

      await gateway.delete(created.id);

      // Should not find the deleted todo
      await expect(gateway.findById(created.id)).rejects.toThrow();

      // Should not appear in list
      const todos = await gateway.findAll();

      expect(todos.find((t: Todo) => t.id === created.id)).toBeUndefined();
    });

    it('should remove todo from localStorage', async () => {
      const deleteRequest = createMockCreateTodoRequest({ title: 'To be deleted', priority: 'medium' });
      const created = await gateway.create(deleteRequest);

      await gateway.delete(created.id);

      // Check localStorage directly
      const stored = localStorage.getItem(testStorageKey);
      const todos = JSON.parse(stored!);

      expect(todos).toHaveLength(0);
    });

    it('should throw error if todo not found', async () => {
      await expect(gateway.delete('non-existent-id')).rejects.toThrow('Todo with id non-existent-id not found');
    });
  });

  describe('getSourceInfo', () => {
    it('should return correct source information', () => {
      const info = gateway.getSourceInfo();

      expect(info.type).toBe('localStorage');
      expect(info.name).toBe('Local Storage Gateway');
      expect(info.capabilities.offline).toBe(true);
      expect(info.capabilities.realtime).toBe(false);
      expect(info.capabilities.persistence).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw errors
      const originalSetItem = localStorage.setItem;

      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const errorRequest = createMockCreateTodoRequest({
        title: 'Test Todo',
        priority: 'medium',
      });

      await expect(gateway.create(errorRequest)).rejects.toThrow('Failed to save todos to localStorage');

      // Restore original method
      localStorage.setItem = originalSetItem;
    });

    it('should return empty array when localStorage is corrupted', async () => {
      // Put invalid JSON in localStorage
      localStorage.setItem(testStorageKey, 'invalid json');

      const todos = await gateway.findAll();

      expect(todos).toEqual([]);
    });
  });
});
