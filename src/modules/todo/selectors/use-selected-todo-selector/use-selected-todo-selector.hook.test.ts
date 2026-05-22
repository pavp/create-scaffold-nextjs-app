/**
 * @jest-environment jsdom
 */

import { renderHookWithProviders, setupTodoStoreState } from '@test/utils';

import { useSelectedTodoSelector } from './use-selected-todo-selector.hook';

const mockTodo = {
  id: 1,
  title: 'Test Todo',
  completed: false,
  priority: 'medium' as const,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

describe('useSelectedTodoSelector', () => {
  it('should return selected todo from store', () => {
    const { result } = renderHookWithProviders(() => useSelectedTodoSelector(), {
      initialStoreStates: {
        todo: setupTodoStoreState({
          selectedTodo: mockTodo,
        }),
      },
    });

    expect(result.current.selectedTodo).toEqual(mockTodo);
  });

  it('should return null when no todo is selected', () => {
    const { result } = renderHookWithProviders(() => useSelectedTodoSelector(), {
      initialStoreStates: {
        todo: setupTodoStoreState({
          selectedTodo: null,
        }),
      },
    });

    expect(result.current.selectedTodo).toBeNull();
  });

  it('should return undefined when selectedTodo is undefined', () => {
    const { result } = renderHookWithProviders(() => useSelectedTodoSelector(), {
      initialStoreStates: {
        todo: setupTodoStoreState({
          selectedTodo: undefined,
        }),
      },
    });

    expect(result.current.selectedTodo).toBeUndefined();
  });

  it('should handle default store state', () => {
    const { result } = renderHookWithProviders(() => useSelectedTodoSelector());

    expect(result.current).toHaveProperty('selectedTodo');
  });

  it('should handle complete todo object', () => {
    const completeTodo = {
      ...mockTodo,
      description: 'Test description',
      completed: true,
      priority: 'high' as const,
    };

    const { result } = renderHookWithProviders(() => useSelectedTodoSelector(), {
      initialStoreStates: {
        todo: setupTodoStoreState({
          selectedTodo: completeTodo,
        }),
      },
    });

    expect(result.current.selectedTodo).toEqual(completeTodo);
  });
});
