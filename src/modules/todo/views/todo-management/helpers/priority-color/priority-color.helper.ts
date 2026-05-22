/**
 * Get priority color for todo items
 */
export const getPriorityColor = (priority: string): string => {
  const colors = {
    high: '#ff4757',
    medium: '#ffa726',
    low: '#66bb6a',
  };

  return colors[priority as keyof typeof colors] || colors.medium;
};
