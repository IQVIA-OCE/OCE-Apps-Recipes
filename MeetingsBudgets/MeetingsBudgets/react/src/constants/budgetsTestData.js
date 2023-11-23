export const MAPPED_BUDGETS_DATA = [
  {
    actualAmount: null,
    childrenAllocatedAmount: null,
    consumptionBudget: false,
    currencyISOCode: 'USD',
    endDate: '',
    estimatedAmount: null,
    id: 'a226g000000gR08AAE',
    meetingType: '',
    name: 'Akron Budget',
    remaining: 0,
    startDate: '',
    status: 'Active',
    totalAmount: null,
  },
  {
    actualAmount: 966.67,
    childrenAllocatedAmount: 10000,
    consumptionBudget: true,
    currencyISOCode: 'USD',
    endDate: '2020-07-22',
    estimatedAmount: 55564.88,
    id: 'a226g000000gb35AAA',
    meetingType:
      'Speaker_Meeting;Rep_Presentation;Displays_Exhibits;HCP_Sponsorship',
    name: 'Alex',
    remaining: 999943468.45,
    startDate: '2019-05-01',
    status: 'Active',
    totalAmount: 1000000000,
  },
];

export const ORIGINAL_BUDGETS_DATA = [
  {
    OCE__ActualAmount__c: null,
    OCE__ChildrenAllocatedAmount__c: null,
    OCE__ConsumptionBudget__c: false,
    CurrencyIsoCode: 'USD',
    OCE__EndDate__c: '',
    OCE__EstimatedAmount__c: null,
    Id: 'a226g000000gR08AAE',
    OCE__MeetingType__c: '',
    Name: 'Akron Budget',
    OCE__Remaining__c: 0,
    OCE__StartDate__c: '',
    OCE__Status__c: 'Active',
    OCE__TotalAmount__c: null,
  },
  {
    OCE__ActualAmount__c: 966.67,
    OCE__ChildrenAllocatedAmount__c: 10000,
    OCE__ConsumptionBudget__c: true,
    CurrencyIsoCode: 'USD',
    OCE__EndDate__c: '2020-07-22',
    OCE__EstimatedAmount__c: 55564.88,
    Id: 'a226g000000gb35AAA',
    OCE__MeetingType__c:
      'Speaker_Meeting;Rep_Presentation;Displays_Exhibits;HCP_Sponsorship',
    Name: 'Alex',
    OCE__Remaining__c: 999943468.45,
    OCE__StartDate__c: '2019-05-01',
    OCE__Status__c: 'Active',
    OCE__TotalAmount__c: 1000000000,
  },
];

export const MAPPED_MEETING_DATA = {
  id: 'a471s0000009RqfAAE',
  name: 'Test Budget',
  endDate: '2021-09-08T21:00:00.000+0000',
  startDate: '2021-09-07T19:00:00.000+0000',
  recordTypeDevName: 'Speaker_Meeting',
  recordTypeName: 'Speaker Meeting',
};

export const ORIGINAL_MEETING_DATA = {
  Id: 'a471s0000009RqfAAE',
  Name: 'Test Budget',
  OCE__EndDateTime__c: '2021-09-08T21:00:00.000+0000',
  OCE__StartDateTime__c: '2021-09-07T19:00:00.000+0000',
  'RecordType.DeveloperName': 'Speaker_Meeting',
  'RecordType.Name': 'Speaker Meeting',
};
