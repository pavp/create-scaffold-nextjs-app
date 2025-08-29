import { getPriorityColor } from './priority-color.helper';

describe('getPriorityColor', () => {
  it('should return red color for high priority', () => {
    expect(getPriorityColor('high')).toBe('#ff4757');
  });

  it('should return orange color for medium priority', () => {
    expect(getPriorityColor('medium')).toBe('#ffa726');
  });

  it('should return green color for low priority', () => {
    expect(getPriorityColor('low')).toBe('#66bb6a');
  });

  it('should return medium color for unknown priority', () => {
    expect(getPriorityColor('unknown')).toBe('#ffa726');
  });

  it('should return medium color for empty string', () => {
    expect(getPriorityColor('')).toBe('#ffa726');
  });

  it('should return medium color for null/undefined-like strings', () => {
    expect(getPriorityColor('null')).toBe('#ffa726');
    expect(getPriorityColor('undefined')).toBe('#ffa726');
  });

  it('should be case sensitive (uppercase should fallback to medium)', () => {
    expect(getPriorityColor('HIGH')).toBe('#ffa726');
    expect(getPriorityColor('MEDIUM')).toBe('#ffa726');
    expect(getPriorityColor('LOW')).toBe('#ffa726');
  });

  it('should handle whitespace-padded priorities by fallback', () => {
    expect(getPriorityColor(' high ')).toBe('#ffa726');
    expect(getPriorityColor(' medium ')).toBe('#ffa726');
    expect(getPriorityColor(' low ')).toBe('#ffa726');
  });

  it('should handle special characters by fallback', () => {
    expect(getPriorityColor('high!')).toBe('#ffa726');
    expect(getPriorityColor('medium@')).toBe('#ffa726');
    expect(getPriorityColor('low#')).toBe('#ffa726');
  });

  it('should handle numeric strings by fallback', () => {
    expect(getPriorityColor('1')).toBe('#ffa726');
    expect(getPriorityColor('2')).toBe('#ffa726');
    expect(getPriorityColor('3')).toBe('#ffa726');
  });
});
