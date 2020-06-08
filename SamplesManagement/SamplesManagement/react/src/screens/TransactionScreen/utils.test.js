import {
  mapFormDetails,
  mapFormProducts, normalizeLocations,
  normalizeProductsList,
  normalizeUsers,
} from './utils';

jest.mock('moment', () => () => ({ format: () => 'May 3, 2020 06:19 pm' }));

const value = {
  recordType: {
    Id: '1',
    DeveloperName: 'TransferIn',
  },
  fields: {
    toSalesRep: {
      value: 'value',
    },
    shipTo: {
      id: '1',
    },
    fromSalesRep: {
      value: 'value',
    },
    user: {
      Id: '1',
    },
    status: 'status',
    transactionRep: {
      Id: '1',
    },
    conditionOfPackage: {
      label: 'label',
    },
    territory: {
      name: 'name',
    },
    comments: 'comments',
  },
  comments: 'comments',
  quantity: 'quantity',
  reason: { label: 'reason' },
  OCE__Lot__c: 'lot',
  OCE__Product__c: 'product',
  Id: '1',
};

describe('utils', () => {
  it('normalizeProductsList: should return normalized data', () => {
    let normalized = normalizeProductsList(null);
    expect(normalized).toStrictEqual({ byId: {}, allIds: [] });

    normalized = normalizeProductsList(
      [
        {
          Id: '1',
          Name: 'Name 1',
          OCE__Lot__r: { OCE__Product__r: 'LotNumber 1' },
        },
        {
          Id: '2',
          Name: 'Name 2',
          OCE__Lot__r: { OCE__Product__r: 'LotNumber 2' },
        },
      ],
      'TransferOut',
      ['1', '2']
    );

    expect(normalized).toStrictEqual({
      byId: {
        1: {
          Id: '1',
          Name: 'Name 1',
          OCE__Lot__r: {
            OCE__Product__r: 'LotNumber 1',
          },
          name: undefined,
          productName: undefined,
          selected: true,
        },
        2: {
          Id: '2',
          Name: 'Name 2',
          OCE__Lot__r: {
            OCE__Product__r: 'LotNumber 2',
          },
          name: undefined,
          productName: undefined,
          selected: true,
        },
      },
      allIds: ['1', '2'],
    });
  });

  it('mapFormDetails: should return normalized data', () => {
    let normalized = mapFormDetails({
      ...value,
      recordType: {
        ...value.recordType,
        DeveloperName: '',
      },
    });

    expect(normalized).toStrictEqual(null);

    normalized = mapFormDetails({
      ...value,
      recordType: {
        ...value.recordType,
        DeveloperName: 'AcknowledgementOfShipment',
      },
    });

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__ConditionOfPackage__c: 'label',
      OCE__FromSalesRep__c: '1',
      OCE__ReceivedDate__c: 'May 3, 2020 06:19 pm',
      OCE__Status__c: 'status',
      OCE__TransactionDateTime__c: 'May 3, 2020 06:19 pm',
      OCE__TransactionRepTerritory__c: 'name',
      OCE__TransactionRep__c: '1',
      RecordTypeId: '1',
    });

    normalized = mapFormDetails({
      ...value,
      recordType: {
        ...value.recordType,
        DeveloperName: 'Adjustment',
      },
    });

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__Status__c: 'status',
      OCE__TransactionDateTime__c: 'May 3, 2020 06:19 pm',
      OCE__TransactionRepTerritory__c: 'name',
      OCE__TransactionRep__c: '1',
      RecordTypeId: '1',
    });

    normalized = mapFormDetails({
      ...value,
      recordType: {
        ...value.recordType,
        DeveloperName: 'Return',
      },
    });

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__FromSalesRep__c: '1',
      OCE__ShipmentCarrier__c: undefined,
      OCE__ShipmentDate__c: null,
      OCE__Status__c: 'status',
      OCE__TrackingNumber__c: undefined,
      OCE__TransactionDateTime__c: 'May 3, 2020 06:19 pm',
      OCE__TransactionRepTerritory__c: 'name',
      OCE__TransactionRep__c: '1',
      RecordTypeId: '1',
    });

    normalized = mapFormDetails({
      ...value,
      recordType: {
        ...value.recordType,
        DeveloperName: 'TransferIn',
      },
    });

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__ConditionOfPackage__c: 'label',
      OCE__FromSalesRepTerritory__c: undefined,
      OCE__FromSalesRep__c: 'value',
      OCE__FullAddress__c: undefined,
      OCE__ReceivedDate__c: 'May 3, 2020 06:19 pm',
      OCE__ShipToID__c: '1',
      OCE__Status__c: 'status',
      OCE__ToSalesRepTerritory__c: 'name',
      OCE__ToSalesRep__c: '1',
      OCE__TransactionDateTime__c: 'May 3, 2020 06:19 pm',
      RecordTypeId: '1',
    });

    normalized = mapFormDetails({
      ...value,
      recordType: {
        ...value.recordType,
        DeveloperName: 'TransferOut',
      },
    });

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__FromSalesRepTerritory__c: 'name',
      OCE__FromSalesRep__c: '1',
      OCE__FullAddress__c: undefined,
      OCE__ShipToID__c: '1',
      OCE__ShipmentCarrier__c: undefined,
      OCE__ShipmentDate__c: 'May 3, 2020 06:19 pm',
      OCE__Status__c: 'status',
      OCE__ToSalesRepTerritory__c: undefined,
      OCE__ToSalesRep__c: 'value',
      OCE__TrackingNumber__c: undefined,
      OCE__TransactionDateTime__c: 'May 3, 2020 06:19 pm',
      RecordTypeId: '1',
    });
  });

  it('mapFormProducts: should return normalized data', () => {
    let normalized = mapFormProducts(value, '1', '');

    expect(normalized).toStrictEqual(null);

    normalized = mapFormProducts(value, '1', 'AcknowledgementOfShipment');

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: '1',
      OCE__Product__c: 'product',
      OCE__Quantity__c: 'quantity',
      OCE__SampleTransaction__c: '1',
    });

    normalized = mapFormProducts(value, '1', 'Adjustment');

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: 'lot',
      OCE__Product__c: undefined,
      OCE__Quantity__c: 'quantity',
      OCE__Reason__c: 'reason',
      OCE__SampleTransaction__c: '1',
    });
    normalized = mapFormProducts(value, '1', 'Return');

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: 'lot',
      OCE__Product__c: undefined,
      OCE__Quantity__c: 'quantity',
      OCE__SampleTransaction__c: '1',
    });

    normalized = mapFormProducts(value, '1', 'TransferIn');

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: '1',
      OCE__Product__c: 'product',
      OCE__Quantity__c: 'quantity',
      OCE__SampleTransaction__c: '1',
    });

    normalized = mapFormProducts(value, '1', 'TransferOut');

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: 'lot',
      OCE__Product__c: undefined,
      OCE__Quantity__c: 'quantity',
      OCE__SampleTransaction__c: '1',
    });
  });

  it('normalizeUsers: should normalize user', () => {
    let normalized = normalizeUsers();
    expect(normalized).toStrictEqual([]);

    normalized = normalizeUsers([{ Id: '1', Name: 'Name' }]);
    expect(normalized).toStrictEqual([{ label: 'Name', value: '1' }]);
  });

  it('normalizeLocations: should normalize user', () => {
    let normalized = normalizeLocations();
    expect(normalized).toStrictEqual([]);

    normalized = normalizeLocations([{ Id: '1', OCE__FullAddress__c: 'Name' }]);
    expect(normalized).toStrictEqual([{ label: 'Name', id: '1' }]);
  });
});
