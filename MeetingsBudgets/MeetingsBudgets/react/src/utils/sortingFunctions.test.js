import * as sortingFunctions from './sortingFunctions';

describe('sortingFunctions', () => {
  describe('sortStrings function', () => {
    const greaterValueA = { field: 'X' };
    const lowerValueA = { field: 'A' };
    const greaterValueB = { field: 'X' };
    const lowerValueB = { field: 'A' };

    test('ascending sort order', () => {
      expect(
        sortingFunctions.sortStrings(
          'field',
          'ascending',
          greaterValueA,
          lowerValueB
        )
      ).toBe(1);
      expect(
        sortingFunctions.sortStrings(
          'field',
          'ascending',
          lowerValueA,
          greaterValueB
        )
      ).toBe(-1);
      expect(
        sortingFunctions.sortStrings(
          'field',
          'ascending',
          greaterValueA,
          greaterValueB
        )
      ).toBe(0);
    });

    test('descending sort order', () => {
      expect(
        sortingFunctions.sortStrings(
          'field',
          'descending',
          lowerValueA,
          greaterValueB
        )
      ).toBe(1);
      expect(
        sortingFunctions.sortStrings(
          'field',
          'descending',
          greaterValueA,
          lowerValueB
        )
      ).toBe(-1);
      expect(
        sortingFunctions.sortStrings(
          'field',
          'descending',
          greaterValueA,
          greaterValueB
        )
      ).toBe(0);
    });
  });

  describe('sortCurrency function', () => {
    const greaterValueA = { field: '$100.56' };
    const lowerValueA = { field: '' };
    const greaterValueB = { field: '$100.56' };
    const lowerValueB = { field: '' };

    test('ascending sort order', () => {
      expect(
        sortingFunctions.sortCurrency(
          'field',
          'ascending',
          greaterValueA,
          lowerValueB
        )
      ).toBe(1);
      expect(
        sortingFunctions.sortCurrency(
          'field',
          'ascending',
          lowerValueA,
          greaterValueB
        )
      ).toBe(-1);
      expect(
        sortingFunctions.sortCurrency(
          'field',
          'ascending',
          greaterValueA,
          greaterValueB
        )
      ).toBe(0);
    });

    test('descending sort order', () => {
      expect(
        sortingFunctions.sortCurrency(
          'field',
          'descending',
          lowerValueA,
          greaterValueB
        )
      ).toBe(1);
      expect(
        sortingFunctions.sortCurrency(
          'field',
          'descending',
          greaterValueA,
          lowerValueB
        )
      ).toBe(-1);
      expect(
        sortingFunctions.sortCurrency(
          'field',
          'descending',
          greaterValueA,
          greaterValueB
        )
      ).toBe(0);
    });
  });
});
