import { sortDates, sortNumbers, sortStrings } from './tableUtils';

describe('tableUtils', () => {
  describe('sortStrings() should sort string values', () => {
    test('ascending sort order', () => {
      expect(
        sortStrings('value', 'ascending', { value: 'A' }, { value: 'B' })
      ).toEqual(-1);
      expect(
        sortStrings('value', 'ascending', { value: 'B' }, { value: 'A' })
      ).toEqual(1);
      expect(
        sortStrings('value', 'ascending', { value: 'A' }, { value: 'A' })
      ).toEqual(0);
    });

    test('descending sort order', () => {
      expect(
        sortStrings('value', 'descending', { value: 'A' }, { value: 'B' })
      ).toEqual(1);
      expect(
        sortStrings('value', 'descending', { value: 'B' }, { value: 'A' })
      ).toEqual(-1);
      expect(
        sortStrings('value', 'descending', { value: 'A' }, { value: 'A' })
      ).toEqual(0);
    });

    test('undefined values', () => {
      expect(sortStrings('value', 'ascending', {}, {})).toEqual(0);
    });
  });

  describe('sortDates() should sort number values (timestamps)', () => {
    test('ascending sort order', () => {
      expect(
        sortDates('value', 'ascending', { value: 1000 }, { value: 2000 })
      ).toEqual(-1000);
      expect(
        sortDates('value', 'ascending', { value: 2000 }, { value: 1000 })
      ).toEqual(1000);
      expect(
        sortDates('value', 'ascending', { value: 1000 }, { value: 1000 })
      ).toEqual(0);
    });

    test('descending sort order', () => {
      expect(
        sortDates('value', 'descending', { value: 1000 }, { value: 2000 })
      ).toEqual(1000);
      expect(
        sortDates('value', 'descending', { value: 2000 }, { value: 1000 })
      ).toEqual(-1000);
      expect(
        sortDates('value', 'descending', { value: 1000 }, { value: 1000 })
      ).toEqual(0);
    });

    test('undefined values', () => {
      expect(sortDates('value', 'ascending', {}, {})).toEqual(0);
    });
  });

  describe('sortNumbers() should sort number value', () => {
    test('ascending sort order', () => {
      expect(
        sortNumbers('value', 'ascending', { value: 1 }, { value: 2 })
      ).toEqual(-1);
      expect(
        sortNumbers('value', 'ascending', { value: 2 }, { value: 1 })
      ).toEqual(1);
      expect(
        sortNumbers('value', 'ascending', { value: 1 }, { value: 1 })
      ).toEqual(0);
    });

    test('descending sort order', () => {
      expect(
        sortNumbers('value', 'descending', { value: 1 }, { value: 2 })
      ).toEqual(1);
      expect(
        sortNumbers('value', 'descending', { value: 2 }, { value: 1 })
      ).toEqual(-1);
      expect(
        sortNumbers('value', 'descending', { value: 1 }, { value: 1 })
      ).toEqual(0);
    });

    test('undefined values', () => {
      expect(sortNumbers('value', 'ascending', {}, {})).toEqual(0);
    });
  });
});
