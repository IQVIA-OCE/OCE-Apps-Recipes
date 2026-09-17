export const ACCOUNTS_MOCK = [
  {
    Id: '0',
    Name: 'Danca Luchici'
  },
  {
    Id: '1',
    Name: 'David Labotka'
  },
];

export const ACCOUNT_CALLS_MOCK = [
  {
    Id: '0',
    OCE__CallDateTime__c: '2022-08-20T08:45:00.000+0000',
  },
  {
    Id: '1',
    OCE__CallDateTime__c: '2022-09-05T08:45:00.000+0000',
  },
];

export const CALL_DETAILS_MOCK = [
  {
    Id: 'cl0',
    OCE__Call__c: '0',
    OCE__CallDateTime__c: '2022-08-20T08:45:00.000+0000',
    OCE__Product__r: {
      Id: 'pr0',
      Name: 'A:Maxton',
    },
  },
  {
    Id: 'cl1',
    OCE__Call__c: '1',
    OCE__CallDateTime__c: '2022-09-05T08:45:00.000+0000',
    OCE__Product__r: {
      Id: 'pr1',
      Name: 'B:Alodox',
    },
  },
];

export const NORMALIZED_DATA = [
  {
    calls: [
      {
        date: '2022-08-20T08:45:00.000+0000',
        id: 'cl0',
      },
    ],
    productColor: '#5899DA',
    productId: 'pr0',
    productName: 'A:Maxton',
  },
  {
    calls: [
      {
        date: '2022-09-05T08:45:00.000+0000',
        id: 'cl1',
      },
    ],
    productColor: '#2F6497',
    productId: 'pr1',
    productName: 'B:Alodox',
  },
];
