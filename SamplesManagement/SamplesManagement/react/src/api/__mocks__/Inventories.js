export const fetchInventories = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5dF7000000lvxxIAA',
      OCE__SampleInventoryDetails__r: {
        totalSize: 13,
        done: true,
        records: [
          {
            Id: 'a5cF7000000LXAcIAO',
          },
          {
            Id: 'a5cF7000000LXAdIAO',
          },
          {
            Id: 'a5cF7000000LXAeIAO',
          },
          {
            Id: 'a5cF7000000LXAfIAO',
          },
          {
            Id: 'a5cF7000000LXAgIAO',
          },
          {
            Id: 'a5cF7000000LXAhIAO',
          },
          {
            Id: 'a5cF7000000LXAiIAO',
          },
          {
            Id: 'a5cF7000000LXAjIAO',
          },
          {
            Id: 'a5cF7000000LXAkIAO',
          },
          {
            Id: 'a5cF7000000LXAlIAO',
          },
          {
            Id: 'a5cF7000000LXAmIAO',
          },
          {
            Id: 'a5cF7000000LXAnIAO',
          },
          {
            Id: 'a5cF7000000LXAoIAO',
          },
        ],
      },
      OCE__Auditor__c: '0056F00000A4qesQAB',
      OCE__Comments__c: 'Comment',
      CreatedById: '0050k000004CineAAC',
      CreatedDate: '2024-02-07T14:17:08.000+0000',
      OCE__IntegrationID__c: null,
      OCE__InventoryDateTime__c: '2024-02-07T14:17:00.000+0000',
      Name: 'I-000021',
      RecordTypeId: '0120k000000QjLcAAK',
      RecordType: {
        DeveloperName: 'AuditedInventory',
      },
      OCE__Status__c: 'In Progress',
      OCE__Reason__c: null,
    },
    {
      Id: 'a5d0k000000pi5hAAA',
      OCE__SampleInventoryDetails__r: {
        totalSize: 10,
        done: true,
        records: [
          {
            Id: 'a5c0k00000095DAAAY',
          },
          {
            Id: 'a5c0k00000095DBAAY',
          },
          {
            Id: 'a5c0k00000095D7AAI',
          },
          {
            Id: 'a5c0k00000095D8AAI',
          },
          {
            Id: 'a5c0k00000095D9AAI',
          },
          {
            Id: 'a5cF70000009AWmIAM',
          },
          {
            Id: 'a5cF70000009AWnIAM',
          },
          {
            Id: 'a5c0k0000009ATJAA2',
          },
          {
            Id: 'a5c0k0000009ATKAA2',
          },
          {
            Id: 'a5c0k0000009ATLAA2',
          },
        ],
      },
      OCE__Auditor__c: '0056F00000A4qe9QAB',
      OCE__Comments__c: 'Test',
      CreatedById: '0050k000004CineAAC',
      CreatedDate: '2023-06-20T15:57:35.000+0000',
      OCE__IntegrationID__c: null,
      OCE__InventoryDateTime__c: '2023-10-16T14:51:00.000+0000',
      Name: 'I-000006',
      RecordTypeId: '0120k000000QjLcAAK',
      RecordType: {
        DeveloperName: 'AuditedInventory',
      },
      OCE__Status__c: 'In Progress',
      OCE__Reason__c: null,
    },
    {
      Id: 'a5dF7000000piqPIAQ',
      OCE__SampleInventoryDetails__r: {
        totalSize: 10,
        done: true,
        records: [
          {
            Id: 'a5cF70000009AWSIA2',
          },
          {
            Id: 'a5cF70000009AWTIA2',
          },
          {
            Id: 'a5cF70000009AWUIA2',
          },
          {
            Id: 'a5cF70000009AWVIA2',
          },
          {
            Id: 'a5cF70000009AWWIA2',
          },
          {
            Id: 'a5cF70000009AWXIA2',
          },
          {
            Id: 'a5cF70000009AWYIA2',
          },
          {
            Id: 'a5cF70000009AWZIA2',
          },
          {
            Id: 'a5cF70000009AWaIAM',
          },
          {
            Id: 'a5cF70000009AWbIAM',
          },
        ],
      },
      OCE__Auditor__c: null,
      OCE__Comments__c: 'test',
      CreatedById: '0050k000004CineAAC',
      CreatedDate: '2023-10-16T14:40:46.000+0000',
      OCE__IntegrationID__c: null,
      OCE__InventoryDateTime__c: '2023-10-16T14:40:00.000+0000',
      Name: 'I-000019',
      RecordTypeId: '0120k000000QjLbAAK',
      RecordType: {
        DeveloperName: 'AdHocInventory',
      },
      OCE__Status__c: 'Submitted',
      OCE__Reason__c: 'Theft/Loss',
    },
    {
      Id: 'a5d0k000000pi8HAAQ',
      OCE__SampleInventoryDetails__r: {
        totalSize: 7,
        done: true,
        records: [
          {
            Id: 'a5c0k00000096lmAAA',
          },
          {
            Id: 'a5c0k00000096lnAAA',
          },
          {
            Id: 'a5c0k00000096lhAAA',
          },
          {
            Id: 'a5c0k00000096liAAA',
          },
          {
            Id: 'a5c0k00000096ljAAA',
          },
          {
            Id: 'a5c0k00000096lkAAA',
          },
          {
            Id: 'a5c0k00000096llAAA',
          },
        ],
      },
      OCE__Auditor__c: null,
      OCE__Comments__c: null,
      CreatedById: '0050k000004CineAAC',
      CreatedDate: '2023-07-05T12:06:38.000+0000',
      OCE__IntegrationID__c: null,
      OCE__InventoryDateTime__c: '2023-07-05T12:06:00.000+0000',
      Name: 'I-000018',
      RecordTypeId: '0120k000000QjLbAAK',
      RecordType: {
        DeveloperName: 'AdHocInventory',
      },
      OCE__Status__c: 'Submitted',
      OCE__Reason__c: 'Damaged',
    },
    {
      Id: 'a5d0k000000pi8CAAQ',
      OCE__SampleInventoryDetails__r: {
        totalSize: 7,
        done: true,
        records: [
          {
            Id: 'a5c0k00000096lQAAQ',
          },
          {
            Id: 'a5c0k00000096lRAAQ',
          },
          {
            Id: 'a5c0k00000096lSAAQ',
          },
          {
            Id: 'a5c0k00000096lTAAQ',
          },
          {
            Id: 'a5c0k00000096lUAAQ',
          },
          {
            Id: 'a5c0k00000096lVAAQ',
          },
          {
            Id: 'a5c0k00000096lWAAQ',
          },
        ],
      },
      OCE__Auditor__c: null,
      OCE__Comments__c: null,
      CreatedById: '0050k000004CineAAC',
      CreatedDate: '2023-07-05T08:28:15.000+0000',
      OCE__IntegrationID__c: null,
      OCE__InventoryDateTime__c: '2023-07-05T08:28:00.000+0000',
      Name: 'I-000017',
      RecordTypeId: '0120k000000QjLeAAK',
      RecordType: {
        DeveloperName: 'PeriodicInventory',
      },
      OCE__Status__c: 'Submitted',
      OCE__Reason__c: null,
    },
    {
      Id: 'a5d0k000000pi7xAAA',
      OCE__SampleInventoryDetails__r: {
        totalSize: 7,
        done: true,
        records: [
          {
            Id: 'a5c0k00000096l5AAA',
          },
          {
            Id: 'a5c0k00000096l6AAA',
          },
          {
            Id: 'a5c0k00000096l7AAA',
          },
          {
            Id: 'a5c0k00000096l8AAA',
          },
          {
            Id: 'a5c0k00000096l9AAA',
          },
          {
            Id: 'a5c0k00000096lAAAQ',
          },
          {
            Id: 'a5c0k00000096l4AAA',
          },
        ],
      },
      OCE__Auditor__c: null,
      OCE__Comments__c: null,
      CreatedById: '0050k000004CineAAC',
      CreatedDate: '2023-07-05T08:06:17.000+0000',
      OCE__IntegrationID__c: null,
      OCE__InventoryDateTime__c: '2023-07-05T08:06:00.000+0000',
      Name: 'I-000016',
      RecordTypeId: '0120k000000QjLeAAK',
      RecordType: {
        DeveloperName: 'PeriodicInventory',
      },
      OCE__Status__c: 'In Progress',
      OCE__Reason__c: null,
    },
    {
      Id: 'a5d0k000000pi5DAAQ',
      OCE__SampleInventoryDetails__r: {
        totalSize: 3,
        done: true,
        records: [
          {
            Id: 'a5c0k0000009589AAA',
          },
          {
            Id: 'a5c0k00000095CdAAI',
          },
          {
            Id: 'a5c0k000000958AAAQ',
          },
        ],
      },
      OCE__Auditor__c: null,
      OCE__Comments__c: null,
      CreatedById: '0050k000004CineAAC',
      CreatedDate: '2023-06-20T06:45:17.000+0000',
      OCE__IntegrationID__c: null,
      OCE__InventoryDateTime__c: '2023-06-20T11:52:00.000+0000',
      Name: 'I-000000',
      RecordTypeId: '0120k000000QjLdAAK',
      RecordType: {
        DeveloperName: 'InitialInventory',
      },
      OCE__Status__c: 'Submitted',
      OCE__Reason__c: null,
    },
  ],
  { totalSize: 7, done: true },
]);

