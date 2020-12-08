import {
  mapFormDetails,
  mapFormProducts,
  mapReturnFormDetails,
  normalizeLocations,
  normalizeProductsList,
  normalizeUsers,
  mapTransactionDetails,
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

const transactionProduct = {
  comments: 'comments',
  sampleProductId: 'sampleProductId',
  quantity: 'quantity',
  lotNumberId: 'lotNumberId',
  reason: {
    label: 'reason',
  },
  isSystemCreated: false,
};

const createdTransactionProduct = {
  comments: 'comments',
  sampleProductId: 'sampleProductId',
  quantity: 'quantity',
  lotNumberId: 'lotNumberId',
  reason: {
    label: 'reason',
  },
  isSystemCreated: false,
  id: '1',
};

describe('utils', () => {
  it('normalizeProductsList: should return normalized data', () => {
    let normalized = normalizeProductsList(null);
    expect(normalized).toStrictEqual([]);

    normalized = normalizeProductsList(
      [
        {
          Id: '1',
          Name: 'Name 1',
          OCE__Lot__r: { OCE__Product__r: { Name: 'LotNumber 1' } },
          OCE__LotNumber__c: 'OCE__LotNumber__c',
          OCE__Lot__c: 'OCE__Lot__c',
          OCE__LotProductId__c: 'OCE__LotProductId__c',
        },
        {
          Id: '2',
          Name: 'Name 2',
          OCE__Lot__r: { OCE__Product__r: { Name: 'LotNumber 2' } },
          OCE__LotNumber__c: 'OCE__LotNumber__c',
          OCE__Lot__c: 'OCE__Lot__c',
          OCE__LotProductId__c: 'OCE__LotProductId__c',
        },
      ],
      'Adjustment',
      []
    );

    expect(normalized).toStrictEqual([
      {
        label: 'LotNumber 1',
        detailLabel: 'OCE__LotNumber__c',
        id: 'OCE__LotProductId__c',
        lotId: 'OCE__Lot__c',
        selected: false,
      },
      {
        label: 'LotNumber 2',
        detailLabel: 'OCE__LotNumber__c',
        id: 'OCE__LotProductId__c',
        lotId: 'OCE__Lot__c',
        selected: false,
      },
    ]);

    normalized = normalizeProductsList(
      [
        {
          Id: '1',
          Name: 'Name 1',
          OCE__Product__r: { Name: 'LotNumber 1' },
          OCE__Product__c: 'OCE__Product__c 1',
        },
        {
          Id: '2',
          Name: 'Name 2',
          OCE__Product__r: { Name: 'LotNumber 2' },
          OCE__Product__c: 'OCE__Product__c 2',
        },
      ],
      'TransferIn',
      []
    );

    expect(normalized).toStrictEqual([
      {
        label: 'LotNumber 1',
        detailLabel: 'Name 1',
        id: 'OCE__Product__c 1',
        lotId: '1',
        selected: false,
      },
      {
        label: 'LotNumber 2',
        detailLabel: 'Name 2',
        id: 'OCE__Product__c 2',
        lotId: '2',
        selected: false,
      },
    ]);
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
      OCE__ReceivedDate__c: null,
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
    let normalized = mapFormProducts(null, 'transactionId');

    expect(normalized).toStrictEqual(null);

    normalized = mapFormProducts(transactionProduct, 'transactionId');

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: 'lotNumberId',
      OCE__Product__c: 'sampleProductId',
      OCE__Quantity__c: 'quantity',
      OCE__SampleTransaction__c: 'transactionId',
      OCE__Reason__c: 'reason',
      OCE__IsSystemCreated__c: false,
    });

    normalized = mapFormProducts(
      { ...transactionProduct, reason: null, isSystemCreated: true },
      'transactionId'
    );

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: 'lotNumberId',
      OCE__Product__c: 'sampleProductId',
      OCE__Quantity__c: 'quantity',
      OCE__SampleTransaction__c: 'transactionId',
      OCE__Reason__c: null,
      OCE__IsSystemCreated__c: true,
    });

    normalized = mapFormProducts(createdTransactionProduct, 'transactionId');

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: 'lotNumberId',
      OCE__Product__c: 'sampleProductId',
      OCE__Quantity__c: 'quantity',
      OCE__Reason__c: 'reason',
      OCE__IsSystemCreated__c: false,
    });

    normalized = mapFormProducts(
      { ...createdTransactionProduct, reason: null, isSystemCreated: true },
      'transactionId'
    );

    expect(normalized).toStrictEqual({
      OCE__Comments__c: 'comments',
      OCE__LotNumber__c: 'lotNumberId',
      OCE__Product__c: 'sampleProductId',
      OCE__Quantity__c: 'quantity',
      OCE__Reason__c: null,
      OCE__IsSystemCreated__c: true,
    });
  });

  it('mapReturnFormDetails: should return normalized data', () => {
    let normalizedNormal = mapReturnFormDetails({
      recordType: value.recordType,
      fields: {
        ...value.fields,
        shipmentDate: '2020-01-09',
        shipmentCarrier: 'ShCarrier',
        trackingNumber: '1',
      },
    });

    expect(normalizedNormal).toStrictEqual({
      OCE__Status__c: 'status',
      OCE__TransactionDateTime__c: 'May 3, 2020 06:19 pm',
      OCE__ShipmentDate__c: 'May 3, 2020 06:19 pm',
      OCE__ShipmentCarrier__c: 'ShCarrier',
      OCE__FromSalesRep__c: '1',
      OCE__TransactionRep__c: '1',
      OCE__TransactionRepTerritory__c: 'name',
      OCE__TrackingNumber__c: '1',
      OCE__Comments__c: 'comments',
      RecordTypeId: '1',
    });

    let normalizedWithoutValue = mapReturnFormDetails({
      recordType: value.recordType,
      fields: {
        ...value.fields,
        shipmentCarrier: 'ShCarrier',
        trackingNumber: '1',
      },
    });

    expect(normalizedWithoutValue).toStrictEqual({
      OCE__Status__c: 'status',
      OCE__TransactionDateTime__c: 'May 3, 2020 06:19 pm',
      OCE__ShipmentDate__c: null,
      OCE__ShipmentCarrier__c: 'ShCarrier',
      OCE__FromSalesRep__c: '1',
      OCE__TransactionRep__c: '1',
      OCE__TransactionRepTerritory__c: 'name',
      OCE__TrackingNumber__c: '1',
      OCE__Comments__c: 'comments',
      RecordTypeId: '1',
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

  it('mapTransactionDetails: should normalize transaction details', () => {
    let normalized = mapTransactionDetails([
      {
        OCE__SampleTransactionItems__r: {
          totalSize: 0,
        },
      },
    ]);
    expect(normalized).toStrictEqual({
      accountId: null,
      accountName: null,
      address: undefined,
      comments: undefined,
      conditionOfPackage: undefined,
      detailsCount: 0,
      fromSalesRep: { label: null, value: undefined },
      fromSalesRepId: undefined,
      fromSalesRepName: null,
      id: undefined,
      isSystemCreated: undefined,
      lastModifiedDate: undefined,
      name: undefined,
      receivedDate: undefined,
      recordTypeDevName: null,
      recordTypeId: undefined,
      recordTypeName: null,
      relatedTransactionName: undefined,
      shipTo: { id: undefined, label: undefined },
      shipmentCarrier: undefined,
      shipmentDate: undefined,
      status: undefined,
      territory: { name: 'TM - SPC - Aurora 20A02T06' },
      toSalesRep: { label: null, value: undefined },
      toSalesRepId: undefined,
      toSalesRepName: null,
      trackingNumber: undefined,
      transactionDateTime: undefined,
      transactionRepId: undefined,
      transactionRepName: null,
    });
  });
});
