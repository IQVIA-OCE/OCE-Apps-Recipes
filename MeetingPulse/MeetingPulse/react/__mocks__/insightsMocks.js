export const INSIGHTS_MOCK = [
  {
    'InsightAccount__r.Name': 'Aaa BBb',
    InsightText__c: null,
    ParentInsight__c: 'a3r0p00000059TmAAI',
    Id: 'a3r0p00000059TnAAI',
    'ParentInsight__r.Name': 'Test',
    Name: 'Test',
    'InsightAccount__r.Id': '0010p000013E3JiAAK',
  },
  {
    InsightText__c: 'Test',
    'InsightAccount__r.Id': '0010p000013E3JiAAK',
    ParentInsight__c: 'a3r0p00000059TSAAY',
    'ParentInsight__r.Name': 'Test',
    Name: 'Test',
    Id: 'a3r0p00000059TXAAY',
    'InsightAccount__r.Name': 'Aaa BBb',
  },
  {
    Id: 'a3r0p000000590eAAA',
    InsightText__c: null,
    'InsightAccount__r.Name': 'AccountRecord1Test',
    Name: 'Qwer66',
    'ParentInsight__r.Name': null,
    'InsightAccount__r.Id': '0010p000013EfUqAAK',
    ParentInsight__c: null,
  },
  {
    InsightText__c: null,
    Id: 'a3r0p00000058U0AAI',
    ParentInsight__c: null,
    'InsightAccount__r.Id': '0015g00000Zr42DAAR',
    'InsightAccount__r.Name': 'Acc1 IPad22 Test1 iPad22',
    'ParentInsight__r.Name': null,
    Name: 'Qwer1',
  },
];

export const MOCK_ACCOUNT_WITH_INSIGHTS = {
  id: '0010p000013E3JiAAK',
  name: 'Aaa BBb',
  insights: [
    {
      id: 'a3r0p00000059TnAAI',
      name: 'Test insight 1',
      text: 'Test question 1',
      parentInsightId: 'a3r0p00000059TmAAI',
    },
    {
      id: 'a3r0p00000059TXAAY',
      name: 'Test insight 2',
      text: 'Test question 2',
      parentInsightId: 'a3r0p00000059TSAAY',
    },
  ],
};
