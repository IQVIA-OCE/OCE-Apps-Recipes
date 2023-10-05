import { mapOutstandingSampleRequests } from './utils';

describe('OutstandingSampleRequests utils', () => {
  const mockApiResponse = [
    {
      Account__c: '001O000001keIaMIAU',
      'Account__r.AccountFullName__c': 'AARON MORITA' ,
      Call__c: 'a2KO000000I6bvLMAR',
      Id: 'a6cO0000000GMMHIA4',
      Quantity__c: 0,
      'Sample__r.Id': 'a4sO00000000sXCIAY',
      'Sample__r.Name': 'QA Market',
      attributes: {
        type: 'CallSampleRequest__c',
        url: '/services/data/v50.0/sobjects/CallSampleRequest__c/a6cO0000000GMMHIA4',
      },
    },
    {
      Account__c: '001O000001keIaMIAU',
      'Account__r.AccountFullName__c': 'AARON MORITA' ,
      Call__c: 'a2KO000000I6bvLMAR',
      Id: 'a6cO0000000GMMHIA4',
      Quantity__c: 2,
      'Sample__r.Id': 'a4sO00000000sXCIAY2',
      'Sample__r.Name': 'QA Market 2',
      attributes: {
        type: 'CallSampleRequest__c',
        url: '/services/data/v50.0/sobjects/CallSampleRequest__c/a6cO0000000GMMHIA4',
      },
    },
  ];
  it('mapOutstandingSampleRequests', () => {
    const mappedResult = mapOutstandingSampleRequests(mockApiResponse);
    expect(mappedResult).toStrictEqual([
      {
        accountId: '001O000001keIaMIAU',
        Name: 'AARON MORITA',
        callId: 'a2KO000000I6bvLMAR',
        Id: 'a6cO0000000GMMHIA4',
        samples: [
          {
            quantity: 0,
            name: 'QA Market',
            Id: 'a4sO00000000sXCIAY',
          },
          {
            quantity: 2,
            name: 'QA Market 2',
            Id: 'a4sO00000000sXCIAY2',
          },
        ],
      },
    ]);
  });

  it('mapOutstandingSampleRequests empty', () => {
    const mappedResult = mapOutstandingSampleRequests();
    expect(mappedResult).toStrictEqual([]);
  });
});
