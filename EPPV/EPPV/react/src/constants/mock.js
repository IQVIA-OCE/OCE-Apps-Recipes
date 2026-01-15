export const TODO_IOS_RAW = [
  {
    Id: 'a6h0k000000D2l4AAC',
    OCE__AccountComplianceCycle__c: 'a1A0k000009AG8KEAW',
    'OCE__AccountComplianceCycle__r.OCE__CycleEndDate__c': '2022-12-29',
    'OCE__AccountComplianceCycle__r.OCE__CycleStartDate__c': '2022-12-16',
    'OCE__AccountComplianceCycle__r.OCE__SortOrder__c': 1,
    OCE__AccountCompliance__c: 'a1B0k0000026S6CEAU',
    'OCE__AccountCompliance__r.OCE__Account__c': '0010k00001TO7o0AAD',
    'OCE__AccountCompliance__r.OCE__Account__r.OCE__AccountFullName__c':
      'AMER RAHMAN',
    'OCE__AccountCompliance__r.OCE__Compliance__r.Name': 'compliance 3',
  },
  {
    Id: 'a6h0k000000D2l9AAC',
    OCE__AccountComplianceCycle__c: 'a1A0k000009AG93EAG',
    'OCE__AccountComplianceCycle__r.OCE__CycleEndDate__c': '2022-12-29',
    'OCE__AccountComplianceCycle__r.OCE__CycleStartDate__c': '2022-12-16',
    'OCE__AccountComplianceCycle__r.OCE__SortOrder__c': 2,
    OCE__AccountCompliance__c: 'a1B0k0000026S6bEAE',
    'OCE__AccountCompliance__r.OCE__Account__c': '0010k00001TO7o0AAD',
    'OCE__AccountCompliance__r.OCE__Account__r.OCE__AccountFullName__c':
      'AMER RAHMAN',
    'OCE__AccountCompliance__r.OCE__Compliance__r.Name': 'test1',
  },
];

export const TODO_WEB_RAW = [
  {
    Id: 'a5Q6g000000Od8TEAS',
    OCE__AccountCompliance__c: 'a5b6g000000IGUpAAO',
    OCE__AccountCompliance__r: {
      OCE__Compliance__r: {
        Name: 'Palla-Eppv',
      },
      OCE__Account__r: null,
      OCE__Account__c: null,
    },
    OCE__AccountComplianceCycle__c: 'a5a6g000000M2qPAAS',
    OCE__AccountComplianceCycle__r: {
      OCE__SortOrder__c: 1,
      OCE__CycleStartDate__c: '2022-04-01',
      OCE__CycleEndDate__c: '2022-04-01',
    },
  },
  {
    Id: 'a5Q6g000000Od8ZEAS',
    OCE__AccountCompliance__c: 'a5b6g000000IGUuAAO',
    OCE__AccountCompliance__r: {
      OCE__Compliance__r: {
        Name: 'Palla-Eppv',
      },
      OCE__Account__r: {
        OCE__AccountFullName__c: 'AMER RAHMAN',
      },
      OCE__Account__c: '0016g000004imoIAAQ',
    },
    OCE__AccountComplianceCycle__c: 'a5a6g000000M2qVAAS',
    OCE__AccountComplianceCycle__r: {
      OCE__SortOrder__c: 1,
      OCE__CycleStartDate__c: '2022-04-01',
      OCE__CycleEndDate__c: '2022-04-01',
    },
  },
];

export const TODO_IOS_NORMALIZED = [
  {
    Id: 'a6h0k000000D2l4AAC',
    accountComplianceId: 'a1B0k0000026S6CEAU',
    accountComplianceCycleId: 'a1A0k000009AG8KEAW',
    compliance: 'compliance 3',
    accountName: 'AMER RAHMAN',
    accountId: '0010k00001TO7o0AAD',
    cycle: 1,
    cycleStartdate: '2022-12-16',
    cycleEndDate: '2022-12-29',
  },
  {
    Id: 'a6h0k000000D2l9AAC',
    accountComplianceId: 'a1B0k0000026S6bEAE',
    accountComplianceCycleId: 'a1A0k000009AG93EAG',
    compliance: 'test1',
    accountName: 'AMER RAHMAN',
    accountId: '0010k00001TO7o0AAD',
    cycle: 2,
    cycleStartdate: '2022-12-16',
    cycleEndDate: '2022-12-29',
  },
];

export const TODO_WEB_NORMALIZED = [
  {
    Id: 'a5Q6g000000Od8TEAS',
    accountComplianceId: 'a5b6g000000IGUpAAO',
    accountComplianceCycleId: 'a5a6g000000M2qPAAS',
    compliance: 'Palla-Eppv',
    accountName: '',
    accountId: null,
    cycle: 1,
    cycleStartdate: '2022-04-01',
    cycleEndDate: '2022-04-01',
  },
  {
    Id: 'a5Q6g000000Od8ZEAS',
    accountComplianceId: 'a5b6g000000IGUuAAO',
    accountComplianceCycleId: 'a5a6g000000M2qVAAS',
    compliance: 'Palla-Eppv',
    accountName: 'AMER RAHMAN',
    accountId: '0016g000004imoIAAQ',
    cycle: 1,
    cycleStartdate: '2022-04-01',
    cycleEndDate: '2022-04-01',
  },
];

export const UPSERT_PAYLOAD_RAW = {
  Id: 'a6h0k000000D2l9AAC',
  accountComplianceCycleId: 'a1A0k000009AG93EAG',
  accountComplianceId: 'a1B0k0000026S6bEAE',
  accountId: '0010k00001TO7o0AAD',
  accountName: 'AMER RAHMAN',
  completionDate: '2022-12-20T14:07:54.481Z',
  compliance: 'test1',
  cycle: 2,
  cycleEndDate: '2022-12-29',
  cycleStartdate: '2022-12-16',
  otherInterviewee: 'Intterviewee',
  surveyType: {
    active: true,
    defaultValue: false,
    label: 'Face To Face',
    value: 'Face To Face',
  },
};

export const UPSERT_PAYLOAD_NORMALIZED = [
  {
    OCE__CompletionDate__c: '2022-12-20',
    OCE__IntervieweeOther__c: 'Intterviewee',
    OCE__Interviewee__c: null,
    OCE__Status__c: 'Completed',
    OCE__SurveyType__c: 'Face To Face',
    id: 'a6h0k000000D2l9AAC',
    sObject: 'OCE__ToDo__c',
  },
  {
    OCE__CompletionDate__c: '2022-12-20',
    OCE__Status__c: 'Completed',
    OCE__SurveyType__c: 'Face To Face',
    id: 'a1A0k000009AG93EAG',
    sObject: 'OCE__AccountComplianceCycle__c',
  },
  {
    OCE__Status__c: 'Done',
    id: 'a1B0k0000026S6bEAE',
    sObject: 'OCE__AccountCompliance__c',
  },
];