export const fetchListId = jest.fn().mockResolvedValue([
  [
    {
      Id: '00B0k000002eNZVEA2',
      Name: 'All',
      DeveloperName: 'All',
    },
  ],
  { totalSize: 1, done: true },
]);

export const fetchInventoryTypes = jest.fn().mockResolvedValue([
  [
    {
      Id: '0120k000000QjLbAAK',
      Name: 'Ad Hoc Inventory',
      DeveloperName: 'AdHocInventory',
      IsPersonType: false,
      Description: 'Record Type to differentiate Ad Hoc Inventory',
      IsActive: true,
    },
    {
      Id: '0120k000000QjLcAAK',
      Name: 'Audited Inventory',
      DeveloperName: 'AuditedInventory',
      IsPersonType: false,
      Description: 'Record Type to differentiate Audit Inventory',
      IsActive: true,
    },
    {
      Id: '0120k000000QjLdAAK',
      Name: 'Initial Inventory',
      DeveloperName: 'InitialInventory',
      IsPersonType: false,
      Description: 'Record Type to differentiate Initial Inventory',
      IsActive: true,
    },
    {
      Id: '0120k000000QjLeAAK',
      Name: 'Periodic Inventory',
      DeveloperName: 'PeriodicInventory',
      IsPersonType: false,
      Description: 'Record Type to differentiate Periodic Inventory',
      IsActive: true,
    },
  ],
  { totalSize: 4, done: true },
]);

