export const fetchReceivedSamplesData = jest.fn((limit, recordTypeDevName) => {
  let data = [];
  if (recordTypeDevName === 'TransferIn') {
    data = [
      {
        OCE__SampleTransactionItems__r: {
          totalSize: 2,
          done: true,
          records: [
            {
              Id: 'a5kF7000000HLxtIAG',
              Name: 'TD-00000140',
            },
            {
              Id: 'a5kF7000000HLxuIAG',
              Name: 'TD-00000141',
            },
          ],
        },
        OCE__ConditionOfPackage__c: 'Undamaged',
        OCE__FromSalesRep__c: '0056F00000A4qesQAB',
        OCE__FromSalesRep__r: {
          Name: 'Oce Admin',
        },
        Id: 'a5lF70000005q84IAA',
        LastModifiedDate: '2024-02-07T14:12:20.000+0000',
        OCE__ReceivedDate__c: null,
        RecordType: {
          Name: 'Transfer In',
          DeveloperName: 'TransferIn',
        },
        OCE__ShipmentDate__c: '2024-02-07',
        OCE__Status__c: 'In Progress',
        OCE__ToSalesRep__c: '0050k000004CineAAC',
        OCE__ToSalesRep__r: {
          Name: 'SALESREP',
        },
        OCE__TransactionDateTime__c: '2024-02-07T14:12:20.000+0000',
        OCE__TransactionRep__c: '0050k000004CineAAC',
        OCE__TransactionRep__r: {
          Name: 'SALESREP',
        },
        OCE__FullAddress__c: 'New line1, Malta, AU, 12345',
        OCE__Call__r: null,
      },
      {
        OCE__SampleTransactionItems__r: {
          totalSize: 1,
          done: true,
          records: [
            {
              Id: 'a5kF7000000GYbxIAG',
              Name: 'TD-00000074',
            },
          ],
        },
        OCE__ConditionOfPackage__c: 'Opened',
        OCE__FromSalesRep__c: '0056F00000A4qesQAB',
        OCE__FromSalesRep__r: {
          Name: 'Oce Admin',
        },
        Id: 'a5lF7000000DSj8IAG',
        LastModifiedDate: '2023-10-16T14:02:35.000+0000',
        OCE__ReceivedDate__c: '2023-10-16',
        RecordType: {
          Name: 'Transfer In',
          DeveloperName: 'TransferIn',
        },
        OCE__ShipmentDate__c: null,
        OCE__Status__c: 'In Progress',
        OCE__ToSalesRep__c: '0050k000004CineAAC',
        OCE__ToSalesRep__r: {
          Name: 'SALESREP',
        },
        OCE__TransactionDateTime__c: '2023-10-16T05:02:08.000+0000',
        OCE__TransactionRep__c: '0050k000004CineAAC',
        OCE__TransactionRep__r: {
          Name: 'SALESREP',
        },
        OCE__FullAddress__c: 'New line1, Malta, AU',
        OCE__Call__r: null,
      },
    ];
  } else if (recordTypeDevName === 'AcknowledgementOfShipment') {
    data = [
      {
        OCE__SampleTransactionItems__r: {
          totalSize: 2,
          done: true,
          records: [
            {
              Id: 'a5kF7000000HLxZIAW',
              Name: 'TD-00000131',
            },
            {
              Id: 'a5kF7000000HLxaIAG',
              Name: 'TD-00000132',
            },
          ],
        },
        OCE__ConditionOfPackage__c: 'Damaged',
        OCE__FromSalesRep__c: '0050k000004CineAAC',
        OCE__FromSalesRep__r: {
          Name: 'SALESREP',
        },
        Id: 'a5lF70000005q7kIAA',
        LastModifiedDate: '2024-02-07T14:05:35.000+0000',
        OCE__ReceivedDate__c: '2024-02-07',
        RecordType: {
          Name: 'Acknowledgement of Shipment',
          DeveloperName: 'AcknowledgementOfShipment',
        },
        OCE__ShipmentDate__c: null,
        OCE__Status__c: 'In Progress',
        OCE__ToSalesRep__c: null,
        OCE__ToSalesRep__r: null,
        OCE__TransactionDateTime__c: '2024-02-07T04:05:15.000+0000',
        OCE__TransactionRep__c: '0050k000004CineAAC',
        OCE__TransactionRep__r: {
          Name: 'SALESREP',
        },
        OCE__FullAddress__c: null,
        OCE__Call__r: null,
      },
      {
        OCE__SampleTransactionItems__r: {
          totalSize: 1,
          done: true,
          records: [
            {
              Id: 'a5kF7000000GYbiIAG',
              Name: 'TD-00000070',
            },
          ],
        },
        OCE__ConditionOfPackage__c: 'Undamaged',
        OCE__FromSalesRep__c: '0050k000004CineAAC',
        OCE__FromSalesRep__r: {
          Name: 'SALESREP',
        },
        Id: 'a5lF7000000DSitIAG',
        LastModifiedDate: '2023-10-16T14:00:37.000+0000',
        OCE__ReceivedDate__c: '2023-10-16',
        RecordType: {
          Name: 'Acknowledgement of Shipment',
          DeveloperName: 'AcknowledgementOfShipment',
        },
        OCE__ShipmentDate__c: null,
        OCE__Status__c: 'In Progress',
        OCE__ToSalesRep__c: null,
        OCE__ToSalesRep__r: null,
        OCE__TransactionDateTime__c: '2023-10-16T05:00:20.000+0000',
        OCE__TransactionRep__c: '0050k000004CineAAC',
        OCE__TransactionRep__r: {
          Name: 'SALESREP',
        },
        OCE__FullAddress__c: null,
        OCE__Call__r: null,
      },
    ];
  }

  return Promise.resolve([[...data], { totalSize: 2, done: true }]);
});

export const fetchReceivedSamplesListId = jest.fn().mockResolvedValue([
  [
    {
      Id: '00B0k000002eNa0EAE',
      Name: 'Received Samples',
      DeveloperName: 'ReceivedSamples',
    },
  ],
  { totalSize: 1, done: true },
]);
