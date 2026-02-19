export const fetchLots = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5h0k000000ZcPYAA0',
      Name: 'LA-003582',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsDAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lMDvEAM',
        OCE__Product__r: {
          Name: 'PLOMAX 20 MCG PEN 1 PACK',
        },
        Name: '6543-1',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPnAAK',
      Name: 'LA-003597',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsSAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME2EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 50 MG',
        },
        Name: '6746-1',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPXAA0',
      Name: 'LA-003581',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2023-10-16T14:56:07.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsCAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lMDuEAM',
        OCE__Product__r: {
          Name: 'PLOMAX VIAL 2 MCG Physical',
        },
        Name: '1234-3',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPkAAK',
      Name: 'LA-003594',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsPAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME0EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 20 MG Sign',
        },
        Name: '6549-1',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
  ],
  { totalSize: 4, done: true },
]);

export const fetchLotsOffset = jest.fn().mockResolvedValue([
  [
    {
      Id: 'a5h0k000000ZcPXAA0',
      Name: 'LA-003581',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2023-10-16T14:56:07.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsCAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lMDuEAM',
        OCE__Product__r: {
          Name: 'PLOMAX VIAL 2 MCG Physical',
        },
        Name: '1234-3',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPaAAK',
      Name: 'LA-003584',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsFAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lMDwEAM',
        OCE__Product__r: {
          Name: 'PLOMAX 20 MCG PEN 2 PACK',
        },
        Name: '6544-1',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPbAAK',
      Name: 'LA-003585',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsGAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lMDwEAM',
        OCE__Product__r: {
          Name: 'PLOMAX 20 MCG PEN 2 PACK',
        },
        Name: '6544-2',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPcAAK',
      Name: 'LA-003586',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsHAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lMDxEAM',
        OCE__Product__r: {
          Name: 'PLOMAX 50 MCG PEN',
        },
        Name: '6545-3',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPdAAK',
      Name: 'LA-003587',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsIAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lMDxEAM',
        OCE__Product__r: {
          Name: 'PLOMAX 50 MCG PEN',
        },
        Name: '6545-4',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPkAAK',
      Name: 'LA-003594',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsPAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME0EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 20 MG Sign',
        },
        Name: '6549-1',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPlAAK',
      Name: 'LA-003595',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsQAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME0EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 20 MG Sign',
        },
        Name: '6549-2',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPmAAK',
      Name: 'LA-003596',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsRAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME0EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 20 MG Sign',
        },
        Name: '6549-3',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPnAAK',
      Name: 'LA-003597',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsSAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME2EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 50 MG',
        },
        Name: '6746-1',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPoAAK',
      Name: 'LA-003598',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsTAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME2EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 50 MG',
        },
        Name: '6746-2',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPtAAK',
      Name: 'LA-003603',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2023-09-20T13:26:18.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsYAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME4EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 20 MG Sign',
        },
        Name: '3246-1',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPuAAK',
      Name: 'LA-003604',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033EsZAAU',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lME4EAM',
        OCE__Product__r: {
          Name: 'ADRAVIL TAB 20 MG Sign',
        },
        Name: '3246-5',
      },
      OCE__LotExpirationDate__c: '2020-10-15',
    },
    {
      Id: 'a5h0k000000ZcPMAA0',
      Name: 'LA-003570',
      CreatedDate: '2022-12-22T16:51:36.000+0000',
      LastModifiedDate: '2022-12-22T16:51:36.000+0000',
      OCE__IsActive__c: true,
      OCE__Lot__c: 'a3m0k0000033Es1AAE',
      OCE__Lot__r: {
        OCE__Product__c: 'a5E0k000001lMDpEAM',
        OCE__Product__r: {
          Name: 'PROZALAND 5 MCG 20 Sign',
        },
        Name: '9841-1',
      },
      OCE__LotExpirationDate__c: '2020-12-05',
    },
  ],
  { totalSize: 13, done: true },
]);

export const changeLotStatus = jest.fn((status, id) => {
  return Promise.resolve([{ id: id, success: true, errors: [] }]);
});
