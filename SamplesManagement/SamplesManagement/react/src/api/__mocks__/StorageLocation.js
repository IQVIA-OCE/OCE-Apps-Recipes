export const fetchLocationsList = jest.fn().mockResolvedValue([
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

export const fetchDefaultLocation = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5n0k000000G4qBAAS',
      OCE__IsDefaultStorageLocation__c: true,
      OCE__FullAddress__c: 'New line1, Malta, AU, 12345',
    },
  ],
  { totalSize: 1, done: true },
]);

export const fetchUsers = jest.fn().mockResolvedValue([
  [
    {
      Id: '0050k000004CineAAC',
      Name: 'SALESREP',
    },
  ],
  { totalSize: 1, done: true },
]);

export const fetchLocationById = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5n0k000000G4qBAAS',
      Name: 'New line1',
      OCE__AddressLine2__c: null,
      OCE__City__c: 'Malta',
      OCE__Country__c: 'AU',
      OCE__State__c: null,
      OCE__IsDefaultStorageLocation__c: true,
      OCE__ZipCode__c: '12345',
      CreatedDate: '2023-06-20T06:04:00.000Z',
      LastModifiedDate: '2024-05-27T05:24:00.000Z',
      CreatedById: '0050k000004CineAAC',
      LastModifiedById: '0050k000004CineAAC',
    },
  ],
  { totalSize: 1, done: true },
]);

//values = {}, id = ''
export const saveLocations = jest.fn().mockResolvedValue();

export const fetchCountries = jest.fn().mockResolvedValue([
  {
    fields: [
      {
        name: 'OCE__Country__c',
        picklistValues: [
          {
            active: true,
            defaultValue: false,
            label: 'Belgium',
            validFor: null,
            value: 'BE',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Brazil',
            validFor: null,
            value: 'BR',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Canada',
            validFor: null,
            value: 'CA',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Austria',
            validFor: null,
            value: 'AT',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Australia',
            validFor: null,
            value: 'AU',
          },
          {
            active: true,
            defaultValue: false,
            label: 'France',
            validFor: null,
            value: 'FR',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Germany',
            validFor: null,
            value: 'DE',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Ireland',
            validFor: null,
            value: 'IE',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Italy',
            validFor: null,
            value: 'IT',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Japan',
            validFor: null,
            value: 'JP',
          },
          {
            active: true,
            defaultValue: false,
            label: 'Luxembourg',
            validFor: null,
            value: 'LU',
          },
        ],
      },
    ],
  },
]);

export const updateDefaultLocation = jest.fn(id => [
  { id, success: true, errors: [] },
]);

// id
export const deleteLocation = jest.fn().mockResolvedValue();
