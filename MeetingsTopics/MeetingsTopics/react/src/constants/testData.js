export const FETCH_MEETING_RESPONSE = [
  [
    {
      Id: 'a3c04000000GsRuAAK',
      OCE__StartDateTime__c: '2021-05-31T12:47:58.000+0000',
      uid: 'a3c04000000GsRuAAK',
    },
  ],
];

export const FETCH_MEETING_PRODUCT = [
  {
    id: 'a5T6g0008809JEtEAM'
  }
];

export const FETCH_PRODUCTS_RESPONSE = [
  {
    OCE__Product__c: 'a4J6g000000gHDdEAM',
    OCE__Topic__c: 'a5T6g0000009JFDEA2',
    uid: 'a5T6g0000009JFDEA2'
  },
  {
    OCE__Product__c: 'a4J6g000000gHDQEA2',
    OCE__Topic__c: 'a5T6g0000009JFDEA2',
    uid: 'a5T6g0000009JFDEA2'
  },
];

export const FETCH_TOPICS_DATA = [
  {
    id: 'a5T6g0000009JEtEAM',
    name: 'Meeting Topic 1',
    meetingType: null,
    status: 'Approved',
    startDate: '2020-07-01T19:00:00.000Z',
    endDate: '2020-11-27T20:00:00.000Z',
  },
  {
    id: 'a5T6g0000079JFDEA2',
    name: 'Dd_RP',
    meetingType: 'RepPresentation',
    status: 'Approved',
    startDate: null,
    endDate: null,
  },
  {
    id: 'a5T6g0000009JFDEA2',
    name: 'Meeting Topic 2',
    meetingType: null,
    status: 'Approved',
    startDate: '2020-07-01T19:00:00.000Z',
    endDate: '2020-08-01T19:00:00.000Z',
  },
  {
    id: 'a5T6g0000009JFXEA2',
    name: 'Child Topic #1.1 long long name long long name long long name long long name lo',
    meetingType: 'Speaker Meeting',
    status: 'Approved',
    startDate: '2020-07-01T19:00:00.000Z',
    endDate: '2021-05-05T19:00:00.000Z',
  },
  {
    id: 'a5T6g0000009JWSEA2',
    name: 'Meeting Topic 1919',
    meetingType: 'Speaker Meeting',
    status: 'Approved',
    startDate: '2020-07-01T19:00:00.000Z',
    endDate: null,
  },
];

export const SEARCH_TOPICS_DATA = [
  {
    id: 'a5T6g0000009JEtEAM',
    name: 'Meeting Topic 2',
    meetingType: 'RepPresentation',
    status: 'Approved',
    startDate: '2020-08-01T19:00:00.000Z',
    endDate: '2020-10-31T19:00:00.000Z',
  },
];

export const TOPIC = {
  id: 'a5T6g0000009JEtEAM',
  name: 'Meeting Topic 2',
  meetingType: 'RepPresentation',
  meetingRecordTypes: 'Rep_Presentation',
  status: 'Approved',
  startDate: '2020-08-01T19:00:00.000Z',
  endDate: '2020-10-31T19:00:00.000Z',
  currencyIsoCode: 'CurrencyIsoCode',
  uid: 'a5T6g0000009JEtEAM',
};

export const TOPIC_MAP = {
  a5T6g0000009JEtEAM: TOPIC
};

export const STATE_FOR_ADDING_TOPICS_TO_MEETING = {
  loadingStatus: 'submitting',
  meeting: {
    id: 'a3c04000000Gs0UAAS',
    startDateTime: '2021-05-31T12:47:58.000+0000',
  },
  recordType: { id: '0126g000000LvxTAAS' },
  topics: FETCH_TOPICS_DATA,
  isEnable: false,
  topicProduct: [],
  selectedTopicsMap: TOPIC_MAP ,
  params: { limit: 15, offset: 0, searchQuery: '' },
  error: null,
  meetingTopics: [],
  meetingTopicsMap: {},
};

export const STATE_FOR_DELETING_TOPICS_TO_MEETING = {
  loadingStatus: 'submitting',
  meeting: {
    id: 'a3c04000000Gs0UAAS',
    startDateTime: '2021-05-31T12:47:58.000+0000',
  },
  recordType: { id: '0126g000000LvxTAAS' },
  topics: FETCH_TOPICS_DATA,
  isEnable: true,
  topicProduct: [],
  selectedTopicsMap: TOPIC_MAP,
  params: { limit: 15, offset: 0, searchQuery: '' },
  error: null,
  meetingTopics: [
    {
      CreatedDate: '2021-07-21T15:03:42.525+0000',
      Name: '- / AHSAN',
      id: 'oce__meetingtopic__c-ACF189B9-DBE0-44C1-8422-67A106AA1D3E',
      topic: 'a5T6g0000009JEtEAM',
      uid: 'oce__meetingtopic__c-ACF189B9-DBE0-44C1-8422-67A106AA1D3E',
    },
  ],
  meetingTopicsMap: {
    a4v040000000MakAAE: {
      CreatedDate: '2021-07-21T15:03:42.525+0000',
      Name: '- / AHSAN',
      id: 'oce__meetingtopic__c-ACF189B9-DBE0-44C1-8422-67A106AA1D3E',
      topic: 'a5T6g0000009JEtEAM',
      uid: 'oce__meetingtopic__c-ACF189B9-DBE0-44C1-8422-67A106AA1D3E',
    },
  },
};

export const MOCK_MEETING = {
  Id: "a470k0000010B32AAE",
  Name: "Meeting1 for testing Primary Meeting Locations",
  OCE__EndDateTime__c: "2021-09-21T00:00:00.000+0000",
  OCE__StartDateTime__c: "2021-09-19T00:00:00.000+0000",
  [`RecordType.DeveloperName`]: "Speaker_Meeting",
  [`RecordType.Name`]: "Speaker Meeting",
  uid: "a470k0000010B32AAE",
};
