import { describe, it, expect } from 'vitest';
import { formatDate } from '../../utils/helpers'; // Assuming formatDate exists

describe('Helper Functions', () => {
  it('formatDate should format a date correctly', () => {
    const date = new Date('2023-10-27T10:00:00Z');
    expect(formatDate(date, 'SHORT')).toBe('10/27/2023');
  });
});