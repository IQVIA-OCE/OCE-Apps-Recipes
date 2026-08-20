import moment from 'moment';

export const fetchTransactionRecordTypes = jest.fn().mockReturnValueOnce([
  [
    {
      Description: 'Record Type to differentiate Acknowledgment of Shipment',
      DeveloperName: 'AcknowledgementOfShipment',
      Id: '0120k000000QjLfAAK',
      Name: 'Acknowledgement of Shipment',
    },
    {
      Description: 'Record Type to differentiate Adjustment',
      DeveloperName: 'Adjustment',
      Id: '0120k000000QjLgAAK',
      Name: 'Adjustment',
    },
    {
      Description: 'Record Type to differentiate Disbursement',
      DeveloperName: 'Disbursement',
      Id: '0120k000000QjLhAAK',
      Name: 'Disbursement',
    },
    {
      Description: 'Record Type to differentiate Return',
      DeveloperName: 'Return',
      Id: '0120k000000QjLiAAK',
      Name: 'Return',
    }
  ],
  { totalSize: 4, done: true },
]);

export const fetchSampleProducts = jest.fn(recordTypeDevName => {
  let products = [
    {
      Id: 'a3m0k0000033EvTAAU',
      Name: 'B-020-58-1',
      OCE__Product__r: {
        Name: 'Alodox 100 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ4EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
    {
      Id: 'a3m0k0000033EvUAAU',
      Name: 'B-020-58-2',
      OCE__Product__r: {
        Name: 'Alodox 100 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ4EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
    {
      Id: 'a3m0k0000033EvVAAU',
      Name: 'B-020-58-3',
      OCE__Product__r: {
        Name: 'Alodox 100 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ4EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
    {
      Id: 'a3m0k0000033EvWAAU',
      Name: 'B-020-59-1',
      OCE__Product__r: {
        Name: 'Alodox 200 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ5EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
    {
      Id: 'a3m0k0000033EvXAAU',
      Name: 'B-020-59-2',
      OCE__Product__r: {
        Name: 'Alodox 200 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ5EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
    {
      Id: 'a3m0k0000033EvYAAU',
      Name: 'B-020-59-3',
      OCE__Product__r: {
        Name: 'Alodox 200 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ5EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
    {
      Id: 'a3m0k0000033EvZAAU',
      Name: 'B-020-60-1',
      OCE__Product__r: {
        Name: 'Alodox 300 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ6EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
    {
      Id: 'a3m0k0000033EvaAAE',
      Name: 'B-020-60-2',
      OCE__Product__r: {
        Name: 'Alodox 300 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ6EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
    {
      Id: 'a3m0k0000033EvbAAE',
      Name: 'B-020-60-3',
      OCE__Product__r: {
        Name: 'Alodox 300 MG',
        OCE__SKU__c: null,
      },
      OCE__Product__c: 'a5E0k000001lMJ6EAM',
      OCE__ExpirationDate__c: moment().add(1, 'y').toISOString(),
      OCE__IsActive__c: true,
    },
  ];

  if (recordTypeDevName == 'TransferOut' || recordTypeDevName == 'Adjustment') {
    products = [
      {
        Id: 'a5hF7000000wLXlIAM',
        OCE__IsActive__c: true,
        OCE__Lot__c: 'a3m0k0000033EskAAE',
        OCE__Lot__r: {
          OCE__Product__c: 'a5E0k000001lMI9EAM',
          OCE__Product__r: {
            Name: 'Azelastine 100 MG',
            OCE__SKU__c: null,
          },
        },
        OCE__LotExpirationDate__c: moment().add(1, 'y').toISOString(),
        OCE__LotIsActive__c: true,
        OCE__LotNumber__c: 'B-001-1-3',
        OCE__LotProductId__c: 'a5E0k000001lMI9EAM',
        Name: 'LA-006580',
        OwnerId: '0050k000004CineAAC',
        OCE__User__c: '0050k000004CineAAC',
      },
      {
        Id: 'a5hF7000000zF0JIAU',
        OCE__IsActive__c: true,
        OCE__Lot__c: 'a3m0k0000033EtRAAU',
        OCE__Lot__r: {
          OCE__Product__c: 'a5E0k000001lMIOEA2',
          OCE__Product__r: {
            Name: 'Fareston 100 MG',
            OCE__SKU__c: null,
          },
        },
        OCE__LotExpirationDate__c: moment().add(1, 'y').toISOString(),
        OCE__LotIsActive__c: true,
        OCE__LotNumber__c: 'B-006-16-1',
        OCE__LotProductId__c: 'a5E0k000001lMIOEA2',
        Name: 'LA-006033',
        OwnerId: '0050k000004CineAAC',
        OCE__User__c: '0050k000004CineAAC',
      },
      {
        Id: 'a5hF7000000zF0EIAU',
        OCE__IsActive__c: true,
        OCE__Lot__c: 'a3m0k0000033EwCAAU',
        OCE__Lot__r: {
          OCE__Product__c: 'a5E0k000001lMJJEA2',
          OCE__Product__r: {
            Name: 'Keflex 100 MG',
            OCE__SKU__c: null,
          },
        },
        OCE__LotExpirationDate__c: moment().add(1, 'y').toISOString(),
        OCE__LotIsActive__c: true,
        OCE__LotNumber__c: 'B-025-73-1',
        OCE__LotProductId__c: 'a5E0k000001lMJJEA2',
        Name: 'LA-006032',
        OwnerId: '0050k000004CineAAC',
        OCE__User__c: '0050k000004CineAAC',
      },
    ];
  } else if (recordTypeDevName == 'Return') {
    products = [
      {
        Id: 'a5h0k000000ZcPgAAK',
        OCE__IsActive__c: true,
        OCE__Lot__c: 'a3m0k0000033EsLAAU',
        OCE__Lot__r: {
          OCE__Product__c: 'a5E0k000001lMDzEAM',
          OCE__Product__r: {
            Name: 'ADRAVIL TAB 10 MG Physical',
            OCE__SKU__c: null,
          },
        },
        OCE__LotExpirationDate__c: '2024-10-24',
        OCE__LotIsActive__c: true,
        OCE__LotNumber__c: '6586-3',
        OCE__LotProductId__c: 'a5E0k000001lMDzEAM',
        Name: 'LA-003590',
        OwnerId: '0050k000004CineAAC',
        SystemModstamp: '2023-12-22T09:14:24.000+0000',
        OCE__User__c: '0050k000004CineAAC',
      },
      {
        Id: 'a5h0k000000ZcPpAAK',
        OCE__IsActive__c: true,
        OCE__Lot__c: 'a3m0k0000033EsUAAU',
        OCE__Lot__r: {
          OCE__Product__c: 'a5E0k000001lME3EAM',
          OCE__Product__r: {
            Name: 'ADRAVIL TAB 10 MG Physical',
            OCE__SKU__c: null,
          },
        },
        OCE__LotExpirationDate__c: moment().add(1, 'y').toISOString(),
        OCE__LotIsActive__c: true,
        OCE__LotNumber__c: '6446-1',
        OCE__LotProductId__c: 'a5E0k000001lME3EAM',
        Name: 'LA-003599',
        OwnerId: '0050k000004CineAAC',
        OCE__User__c: '0050k000004CineAAC',
      },
      {
        Id: 'a5h0k000000ZcPqAAK',
        OCE__IsActive__c: true,
        OCE__Lot__c: 'a3m0k0000033EsVAAU',
        OCE__Lot__r: {
          OCE__Product__c: 'a5E0k000001lME3EAM',
          OCE__Product__r: {
            Name: 'ADRAVIL TAB 10 MG Physical',
            OCE__SKU__c: null,
          },
        },
        OCE__LotExpirationDate__c: moment().add(1, 'y').toISOString(),
        OCE__LotIsActive__c: true,
        OCE__LotNumber__c: '6446-2',
        OCE__LotProductId__c: 'a5E0k000001lME3EAM',
        Name: 'LA-003600',
        OwnerId: '0050k000004CineAAC',
        OCE__User__c: '0050k000004CineAAC',
      },
      {
        Id: 'a5h0k000000xCOQAA2',
        OCE__IsActive__c: true,
        OCE__Lot__c: 'a3m0k0000033EsiAAE',
        OCE__Lot__r: {
          OCE__Product__c: 'a5E0k000001lMI9EAM',
          OCE__Product__r: {
            Name: 'Azelastine 100 MG',
            OCE__SKU__c: null,
          },
        },
        OCE__LotExpirationDate__c: moment().add(1, 'y').toISOString(),
        OCE__LotIsActive__c: true,
        OCE__LotNumber__c: 'B-001-1-1',
        OCE__LotProductId__c: 'a5E0k000001lMI9EAM',
        Name: 'LA-006031',
        OwnerId: '0050k000004CineAAC',
        OCE__User__c: '0050k000004CineAAC',
      },
    ];
  }

  return Promise.resolve([[[...products], { totalSize: products.length, done: true }]]);
});

export const fetchAllUsers = jest.fn().mockResolvedValue([
  [
    {
      Id: '0056F00000A4D1kQAF',
      Name: 'Admin Integrator',
    },
    {
      Id: '0056F00000Ag35UQAR',
      Name: 'Automated Process',
    },
    {
      Id: '0056F00000Ag35WQAR',
      Name: 'Chatter Expert',
    },
    {
      Id: '0056F000009slMeQAI',
      Name: 'Continious Integration',
    },
    {
      Id: '0056F00000A4qesQAB',
      Name: 'Demo User',
    },
    {
      Id: '0056F00000A4qgKQAR',
      Name: 'District Manager',
    },
  ],
  { totalSize: 7, done: true },
]);

// where userId = "0056F00000A4qesQAB"
export const fetchUserLocations = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5n0k000000G4qBAAS',
      OCE__IsDefaultStorageLocation__c: true,
      OCE__FullAddress__c: 'New line1, Malta, AU, 12345',
    },
    {
      Id: 'a5n0k000000G8OVAA0',
      OCE__IsDefaultStorageLocation__c: false,
      OCE__FullAddress__c: 'Test, New, FR',
    },
  ],
  { totalSize: 2, done: true },
]);

// where userId = "0056F00000A4qesQAB"
export const fetchUserTerritory = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a6o0k0000008lUQAAY',
      OCE__Territory__c: 'TM - SPC - Aurora 20A02T06',
    },
  ],
  { totalSize: 1, done: true },
]);


export const saveFormDetails = jest.fn().mockResolvedValue();

export const saveTransferInDetails = jest.fn().mockResolvedValue();

export const saveTransactionProduct = jest.fn().mockResolvedValue();

export const deleteFormProduct = jest.fn().mockResolvedValue();

//where transactionId = "a5lF70000005q8OIAQ"
export const fetchTransactionDetails = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5lF70000005q8OIAQ',
      LastModifiedDate: moment().subtract(1, 'm').toISOString(),
      Name: 'T-000117',
      OCE__AddressLine1__c: null,
      OCE__Call__c: null,
      OCE__City__c: null,
      OCE__Comments__c: 'comment test',
      OCE__ConditionOfPackage__c: 'Undamaged',
      OCE__Country__c: null,
      OCE__Duplicate__c: false,
      OCE__FromSalesRepTerritory__c: null,
      OCE__FromSalesRep__c: null,
      OCE__FromSalesRep__r: null,
      OCE__FullAddress__c: null,
      OCE__IntegrationID__c: null,
      OCE__IsException__c: false,
      OCE__IsSystemCreated__c: false,
      OCE__Reason__c: null,
      OCE__ReceivedDate__c: null,
      OCE__RelatedTransactionId__c: null,
      OCE__RelatedTransactionName__c: null,
      OCE__ReturnToSender__c: false,
      OCE__SampleOrderName__c: null,
      OCE__SampleOrder__c: null,
      OCE__ShipmentCarrier__c: null,
      OCE__ShipmentDate__c: null,
      OCE__ShipToID__c: null,
      OCE__State__c: null,
      OCE__Status__c: 'In Progress',
      OCE__ToSalesRepTerritory__c: null,
      OCE__ToSalesRep__c: null,
      OCE__ToSalesRep__r: null,
      OCE__TrackingNumber__c: null,
      OCE__TransactionDateTime__c: moment().subtract(1, 'm').toISOString(),
      OCE__TransactionRepTerritory__c: 'TM - SPC - Joliet 20A02T11',
      OCE__TransactionRep__c: '0050k000004CineAAC',
      OCE__TransactionRep__r: {
        Name: 'SALESREP',
      },
      OCE__Zip__c: null,
      OwnerId: '0050k000004CineAAC',
      RecordTypeId: '0120k000000QjLgAAK',
      RecordType: {
        Name: 'Adjustment',
        DeveloperName: 'Adjustment',
      },
    },
  ],
  { totalSize: 1, done: true },
]);

//where transactionId = "a5lF70000005q8OIAQ"
export const fetchTransactionProducts = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5kF7000000HLyDIAW',
      OCE__LotNumber__c: 'a3m0k0000033EsiAAE',
      Name: 'TD-00000146',
      OCE__Product__c: 'a5E0k000001lMI9EAM',
      OCE__Product__r: {
        Name: 'Azelastine 100 MG',
      },
      OCE__LotNumber__r: {
        Name: 'B-001-1-1',
      },
      OCE__Quantity__c: 23,
      OCE__Reason__c: 'Theft/Loss',
      OCE__SampleTransaction__c: 'a5lF70000005q8OIAQ',
      OCE__Comments__c: 'comment test',
      OCE__ShippedQuantity__c: 0,
      OCE__IsSystemCreated__c: false,
    },
  ],
  { totalSize: 1, done: true },
]);

export const deleteTransaction = jest.fn().mockResolvedValue();

export const saveTransactionAsDuplicate = jest.fn().mockResolvedValue();

export const saveTransactionAsReturnToSender = jest.fn().mockResolvedValue();

export const saveTransaction = jest.fn().mockResolvedValue([{ id: '1' }]);
