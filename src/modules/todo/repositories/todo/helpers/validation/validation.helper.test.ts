import { validateTodoData } from './validation.helper';

describe('validateTodoData', () => {
  describe('valid cases', () => {
    it('should pass validation for valid todo data', () => {
      expect(() => {
        validateTodoData({ title: 'Valid title' });
      }).not.toThrow();
    });

    it('should pass validation for title with exactly 200 characters', () => {
      const maxTitle = 'a'.repeat(200);

      expect(() => {
        validateTodoData({ title: maxTitle });
      }).not.toThrow();
    });

    it('should pass validation for title with special characters', () => {
      expect(() => {
        validateTodoData({ title: 'TODO: Fix bug #123 @priority:high' });
      }).not.toThrow();
    });

    it('should pass validation for title with emojis', () => {
      expect(() => {
        validateTodoData({ title: '🚀 Deploy app to production' });
      }).not.toThrow();
    });

    it('should pass validation for title with numbers', () => {
      expect(() => {
        validateTodoData({ title: 'Task 001: Initialize project v2.0' });
      }).not.toThrow();
    });

    it('should pass validation for single character title', () => {
      expect(() => {
        validateTodoData({ title: 'A' });
      }).not.toThrow();
    });
  });

  describe('invalid cases - empty/missing title', () => {
    it('should throw error for missing title property', () => {
      expect(() => {
        validateTodoData({});
      }).toThrow('Todo title is required and cannot be empty');
    });

    it('should throw error for undefined title', () => {
      expect(() => {
        validateTodoData({ title: undefined });
      }).toThrow('Todo title is required and cannot be empty');
    });

    it('should throw error for null title', () => {
      expect(() => {
        validateTodoData({ title: null as any });
      }).toThrow('Todo title is required and cannot be empty');
    });

    it('should throw error for empty string title', () => {
      expect(() => {
        validateTodoData({ title: '' });
      }).toThrow('Todo title is required and cannot be empty');
    });

    it('should throw error for whitespace-only title', () => {
      expect(() => {
        validateTodoData({ title: '   ' });
      }).toThrow('Todo title is required and cannot be empty');
    });

    it('should throw error for tabs and newlines only', () => {
      expect(() => {
        validateTodoData({ title: '\t\n\r  \t' });
      }).toThrow('Todo title is required and cannot be empty');
    });
  });

  describe('invalid cases - title too long', () => {
    it('should throw error for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);

      expect(() => {
        validateTodoData({ title: longTitle });
      }).toThrow('Todo title cannot exceed 200 characters');
    });

    it('should throw error for title with 500 characters', () => {
      const veryLongTitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10); // ~500 chars

      expect(() => {
        validateTodoData({ title: veryLongTitle });
      }).toThrow('Todo title cannot exceed 200 characters');
    });

    it('should throw error for title with exactly 201 characters', () => {
      const longTitle = 'x'.repeat(201);

      expect(() => {
        validateTodoData({ title: longTitle });
      }).toThrow('Todo title cannot exceed 200 characters');
    });
  });

  describe('edge cases', () => {
    it('should handle title with leading/trailing spaces (after trim)', () => {
      expect(() => {
        validateTodoData({ title: '  Valid title  ' });
      }).not.toThrow();
    });

    it('should handle title that becomes empty after trimming', () => {
      expect(() => {
        validateTodoData({ title: '     ' });
      }).toThrow('Todo title is required and cannot be empty');
    });

    it('should handle title with mixed whitespace characters', () => {
      expect(() => {
        validateTodoData({ title: 'Valid\ttitle\nwith\rwhitespace' });
      }).not.toThrow();
    });
  });
});