export const fetchActiveLotsProducts = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a3m0k0000033EsNAAU',
      OCE__IsActive__c: true,
      Name: '6586-3',
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
        OCE__SKU__c: null,
      },
    },
    {
      Id: 'a3m0k0000033EsOAAU',
      OCE__IsActive__c: true,
      Name: '6586-3',
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
        OCE__SKU__c: null,
      },
    },
    {
      Id: 'a3m0k0000033EsMAAU',
      OCE__IsActive__c: true,
      Name: '6586-3',
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
        OCE__SKU__c: null,
      },
    },
    {
      Id: 'a3m0k0000033EsLAAU',
      OCE__IsActive__c: true,
      Name: '6586-3',
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
        OCE__SKU__c: null,
      },
    },
    {
      Id: 'a3m0k0000033EsUAAU',
      OCE__IsActive__c: true,
      Name: '6446-1',
      OCE__Product__c: 'a5E0k000001lME3EAM',
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
        OCE__SKU__c: null,
      },
    },
  ],
  { totalSize: 5, done: true },
]);

export const fetchLastSubmittedInventory = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5d0k000000pi5DAAQ',
      Name: 'I-000000',
      CreatedDate: '2023-06-19T23:45:00.000+0000',
      OCE__Reason__c: null,
      OCE__Status__c: 'Submitted',
      OCE__Comments__c: null,
      RecordTypeId: '0120k000000QjLdAAK',
      OCE__Auditor__c: null,
    },
    {
      Id: 'a5d0k000000pi5NAAQ',
      Name: 'I-000002',
      CreatedDate: '2023-06-20T05:57:00.000+0000',
      OCE__Reason__c: null,
      OCE__Status__c: 'Submitted',
      OCE__Comments__c: 'Comment2',
      RecordTypeId: '0120k000000QjLcAAK',
      OCE__Auditor__c: '0056F00000A4D1kQAF',
    },
    {
      Id: 'a5d0k000000pi5IAAQ',
      Name: 'I-000001',
      CreatedDate: '2023-06-20T05:26:00.000+0000',
      OCE__Reason__c: 'Theft/Loss',
      OCE__Status__c: 'Submitted',
      OCE__Comments__c: 'Comment',
      RecordTypeId: '0120k000000QjLbAAK',
      OCE__Auditor__c: null,
    },
  ],
  { totalSize: 3, done: true },
]);

