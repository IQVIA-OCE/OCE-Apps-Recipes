import { formatAmount } from './formatAmount';

describe('formatAmount', () => {
  test('should return amount with currency symbol if ISO code exists in list', () => {
    const result = formatAmount(1000.56, 'USD');
    expect(result).toBe('$1000.56');
  });

  test('should return amount with currency ISO code if ISO code does not exist in list', () => {
    const result = formatAmount(1000.56, 'SEK');
    expect(result).toBe('SEK 1000.56');
  });

  test('should return empty string if amount is NULL', () => {
    const result = formatAmount(null, 'USD');
    expect(result).toBe('');
  });
});
