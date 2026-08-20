export const CALL_ORIG_DATA = {
  Id: 'a2W0k000003mhHeEAI',
  Name: 'C-00000050',
  Account__c: '0010k00001QPitMAAT',
  Account__r: {
    Name: 'AMER RAHMAN',
  },
  'Account__r.Name': 'AMER RAHMAN',
  CallDateTime__c: '2022-12-05T15:28:00.000+0000',
  Status__c: 'Draft',
  OwnerId: '0050k000004CinPAAS',
};

export const CALL_MAPPED_DATA = {
  account: 'AMER RAHMAN',
  accountId: '0010k00001QPitMAAT',
  callDateTime: '2022-12-05T15:28:00.000+0000',
  id: 'a2W0k000003mhHeEAI',
  name: 'C-00000050',
  ownerId: '0050k000004CinPAAS',
  status: 'Draft',
};

export const ORDERS_ORIG_DATA = [
  {
    Id: 'a4Y0k000000EVFSEA4',
    Name: 'O-0002',
    NetAmount__c: null,
    OrderDate__c: '2022-12-05',
    Status__c: 'In Progress',
    SubType__c: 'Normal',
    Type__c: 'Direct',
  },
  {
    Id: 'a4Y0k000000EVG6EAO',
    Name: 'O-0010',
    NetAmount__c: 10,
    OrderDate__c: '2022-12-05',
    Status__c: 'In Progress',
    SubType__c: null,
    Type__c: 'Direct',
  },
];

export const ORDERS_MAPPED_DATA = [
  {
    date: '2022-12-05',
    dateType: 'Date',
    id: 'a4Y0k000000EVFSEA4',
    name: 'O-0002',
    netAmount: null,
    sObject: 'Order2__c',
    status: 'In Progress',
    typeAndSubtype: 'Direct / Normal',
  },
  {
    date: '2022-12-05',
    dateType: 'Date',
    id: 'a4Y0k000000EVG6EAO',
    name: 'O-0010',
    netAmount: 10,
    sObject: 'Order2__c',
    status: 'In Progress',
    typeAndSubtype: 'Direct',
  },
];

export const INQUIRIES_ORIG_DATA = [
  {
    Id: 'a3X0k000000JMTjEAO',
    Name: 'INQ-0011',
    Account__c: '0010k00001QPitMAAT',
    Account__r: {
      Name: 'AMER RAHMAN',
    },
    'Account__r.Name': 'AMER RAHMAN',
    Inquiry_Type__c: null,
    Priority__c: 0,
    ResponsePreference__c: 'Phone',
  },
  {
    Id: 'a3X0k000000JMSlEAO',
    Name: 'INQ-0003',
    Account__c: '0010k00001QPitMAAT',
    Account__r: {
      Name: 'AMER RAHMAN',
    },
    'Account__r.Name': 'AMER RAHMAN',
    Inquiry_Type__c: 'Efficacy',
    Priority__c: 1,
    ResponsePreference__c: 'Email',
  },
];

export const INQUIRIES_MAPPED_DATA = [
  {
    account: 'AMER RAHMAN',
    accountId: '0010k00001QPitMAAT',
    id: 'a3X0k000000JMTjEAO',
    name: 'INQ-0011',
    priority: 'No',
    responsePreference: 'Phone',
    sObject: 'Inquiry__c',
    type: null,
  },
  {
    account: 'AMER RAHMAN',
    accountId: '0010k00001QPitMAAT',
    id: 'a3X0k000000JMSlEAO',
    name: 'INQ-0003',
    priority: 'Yes',
    responsePreference: 'Email',
    sObject: 'Inquiry__c',
    type: 'Efficacy',
  },
];

export const STORE_CHECK_ORIG_DATA = [
  {
    Id: 'a6D0k0000009PZhEAM',
    Name: 'SC-0000000001',
    Status__c: 'Draft',
    StoreCheckDateTime__c: '2022-12-05T15:28:00.000+0000',
  },
];

export const STORE_CHECK_MAPPED_DATA = [
  {
    dateTime: '2022-12-05T15:28:00.000+0000',
    dateType: 'DateTime',
    id: 'a6D0k0000009PZhEAM',
    name: 'SC-0000000001',
    sObject: 'StoreCheck__c',
    status: 'Draft',
  },
];

export const CALL_ATTENDEES_ORIG_DATA = [
  {
    Id: 'a2m9D0000009el0QAA',
    Account__c: '0019D00000PQiaOQAT',
    Account__r: {
      Name: 'Account Plat3',
    },
    'Account__r.Name': 'Account Plat3',
  },
  {
    Id: 'a2m9D0000009el2QAA',
    Account__c: '0019D00000PRM7IQAX',
    Account__r: {
      Name: 'AccountPK3 new',
    },
    'Account__r.Name': 'AccountPK3 new',
  },
];

export const CALL_ATTENDEES_MAPPED_DATA = [
  {
    account: 'Account Plat3',
    accountId: '0019D00000PQiaOQAT',
    id: 'a2m9D0000009el0QAA',
  },
  {
    account: 'AccountPK3 new',
    accountId: '0019D00000PRM7IQAX',
    id: 'a2m9D0000009el2QAA',
  },
];

export const INQUIRY_CHANNEL_ORIG_DATA = [
  {
    active: true,
    label: 'Call Center',
    value: 'Call Center',
  },
  {
    active: true,
    label: 'Email',
    value: 'Email',
  },
  {
    active: true,
    label: 'Fax',
    value: 'Fax',
  },
  {
    active: true,
    label: 'Field Request',
    value: 'Field Request',
  },
  {
    active: true,
    label: 'Web',
    value: 'Web',
  },
];

export const INQUIRY_CHANNEL_MAPPED_DATA = [
  {
    label: 'Call Center',
    value: 'Call Center',
  },
  {
    label: 'Email',
    value: 'Email',
  },
  {
    label: 'Fax',
    value: 'Fax',
  },
  {
    label: 'Field Request',
    value: 'Field Request',
  },
  {
    label: 'Web',
    value: 'Web',
  },
];

export const INQUIRY_TYPE_ORIG_DATA = [
  {
    active: true,
    label: 'Efficacy',
    value: 'Efficacy',
  },
  {
    active: true,
    label: 'Safety',
    value: 'Safety',
  },
  {
    active: true,
    label: 'Other',
    value: 'Other',
  },
];

export const INQUIRY_TYPE_MAPPED_DATA = [
  {
    label: 'Efficacy',
    value: 'Efficacy',
  },
  {
    label: 'Safety',
    value: 'Safety',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

export const INQUIRY_FROM_FORM = {
  account: 'a2m9D0000009el0QAA',
  call: 'a2W0k000003mhHeEAI',
  email: 'test.email@gmail.com',
  fax: undefined,
  inquiryChanel: 'Email',
  inquiryType: 'Safety',
  isSignatureCopyRequested: false,
  phone: undefined,
  priority: true,
  responsePreference: 'Email',
  specialHandlingInstruction: 'Some test text',
  status: 'Draft',
};

export const INQUIRY_TO_SAVE = {
  Account__c: 'a2m9D0000009el0QAA',
  Call__c: 'a2W0k000003mhHeEAI',
  Email__c: 'test.email@gmail.com',
  Fax__c: undefined,
  InquiryChannel__c: 'Email',
  Inquiry_Type__c: 'Safety',
  IsSignatureCopyRequested__c: false,
  Phone__c: undefined,
  Priority__c: true,
  ResponsePreference__c: 'Email',
  SpecialHandlingInstruction__c: 'Some test text',
  Status__c: 'Draft',
};