// where inventoryId = 'a5dF7000000piqPIAQ'
export const fetchInventoryById = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5dF7000000piqPIAQ',
      Name: 'I-000019',
      CreatedDate: '10/16/2023, 7:40 AM',
      OCE__Reason__c: 'Theft/Loss',
      OCE__Status__c: 'Submitted',
      OCE__Comments__c: 'test',
      RecordTypeId: '0120k000000QjLbAAK',
      OCE__Auditor__c: null,
    },
  ],
  { totalSize: 1, done: true },
]);

// where inventoryId = 'a5dF7000000piqPIAQ'
export const fetchInventoryDetail = jest.fn().mockResolvedValue([
  [
    {
      CreatedDate: '2023-10-16T14:40:46.000+0000',
      Id: 'a5cF70000009AWSIA2',
      IsDeleted: false,
      OCE__IsDiscrepancy__c: true,
      OCE__Lot__c: 'a3m0k0000033EsNAAU',
      OCE__Lot__r: {
        Name: '6586-3',
      },
      Name: 'ID-00000115',
      OCE__PhysicalCount__c: 2,
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
      },
      OCE__SampleInventory__c: 'a5dF7000000piqPIAQ',
      OCE__Status__c: 'Submitted',
      OCE__SystemCount__c: 8,
      OCE__DiscrepancyReason__c: null,
    },
    {
      CreatedDate: '2023-10-16T14:40:46.000+0000',
      Id: 'a5cF70000009AWTIA2',
      IsDeleted: false,
      OCE__IsDiscrepancy__c: true,
      OCE__Lot__c: 'a3m0k0000033EsOAAU',
      OCE__Lot__r: {
        Name: '6586-3',
      },
      Name: 'ID-00000116',
      OCE__PhysicalCount__c: 1,
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
      },
      OCE__SampleInventory__c: 'a5dF7000000piqPIAQ',
      OCE__Status__c: 'Submitted',
      OCE__SystemCount__c: 6,
      OCE__DiscrepancyReason__c: null,
    },
    {
      CreatedDate: '2023-10-16T14:40:46.000+0000',
      Id: 'a5cF70000009AWUIA2',
      IsDeleted: false,
      OCE__IsDiscrepancy__c: true,
      OCE__Lot__c: 'a3m0k0000033EsMAAU',
      OCE__Lot__r: {
        Name: '6586-3',
      },
      Name: 'ID-00000117',
      OCE__PhysicalCount__c: 2,
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
      },
      OCE__SampleInventory__c: 'a5dF7000000piqPIAQ',
      OCE__Status__c: 'Submitted',
      OCE__SystemCount__c: 13,
      OCE__DiscrepancyReason__c: null,
    },
  ],
  { totalSize: 3, done: true },
]);

