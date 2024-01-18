import { mapOrders, mapTransactions } from './utils';

jest.mock('../../../constants/constants', () => ({
  NAMESPACE: 'OCE__'
}));

const transactions = [
  {
    Id: 'a510w000000CgZQAA0',
    LastModifiedDate: '2020-05-20T11:55:45.0000000',
    OCE__ConditionOfPackage__c: 'Undamaged',
    OCE__FromSalesRep__c: '0056F00000A4qfMQAR',
    OCE__FromSalesRep__r: { Name: 'Name' },
    OCE__FullAddress__c: null,
    OCE__ReceivedDate__c: '2020-05-20',
    OCE__SampleTransactionItems__r: { totalSize: 1 },
    OCE__ShipmentDate__c: null,
    OCE__Status__c: 'In Progress',
    OCE__ToSalesRep__c: '0056F00000B45ezQAB',
    OCE__ToSalesRep__r: { Name: 'Name' },
    OCE__TransactionDateTime__c: '2020-05-20T10:45:12.0000000',
    OCE__TransactionRep__c: null,
    OCE__TransactionRep__r: { Name: 'Name' },
    RecordType: { Name: 'Name', DeveloperName: 'DeveloperName' },
    OCE__Call__r: {
      OCE__Account__c: '1',
      OCE__Account__r: {
        Name: 'name',
      },
    },
  },
  {
    Id: 'a510w000000CgZQAA0',
    LastModifiedDate: '2020-05-20T11:55:45.0000000',
    OCE__ConditionOfPackage__c: 'Undamaged',
    OCE__FromSalesRep__c: null,
    OCE__FromSalesRep__r: null,
    OCE__FullAddress__c: null,
    OCE__ReceivedDate__c: '2020-05-20',
    OCE__SampleTransactionItems__r: null,
    OCE__ShipmentDate__c: null,
    OCE__Status__c: 'In Progress',
    OCE__ToSalesRep__c: '0056F00000B45ezQAB',
    OCE__ToSalesRep__r: null,
    OCE__TransactionDateTime__c: '2020-05-20T10:45:12.0000000',
    OCE__TransactionRep__c: null,
    OCE__TransactionRep__r: null,
    RecordType: [{ Name: 'Name', DeveloperName: 'DeveloperName' }],
  },
];
describe('utils', () => {
  it('mapTransactions: should normalize transactions', () => {
    const normalized = mapTransactions(transactions);

    expect(normalized).toStrictEqual([
      {
        accountId: '1',
        accountName: 'name',
        address: null,
        conditionOfPackage: 'Undamaged',
        detailsCount: 1,
        fromSalesRepId: '0056F00000A4qfMQAR',
        fromSalesRepName: 'Name',
        id: 'a510w000000CgZQAA0',
        lastModifiedDate: '2020-05-20T11:55:45.0000000',
        receivedDate: '2020-05-20',
        recordTypeDevName: 'DeveloperName',
        recordTypeId: undefined,
        recordTypeName: 'Name',
        shipmentDate: null,
        status: 'In Progress',
        toSalesRepId: '0056F00000B45ezQAB',
        toSalesRepName: 'Name',
        transactionDateTime: '2020-05-20T10:45:12.0000000',
        transactionRepId: null,
        transactionRepName: 'Name',
      },
      {
        accountId: null,
        accountName: null,
        address: null,
        conditionOfPackage: 'Undamaged',
        detailsCount: null,
        fromSalesRepId: null,
        fromSalesRepName: null,
        id: 'a510w000000CgZQAA0',
        lastModifiedDate: '2020-05-20T11:55:45.0000000',
        receivedDate: '2020-05-20',
        recordTypeDevName: undefined,
        recordTypeId: undefined,
        recordTypeName: undefined,
        shipmentDate: null,
        status: 'In Progress',
        toSalesRepId: '0056F00000B45ezQAB',
        toSalesRepName: null,
        transactionDateTime: '2020-05-20T10:45:12.0000000',
        transactionRepId: null,
        transactionRepName: null,
      },
    ]);
  });

  it('mapOrders: should normalize Orders', () => {
    const normalized = mapOrders([
      {
        OCE__SampleOrderDetails__r: { totalSize: 1 },
        Id: '1',
        OCE__IsUrgent__c: 'urgent',
        OCE__Status__c: 'status',
      },
      {
        OCE__SampleOrderDetails__r: null,
        Id: '2',
        OCE__IsUrgent__c: 'urgent',
        OCE__Status__c: 'status',
      },
    ]);

    expect(normalized).toStrictEqual([
      {
        detailsCount: 1,
        id: '1',
        isUrgent: 'urgent',
        lastModifiedDate: undefined,
        recordTypeDevName: 'Order',
        recordTypeName: 'Order',
        status: 'status',
      },
      {
        detailsCount: null,
        id: '2',
        isUrgent: 'urgent',
        lastModifiedDate: undefined,
        recordTypeDevName: 'Order',
        recordTypeName: 'Order',
        status: 'status',
      },
    ]);
  });
});
