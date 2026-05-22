import type { Todo } from '@/modules/todo/todo.types';

import { getMotivationalMessage } from './motivational-message.helper';

const createMockTodo = (id: number, completed: boolean): Todo => ({
  id,
  title: `Todo ${id}`,
  completed,
  priority: 'medium' as const,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
});

describe('getMotivationalMessage', () => {
  it('should return ready message for empty todo list', () => {
    const todos: Todo[] = [];

    expect(getMotivationalMessage(todos)).toBe('🚀 Ready to start your productivity journey!');
  });

  it('should return amazing message when all todos are completed', () => {
    const todos = [createMockTodo(1, true), createMockTodo(2, true), createMockTodo(3, true)];

    expect(getMotivationalMessage(todos)).toBe("🎉 Amazing! You've completed all your tasks!");
  });

  it('should return great progress message when more than half are completed', () => {
    const todos = [
      createMockTodo(1, true),
      createMockTodo(2, true),
      createMockTodo(3, true),
      createMockTodo(4, false),
      createMockTodo(5, false),
    ];

    // 3 out of 5 completed (60% > 50%)
    expect(getMotivationalMessage(todos)).toBe("💪 Great progress! You're more than halfway done!");
  });

  it('should return good start message when some todos are completed but less than half', () => {
    const todos = [
      createMockTodo(1, true),
      createMockTodo(2, false),
      createMockTodo(3, false),
      createMockTodo(4, false),
      createMockTodo(5, false),
    ];

    // 1 out of 5 completed (20% < 50%)
    expect(getMotivationalMessage(todos)).toBe('✨ Good start! Keep the momentum going!');
  });

  it('should return tackle message when no todos are completed', () => {
    const todos = [createMockTodo(1, false), createMockTodo(2, false), createMockTodo(3, false)];

    expect(getMotivationalMessage(todos)).toBe("🎯 Let's tackle these tasks one by one!");
  });

  it('should return amazing message for single completed todo', () => {
    const todos = [createMockTodo(1, true)];

    expect(getMotivationalMessage(todos)).toBe("🎉 Amazing! You've completed all your tasks!");
  });

  it('should return tackle message for single incomplete todo', () => {
    const todos = [createMockTodo(1, false)];

    expect(getMotivationalMessage(todos)).toBe("🎯 Let's tackle these tasks one by one!");
  });

  it('should handle exactly half completed todos', () => {
    const todos = [
      createMockTodo(1, true),
      createMockTodo(2, true),
      createMockTodo(3, false),
      createMockTodo(4, false),
    ];

    // 2 out of 4 completed (50%, not > 50%)
    expect(getMotivationalMessage(todos)).toBe('✨ Good start! Keep the momentum going!');
  });

  it('should handle large number of todos', () => {
    const todos = Array.from({ length: 100 }, (_, i) => createMockTodo(i, i < 60));

    // 60 out of 100 completed (60% > 50%)
    expect(getMotivationalMessage(todos)).toBe("💪 Great progress! You're more than halfway done!");
  });
});
