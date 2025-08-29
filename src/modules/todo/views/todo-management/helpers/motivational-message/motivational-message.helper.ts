import type { Todo } from '@/modules/todo/todo.types';

/**
 * Get motivational message based on completion status
 */
export const getMotivationalMessage = (todos: Todo[]): string => {
  const completed = todos.filter((t) => t.completed).length;
  const total = todos.length;

  if (total === 0) return '🚀 Ready to start your productivity journey!';
  if (completed === total) return "🎉 Amazing! You've completed all your tasks!";
  if (completed > total / 2) return "💪 Great progress! You're more than halfway done!";
  if (completed > 0) return '✨ Good start! Keep the momentum going!';

  return "🎯 Let's tackle these tasks one by one!";
};