export const fetchTransactionDetails = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5kF7000000HKuLIAW',
      OCE__SampleTransaction__c: 'a5lF70000005p0BIAQ',
      OCE__SampleTransaction__r: {
        RecordType: {
          Name: 'Acknowledgement of Shipment',
          DeveloperName: 'AcknowledgementOfShipment',
        },
        OCE__TransactionDateTime__c: '2023-12-22T11:13:45.000+0000',
      },
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
      },
      OCE__Comments__c: '11',
      OCE__LotNumber__r: {
        Name: '6586-3',
      },
      OCE__Quantity__c: 1,
      OCE__ShippedQuantity__c: 0,
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__LotNumber__c: 'a3m0k0000033EsLAAU',
      CreatedDate: '2023-12-22T09:14:19.000+0000',
    },
    {
      Id: 'a5kF7000000HKuBIAW',
      OCE__SampleTransaction__c: 'a5lF70000005p01IAA',
      OCE__SampleTransaction__r: {
        RecordType: {
          Name: 'Acknowledgement of Shipment',
          DeveloperName: 'AcknowledgementOfShipment',
        },
        OCE__TransactionDateTime__c: '2023-12-22T11:09:27.000+0000',
      },
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
      },
      OCE__Comments__c: '1',
      OCE__LotNumber__r: {
        Name: '6586-3',
      },
      OCE__Quantity__c: 1,
      OCE__ShippedQuantity__c: 0,
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__LotNumber__c: 'a3m0k0000033EsLAAU',
      CreatedDate: '2023-12-22T09:10:48.000+0000',
    },
    {
      Id: 'a5kF7000000HKuGIAW',
      OCE__SampleTransaction__c: 'a5lF70000005p06IAA',
      OCE__SampleTransaction__r: {
        RecordType: {
          Name: 'Acknowledgement of Shipment',
          DeveloperName: 'AcknowledgementOfShipment',
        },
        OCE__TransactionDateTime__c: '2023-12-22T11:12:16.000+0000',
      },
      OCE__Product__r: {
        Name: 'ADRAVIL TAB 10 MG Physical',
      },
      OCE__Comments__c: '11',
      OCE__LotNumber__r: {
        Name: '6586-3',
      },
      OCE__Quantity__c: 1,
      OCE__ShippedQuantity__c: 0,
      OCE__Product__c: 'a5E0k000001lMDzEAM',
      OCE__LotNumber__c: 'a3m0k0000033EsLAAU',
      CreatedDate: '2023-12-22T09:13:09.000+0000',
    },
  ],
  { totalSize: 3, done: true },
]);

export const saveInventory = jest.fn((data) => {
  return Promise.resolve([
    {
      sampleInventory: { Id: data.id || '1' },
      sampleInventoryDetails: [{ sampleProductId: 1 }],
    },
  ]);
});

const MOCKED_AUDITORS = [
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
    Id: '0056F00000A4qgKQAR',
    Name: 'District Manager',
  },
];
// where searchQuery = 'a'
export const fetchAuditors = jest
  .fn()
  .mockResolvedValue([[...MOCKED_AUDITORS], { totalSize: 5, done: true }]);

export const fetchAuditorById = jest.fn(id => {
  return [[MOCKED_AUDITORS.find(auditor => auditor.Id === id)]];
});

export const deleteInventory = jest.fn().mockResolvedValue();
