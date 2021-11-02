import { normalizeLots } from './utils';

const keys = {
  CreatedDate: 'createdDate',
  Id: 'id',
  Name: 'name',
  LastModifiedDate: 'lastModified',
  OCE__Lot__r: 'lot',
  OCE__Lot__c: 'lotId',
  OCE__LotExpirationDate__c: 'expirationDate',
  OCE__Product__c: 'productId',
  OCE__Product__r: 'product'
}
const rawData = [
  {
    attributes: {
      type: 'OCE__SampleLotAllocation__c',
      url:
        '/services/data/v43.0/sobjects/OCE__SampleLotAllocation__c/a2Af400000ZgLGKEA3',
    },
    Name: 'LA-000778',
    OCE__Lot__c: 'a1Yf4000000kxHbEAI',
    LastModifiedDate: '2020-07-21T11:51:38.000+0000',
    OCE__Lot__r: {
      Name: 'L-0001',
      attributes: {
        url: '/services/data/v43.0/sobjects/OCE__Lot__c/a1Yf4000000kxHbEAI',
        type: 'OCE__Lot__c',
      },
      OCE__Product__c: 'a22f4000000kaTyAAI',
      OCE__Product__r: {
        Name: 'OKSF-2834_1',
        attributes: {
          type: 'OCE__Product__c',
          url:
            '/services/data/v43.0/sobjects/OCE__Product__c/a22f4000000kaTyAAI',
        },
      },
    },
    OCE__LotExpirationDate__c: null,
    CreatedDate: '2019-06-22T22:05:40.000+0000',
    OCE__IsActive__c: true,
    Id: 'a2Af400000ZgLGKEA3',
  },
];

describe('utils', () => {
  it('normalizeLots: should normalize lots', () => {
    const data = normalizeLots(keys)(rawData);
    expect(data).toEqual([{
      attributes: {
        type: 'OCE__SampleLotAllocation__c',
        url:
          '/services/data/v43.0/sobjects/OCE__SampleLotAllocation__c/a2Af400000ZgLGKEA3',
      },
      name: 'LA-000778',
      lotId: 'a1Yf4000000kxHbEAI',
      lastModified: '2020-07-21T11:51:38.000+0000',
      lot: {
        name: 'L-0001',
        attributes: {
          url: '/services/data/v43.0/sobjects/OCE__Lot__c/a1Yf4000000kxHbEAI',
          type: 'OCE__Lot__c',
        },
        productId: 'a22f4000000kaTyAAI',
        product: {
          name: 'OKSF-2834_1',
          attributes: {
            type: 'OCE__Product__c',
            url:
              '/services/data/v43.0/sobjects/OCE__Product__c/a22f4000000kaTyAAI',
          },
        },
      },
      expirationDate: null,
      createdDate: '2019-06-22T22:05:40.000+0000',
      OCE__IsActive__c: true,
      id: 'a2Af400000ZgLGKEA3',
    }]);
  });
});
