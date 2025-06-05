import { normalizeLocation, normalizeStates, normalizeUsers } from './utils';
import { base64toBitIndex, normalizer } from '../../utils/utils';
jest.mock('../../utils/utils');

jest.mock('moment', () => () => ({
  format: val => val,
}));

describe('StorageLocation utils', () => {
  beforeAll(() => {
    normalizer.mockImplementation(() => d => d);
  });

  it('normalizeStates: should return empty array', () => {
    const states = normalizeStates({});
    expect(states).toStrictEqual([]);
  });

  it('normalizeStates: should return states', () => {
    base64toBitIndex.mockReturnValue([0]);
    const value = {
      fields: [
        {
          name: 'OCE__Country__c',
          picklistValues: [
            {
              value: '1',
              name: 'country1',
            },
          ],
        },
        {
          name: 'OCE__State__c',
          picklistValues: [
            {
              value: '11',
              name: 'state 11',
              validFor: 'a',
            },
            {
              value: '12',
              name: 'state 12',
              validFor: 'a',
            },
            {
              value: '22',
              name: 'state 22',
            },
          ],
        },
      ],
    };
    const states = normalizeStates(value);
    expect(states).toStrictEqual([
      {
        id: '1',
        value: '1',
        name: 'country1',
        states: [
          {
            id: '11',
            value: '11',
            name: 'state 11',
            validFor: 'a',
          },
          {
            id: '12',
            value: '12',
            name: 'state 12',
            validFor: 'a',
          },
        ],
      },
    ]);
  });

  it('normalizeLocation: should show formatted dates', () => {
    const normalized = normalizeLocation([
      {
        createdDate: '14/5/2020 3:52 pm',
        modifiedDate: '14/5/2021 3:52 pm',
      },
    ]);
    expect(normalized).toStrictEqual([
      { createdDate: 'D/M/YYYY h:mm a', modifiedDate: 'D/M/YYYY h:mm a' },
    ]);
  });

  it('normalizeUsers: should normalize user array into object', () => {
    const normalized = normalizeUsers([
      {
        Id: '1',
        Name: 'Some name',
      },
      {
        Id: '2',
        Name: 'Some name 2',
      },
    ]);
    expect(normalized).toStrictEqual({ '1': 'Some name', '2': 'Some name 2' });
  });
});
