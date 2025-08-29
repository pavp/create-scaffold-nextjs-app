/**
 * Format date relative to current date
 */
export const formatRelativeDate = (date: string): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 0) return `In ${diffInDays} days`;

  return `${Math.abs(diffInDays)} days ago`;
};
