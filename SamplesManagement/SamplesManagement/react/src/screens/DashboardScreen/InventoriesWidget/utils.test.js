import {getMenuItems, normalizeInventories, normalizeRecordTypes} from './utils';

describe('utils', () => {
  it('normalizeInventories: should normalize data', () => {
    let normalized = normalizeInventories([])([]);

    expect(normalized).toStrictEqual({ all: [] });

    normalized = normalizeInventories([{ DeveloperName: 'AdHocInventory' }])([
      { Id: '1', TypeId: 'AdHocInventory' },
    ]);

    expect(normalized).toStrictEqual({
      all: [
        {
          DeveloperName: 'AdHocInventory',
          Id: '1',
          TypeId: 'AdHocInventory',
        },
      ],
      AdHocInventory: [
        {
          DeveloperName: 'AdHocInventory',
          Id: '1',
          TypeId: 'AdHocInventory',
        },
      ],
    });
  });

  it('normalizeRecordTypes: should normalize data', () => {
    let normalized = normalizeRecordTypes([
      { DeveloperName: 'name1' },
      { DeveloperName: 'name2' },
    ]);

    expect(normalized).toStrictEqual({
      all: [{ DeveloperName: 'name1' }, { DeveloperName: 'name2' }],
      name1: { DeveloperName: 'name1' },
      name2: { DeveloperName: 'name2' },
    });
  });
});
