import { formatRelativeDate } from './date-format.helper';

// Mock Date to have consistent tests
const mockToday = new Date('2023-06-15T12:00:00Z');

describe('formatRelativeDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockToday);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return "Today" for same day', () => {
    const today = '2023-06-15T10:00:00Z';

    expect(formatRelativeDate(today)).toBe('Today');
  });

  it('should return "Tomorrow" for next day', () => {
    const tomorrow = '2023-06-16T10:00:00Z';

    expect(formatRelativeDate(tomorrow)).toBe('Tomorrow');
  });

  it('should return "Yesterday" for previous day', () => {
    const yesterday = '2023-06-14T10:00:00Z';

    expect(formatRelativeDate(yesterday)).toBe('Yesterday');
  });

  it('should return "In X days" for future dates', () => {
    const futureDate = '2023-06-20T10:00:00Z';

    expect(formatRelativeDate(futureDate)).toBe('In 5 days');
  });

  it('should return "X days ago" for past dates', () => {
    const pastDate = '2023-06-10T10:00:00Z';

    expect(formatRelativeDate(pastDate)).toBe('5 days ago');
  });

  it('should handle edge cases with time differences within same day', () => {
    // Time earlier in the same day
    const sameDay = '2023-06-15T10:00:00Z';

    expect(formatRelativeDate(sameDay)).toBe('Today');
  });

  it('should handle very early time on next day', () => {
    const nextDay = '2023-06-16T00:00:01Z';

    expect(formatRelativeDate(nextDay)).toBe('Tomorrow');
  });

  it('should handle large future differences', () => {
    const farFuture = '2023-07-15T10:00:00Z';

    expect(formatRelativeDate(farFuture)).toBe('In 30 days');
  });

  it('should handle large past differences', () => {
    const farPast = '2023-05-15T10:00:00Z';

    expect(formatRelativeDate(farPast)).toBe('31 days ago');
  });

  it('should handle invalid date strings gracefully', () => {
    const invalidDate = 'invalid-date';
    const result = formatRelativeDate(invalidDate);

    expect(result).toBe('NaN days ago');
  });
});
