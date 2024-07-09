//where userId = '0050k000004CineAAC'
export const fetchUserLocations = jest.fn().mockResolvedValueOnce([
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

export const fetchSampleProducts = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5E0k000001lMJ4EAM',
      Name: 'Alodox 100 MG',
      OCE__IsAvailableForAllocation__c: false,
      OCE__ParentProduct__r: {
        Name: 'B:Alodox',
      },
      OCE__MaxOrder__c: null,
      OCE__MinOrder__c: null,
      OCE__SKU__c: null,
    },
    {
      Id: 'a5E0k000001lMJ5EAM',
      Name: 'Alodox 200 MG',
      OCE__IsAvailableForAllocation__c: false,
      OCE__ParentProduct__r: {
        Name: 'B:Alodox',
      },
      OCE__MaxOrder__c: null,
      OCE__MinOrder__c: null,
      OCE__SKU__c: null,
    },
    {
      Id: 'a5E0k000001lMJ6EAM',
      Name: 'Alodox 300 MG',
      OCE__IsAvailableForAllocation__c: false,
      OCE__ParentProduct__r: {
        Name: 'B:Alodox',
      },
      OCE__MaxOrder__c: null,
      OCE__MinOrder__c: null,
      OCE__SKU__c: null,
    },
    {
      Id: 'a5E0k000001lMI9EAM',
      Name: 'Azelastine 100 MG',
      OCE__IsAvailableForAllocation__c: false,
      OCE__ParentProduct__r: {
        Name: 'B:Azelastine',
      },
      OCE__MaxOrder__c: null,
      OCE__MinOrder__c: null,
      OCE__SKU__c: null,
    },
    {
      Id: 'a5E0k000001lMIAEA2',
      Name: 'Azelastine 200 MG',
      OCE__IsAvailableForAllocation__c: false,
      OCE__ParentProduct__r: {
        Name: 'B:Azelastine',
      },
      OCE__MaxOrder__c: null,
      OCE__MinOrder__c: null,
      OCE__SKU__c: null,
    },
    {
      Id: 'a5E0k000001lMIBEA2',
      Name: 'Azelastine 300 MG',
      OCE__IsAvailableForAllocation__c: false,
      OCE__ParentProduct__r: {
        Name: 'B:Azelastine',
      },
      OCE__MaxOrder__c: null,
      OCE__MinOrder__c: null,
      OCE__SKU__c: null,
    },
    {
      Id: 'a5E0k000001lMICEA2',
      Name: 'Bleomycin 100 MG',
      OCE__IsAvailableForAllocation__c: false,
      OCE__ParentProduct__r: {
        Name: 'B:Bleomycin',
      },
      OCE__MaxOrder__c: null,
      OCE__MinOrder__c: null,
      OCE__SKU__c: null,
    },
  ],
  { totalSize: 7, done: true },
]);

export const fetchSampleOrderConfig = jest.fn().mockResolvedValue();

// where userId = '0050k000004CineAAC'
export const fetchUserProfile = jest.fn().mockResolvedValue([
  [
    {
      Id: '0050k000004CineAAC',
      OCE__ProfileId__c: '00e0k000000O1zxAAC',
    },
  ],
  { totalSize: 1, done: true },
]);

export const fetchProductTerritoryAllocationRecords = jest
  .fn()
  .mockRejectedValueOnce([
    [],
    {
      totalSize: 0,
      done: true,
    },
  ]);

// fields, id
export const saveSampleOrder = jest.fn((fields, id) =>
  Promise.resolve([{ id: id || '1' }])
);

// id, values, status
export const updateFormDetailsStatus = jest.fn().mockResolvedValue();

// product
export const saveSampleOrderProduct = jest.fn().mockResolvedValue();

export const deleteSampleOrderProduct = jest.fn().mockResolvedValue();

export const deleteSampleOrder = jest.fn().mockResolvedValue();

// where orderId = 'a5jF70000071JYDIA2'
export const fetchOrderDetails = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5jF70000071JYDIA2',
      LastModifiedDate: '2024-02-07T14:06:09.000+0000',
      Name: 'O-00000009',
      OCE__Comments__c: null,
      OCE__ShipToID__c: 'a5n0k000000G8OVAA0',
      OCE__ShipToText__c: 'Test, New, FR',
      OCE__IsUrgent__c: true,
      OCE__Status__c: 'In Progress',
      OCE__RecipientTerritory__c: 'TM - SPC - Aurora 20A02T06',
    },
  ],
  { totalSize: 1, done: true },
]);

// where orderId = 'a5jF70000071JYDIA2'
export const fetchOrderProducts = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5iF70000006KQ6IAM',
      Name: 'OD-0010',
      OCE__Product__c: 'a5E0k000001lMJ4EAM',
      OCE__Product__r: {
        Name: 'Alodox 100 MG',
      },
      OCE__Quantity__c: 29,
      OCE__SampleOrder__c: 'a5jF70000071JYDIA2',
      OCE__Comments__c: 'Test 9',
    },
  ],
  { totalSize: 1, done: true },
]);
