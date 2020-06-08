import { normalizeInventories } from './utils';

describe('utils', () => {
  it('normalizeInventories: should normalize data', () => {
    let normalized = normalizeInventories([])([]);

    expect(normalized).toStrictEqual({
      inventories: { all: [] },
      recordTypes: { all: [] },
    });

    normalized = normalizeInventories([{ DeveloperName: 'AdHocInventory' }])([
      { Id: '1', TypeId: 'AdHocInventory' },
    ]);

    expect(normalized).toStrictEqual({
      inventories: {
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
      },
      recordTypes: {
        all: [{ DeveloperName: 'AdHocInventory' }],
        AdHocInventory: { DeveloperName: 'AdHocInventory' },
      },
    });
  });
});
