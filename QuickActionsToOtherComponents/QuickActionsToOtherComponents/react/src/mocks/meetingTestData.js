export const MEETING_ORIG_DATA = {
  Id: 'a4C0k000000mXHLEA2',
  Name: 'Speaker Meeting SR',
};

export const MEETING_MAPPED_DATA = {
  id: 'a4C0k000000mXHLEA2',
  name: 'Speaker Meeting SR',
};

export const CALLS_ORIG_DATA = [
  {
    Id: 'a2W0k000003mhLbEAI',
    Name: 'C-00000092',
    Account__c: '0010k00001QPiuOAAT',
    Account__r: {
      Name: 'Barton Memorial Hospital',
    },
    'Account__r.Name': 'Barton Memorial Hospital',
    CallDateTime__c: '2022-12-06T11:09:00.000+0000',
    Channel__c: 'Face To Face',
    Status__c: 'Submitted',
  },
  {
    Id: 'a2W0k000003mhKnEAI',
    Name: 'C-00000080',
    Account__c: '0010k00001QPiuOAAT',
    Account__r: {
      Name: 'Barton Memorial Hospital',
    },
    'Account__r.Name': 'Barton Memorial Hospital',
    CallDateTime__c: '2022-12-07T11:02:00.000+0000',
    Channel__c: 'Face To Face',
    Status__c: 'Draft',
  },
];

export const CALLS_MAPPED_DATA = [
  {
    account: 'Barton Memorial Hospital',
    accountId: '0010k00001QPiuOAAT',
    channel: 'Face To Face',
    dateTime: '2022-12-06T11:09:00.000+0000',
    dateType: 'DateTime',
    id: 'a2W0k000003mhLbEAI',
    name: 'C-00000092',
    sObject: 'Call__c',
    status: 'Submitted',
  },
  {
    account: 'Barton Memorial Hospital',
    accountId: '0010k00001QPiuOAAT',
    channel: 'Face To Face',
    dateTime: '2022-12-07T11:02:00.000+0000',
    dateType: 'DateTime',
    id: 'a2W0k000003mhKnEAI',
    name: 'C-00000080',
    sObject: 'Call__c',
    status: 'Draft',
  },
];

export const MEETING_ATTENDEES_ORIG_DATA = [
  {
    Id: 'a470k000001IjE2AAK',
    Name: 'AMER RAHMAN',
    Customer__c: '0010k00001QPitMAAT',
  },
  {
    Id: 'a470k000001IjEBAA0',
    Name: 'Barton Memorial Hospital',
    Customer__c: '0010k00001QPiuOAAT',
  },
];

export const MEETING_ATTENDEES_MAPPED_DATA = [
  {
    accountId: '0010k00001QPitMAAT',
    id: 'a470k000001IjE2AAK',
    name: 'AMER RAHMAN',
  },
  {
    accountId: '0010k00001QPiuOAAT',
    id: 'a470k000001IjEBAA0',
    name: 'Barton Memorial Hospital',
  },
];
