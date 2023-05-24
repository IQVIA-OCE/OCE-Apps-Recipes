import {
  normalizeDisbursements,
  generateColors,
  handleFilterData,
} from './utils';

import moment from 'moment';

jest.mock('moment', () => () => {
  const fakeMoment = {
    format: val => val,
    toDate: () =>
      'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
    startOf: () => fakeMoment,
    subtract: () => fakeMoment,
    month: () => fakeMoment,
    year: () => fakeMoment,
    isSame: () => fakeMoment,
  };

  return fakeMoment;
});

describe('utils', () => {
  it('generateColors: should generate colors', () => {
    let colors = generateColors(7);
    expect(colors.length).toEqual(7);

    colors = generateColors(15);
    expect(colors.length).toEqual(15);
  });
  it('normalizeDisbursements: should normalize data', () => {
    const normalized = normalizeDisbursements('2')([
      {
        Id: '1',
        month: 5,
        productName: 'ADRAVIL',
        totalQuantity: 12,
        year: 2020,
      },
      {
        Id: '1',
        month: 6,
        productName: 'ADRAVIL',
        totalQuantity: 3,
        year: 2020,
      },
      {
        Id: '2',
        month: 6,
        productName: null,
        totalQuantity: 3,
        year: 2020,
      },
    ]);

    expect(normalized).toEqual({
      allIds: ['1', '2'],
      byId: {
        '1': {
          color: '#5899DA',
          data: [
            {
              tooltip: 'ADRAVIL: 3',
              x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
              y: 3,
            },
            {
              tooltip: 'ADRAVIL: 3',
              x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
              y: 3,
            },
            {
              tooltip: 'ADRAVIL: 3',
              x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
              y: 3,
            },
          ],
          label: 'ADRAVIL',
        },
        '2': {
          color: '#2F6497',
          data: [
            {
              tooltip: 'null: 3',
              x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
              y: 3,
            },
            {
              tooltip: 'null: 3',
              x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
              y: 3,
            },
            {
              tooltip: 'null: 3',
              x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
              y: 3,
            },
          ],
          label: '',
        },
      },
      colors: ['#5899DA', '#2F6497'],
    });
  });
  it('handleFilterData: should remove item', () => {
    const colors = ['#000', '#fff'];
    const ids = ['1', '2'];
    const uncheck = {
      colors: ['#000'],
      ids: ['1'],
    };
    const check = {
      colors,
      ids,
    };
    const disbursements = {
      data: {
        colors,
        allIds: ids,
        byId: {
          1: {
            id: '1',
            label: 'ads',
            color: '#000',
          },
          2: {
            id: '2',
            label: 'ads 2',
            color: '#fff',
          },
        },
      },
    };

    let data = handleFilterData('2', check, disbursements);
    expect(data).toEqual(uncheck);

    data = handleFilterData('2', uncheck, disbursements);
    expect(data).toEqual(check);
  });
});
