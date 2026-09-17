import {
  normalizeProductsList,
  normalizeLocations,
  normalizeProductTerritoryAllocationRecords,
  getFieldError,
  mapFormDetails,
  mapFormProducts,
  mapOrderDetails,
  mapOrderProducts,
} from './utils';

const products = [
  {
    OCE__MaxOrder__c: 5,
    Name: 'ADRAVIL TAB 10 MG Physical',
    OCE__MinOrder__c: 1,
    OCE__ParentProduct__r: {
      Name: 'ADRAVIL-DETAIL',
    },
    OCE__SKU__c: null,
    OCE__IsAvailableForAllocation__c: true,
    Id: 'a4x1e0000002kfOAAQ',
  },
  {
    Name: 'ADRAVIL TAB 20 MG Physical',
    OCE__ParentProduct__r: {
      Name: 'ADRAVIL-DETAIL 2',
    },
    OCE__SKU__c: null,
    OCE__IsAvailableForAllocation__c: false,
    Id: 'a4x1e0000002kfOAAZ',
  },
];

describe('utils', () => {
  it('normalizeProductsList: should return normalized data', () => {
    const normalized = normalizeProductsList(
      products,
      [products[0]],
      [products[1]]
    );

    expect(normalized).toStrictEqual([
      {
        detailLabel: 'ADRAVIL-DETAIL',
        label: 'ADRAVIL TAB 10 MG Physical',
        remainingAllocation: 'NA',
        sampleProductId: 'a4x1e0000002kfOAAQ',
        selected: false,
      },
      {
        detailLabel: 'ADRAVIL-DETAIL 2',
        label: 'ADRAVIL TAB 20 MG Physical',
        remainingAllocation: 'NA',
        sampleProductId: 'a4x1e0000002kfOAAZ',
        selected: false,
      },
    ]);
  });
  it('normalizeProductsList: should return empty array if no data', () => {
    const normalized = normalizeProductsList([]);

    expect(normalized).toStrictEqual([]);
  });
  it('normalizeLocations: should return empty array if no data', () => {
    const normalized = normalizeLocations([]);

    expect(normalized).toStrictEqual([]);
  });
  it('normalizeLocations: should return normalized locations', () => {
    const normalized = normalizeLocations([
      {
        OCE__FullAddress__c: 'OCE__FullAddress__c',
        Id: '1',
      },
      {
        OCE__FullAddress__c: 'OCE__FullAddress__c',
        Id: '2',
      },
    ]);

    expect(normalized).toStrictEqual([
      { id: '1', label: 'OCE__FullAddress__c' },
      { id: '2', label: 'OCE__FullAddress__c' },
    ]);
  });
  it('normalizeProductTerritoryAllocationRecords: should return normalized allocation records', () => {
    const normalized = normalizeProductTerritoryAllocationRecords([
      {
        OCE__Product__c: '1',
        OCE__AllocationsRemaining__c: 0,
      },
      {
        OCE__Product__c: '2',
        OCE__AllocationsRemaining__c: 1,
      },
    ]);

    expect(normalized).toStrictEqual([
      { id: '1', remainingAllocation: 0 },
      { id: '2', remainingAllocation: 1 },
    ]);
  });
  it('normalizeProductTerritoryAllocationRecords: should return empty array if no data', () => {
    const normalized = normalizeProductTerritoryAllocationRecords([]);

    expect(normalized).toStrictEqual([]);
  });
  it('getFieldError: should return field error', () => {
    const errors = { fields: { name: 'Has error' } };
    const error = getFieldError('name', errors, errors);

    expect(error).toStrictEqual('Has error');
  });
  it('mapFormDetails: should return mapped form details', () => {
    const normalized = mapFormDetails({
      fields: {
        status: 'In Progress',
        user: { Id: '1' },
        territory: { name: 'Territory' },
        isUrgent: false,
        shipTo: { id: '1', label: 'shipTo' },
        comments: 'Comments',
      },
    });

    expect(normalized).toStrictEqual({
      OCE__Status__c: 'In Progress',
      OCE__OrderRecipient__c: '1',
      OCE__RecipientTerritory__c: 'Territory',
      OCE__SubmittedDateTime__c: null,
      OCE__IsUrgent__c: false,
      OCE__ShipToID__c: '1',
      OCE__ShipToText__c: 'shipTo',
      OCE__Comments__c: 'Comments',
      OCE__ProductType__c: 'Sample',
    });
  });
  it('mapFormProducts: should return mapped form products', () => {
    const normalized = mapFormProducts(
      {
        id: '1',
        comments: 'Comments',
        sampleProductId: 'sampleProductId',
        quantity: 1,
      },
      '1'
    );

    expect(normalized).toStrictEqual({
      Id: '1',
      OCE__Comments__c: 'Comments',
      OCE__Product__c: 'sampleProductId',
      OCE__Quantity__c: 1,
      OCE__SampleOrder__c: '1',
    });
  });
  it('mapOrderDetails: should return mapped order details', () => {
    const normalized = mapOrderDetails([
      {
        Id: 'Id',
        OCE__Comments__c: 'OCE__Comments__c',
        LastModifiedDate: 'LastModifiedDate',
        OCE__Status__c: 'OCE__Status__c',
        OCE__IsUrgent__c: 'OCE__IsUrgent__c',
        Name: 'Name',
        OCE__RecipientTerritory__c: 'OCE__RecipientTerritory__c',
        OCE__ShipToID__c: 'OCE__ShipToID__c',
        OCE__ShipToText__c: 'OCE__ShipToText__c',
      },
    ]);

    expect(normalized).toStrictEqual({
      comments: 'OCE__Comments__c',
      id: 'Id',
      isUrgent: 'OCE__IsUrgent__c',
      lastModifiedDate: 'LastModifiedDate',
      name: 'Name',
      shipTo: { id: 'OCE__ShipToID__c', label: 'OCE__ShipToText__c' },
      status: 'OCE__Status__c',
      territory: { name: 'OCE__RecipientTerritory__c' },
    });
  });
  it('mapOrderProducts: should return mapped order products', () => {
    const normalized = mapOrderProducts([
      {
        Id: 'Id',
        OCE__Product__r: { Name: 'OCE__Product__r.Name' },
        Name: 'Name',
        OCE__Product__c: 'OCE__Product__c',
        OCE__SampleOrder__c: 'OCE__SampleOrder__c',
        OCE__Quantity__c: 'OCE__Quantity__c',
        OCE__Comments__c: 'OCE__Comments__c',
      },
    ]);

    expect(normalized).toStrictEqual([
      {
        id: 'Id',
        label: 'OCE__Product__r.Name',
        detailLabel: 'Name',
        sampleProductId: 'OCE__Product__c',
        orderId: 'OCE__SampleOrder__c',
        quantity: `OCE__Quantity__c`,
        comments: 'OCE__Comments__c',
      },
    ]);
  });
});
