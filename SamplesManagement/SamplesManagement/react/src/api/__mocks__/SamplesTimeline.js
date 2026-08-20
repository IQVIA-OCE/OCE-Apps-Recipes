export const fetchTransactionsData = jest.fn().mockResolvedValue([
  [
    {
      OCE__SampleTransactionItems__r: {
        totalSize: 1,
        done: true,
        records: [
          {
            Id: 'a5kF700000031rHIAQ',
            Name: 'TD-00000147',
          },
        ],
      },
      OCE__ConditionOfPackage__c: null,
      OCE__FromSalesRep__c: null,
      OCE__FromSalesRep__r: null,
      Id: 'a5lF70000000lQOIAY',
      LastModifiedDate: '2024-05-23T15:26:26.000+0000',
      OCE__ReceivedDate__c: null,
      RecordType: {
        Name: 'Disbursement',
        DeveloperName: 'Disbursement',
      },
      OCE__ShipmentDate__c: null,
      OCE__Status__c: 'Submitted',
      OCE__ToSalesRep__c: null,
      OCE__ToSalesRep__r: null,
      OCE__TransactionDateTime__c: '2024-05-23T15:26:26.000+0000',
      OCE__TransactionRep__c: '0050k000004CineAAC',
      OCE__TransactionRep__r: {
        Name: 'SALESREP',
      },
      OCE__FullAddress__c: '670 PONAHAWAI ST STE 223, HILO, HI, US, 96720',
      OCE__Call__r: {
        OCE__Account__c: '0010k00001TmnZUAAZ',
        OCE__Account__r: {
          Name: 'AARON H MORITA',
        },
      },
    },
    {
      OCE__SampleTransactionItems__r: {
        totalSize: 1,
        done: true,
        records: [
          {
            Id: 'a5kF7000000HLyDIAW',
            Name: 'TD-00000146',
          },
        ],
      },
      OCE__ConditionOfPackage__c: 'Undamaged',
      OCE__FromSalesRep__c: null,
      OCE__FromSalesRep__r: null,
      Id: 'a5lF70000005q8OIAQ',
      LastModifiedDate: '2024-02-07T15:20:31.000+0000',
      OCE__ReceivedDate__c: null,
      RecordType: {
        Name: 'Adjustment',
        DeveloperName: 'Adjustment',
      },
      OCE__ShipmentDate__c: null,
      OCE__Status__c: 'In Progress',
      OCE__ToSalesRep__c: null,
      OCE__ToSalesRep__r: null,
      OCE__TransactionDateTime__c: '2024-02-07T05:20:13.000+0000',
      OCE__TransactionRep__c: '0050k000004CineAAC',
      OCE__TransactionRep__r: {
        Name: 'SALESREP',
      },
      OCE__FullAddress__c: null,
      OCE__Call__r: null,
    },
  ],
  { totalSize: 6, done: true },
]);

export const fetchOrdersData = jest.fn().mockResolvedValue([
  [
    {
      OCE__SampleOrderDetails__r: {
        totalSize: 1,
        done: true,
        records: [
          {
            OCE__Product__c: 'a5E0k000001lMJ4EAM',
            OCE__Quantity__c: 29,
          },
        ],
      },
      Id: 'a5jF70000071JYDIA2',
      OCE__IsUrgent__c: true,
      LastModifiedDate: '2024-02-07T14:06:09.000+0000',
      OCE__Status__c: 'In Progress',
    },
    {
      OCE__SampleOrderDetails__r: {
        totalSize: 1,
        done: true,
        records: [
          {
            OCE__Product__c: 'a5E0k000001lME3EAM',
            OCE__Quantity__c: 7,
          },
        ],
      },
      Id: 'a5jF7000000E4tXIAS',
      OCE__IsUrgent__c: false,
      LastModifiedDate: '2023-10-16T14:56:37.000+0000',
      OCE__Status__c: 'In Progress',
    },
  ],
  { totalSize: 2, done: true },
]);

export const fetchTransactionsListId = jest.fn().mockResolvedValue([
  [
    {
      Id: '00B0k000002eNZfEAM',
      Name: 'All',
      DeveloperName: 'All',
    },
  ],
  { totalSize: 1, done: true },
]);

export const fetchOrdersListId = jest.fn().mockResolvedValue([
  [
    {
      Id: '00B0k000002eNZaEAM',
      Name: 'All',
      DeveloperName: 'All',
    },
  ],
  { totalSize: 1, done: true },
]);
