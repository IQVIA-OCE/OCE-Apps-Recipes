import { formatDate } from './dateTimeFormat';

describe('formatDate', () => {
  it('should format empty date as datetime', () => {
    const result = formatDate('2021-05-12T19:00:00.000Z'); // 2019-10-30T00:00Z0 (GMT)
    expect(result).toBe('May 12, 2021');
  });

  it('should return empty field', () => {
    const result = formatDate('2021-6368879202.000Z');
    expect(result).toBeNull();
  });
});
