import { NAMESPACE } from '../constants';

export const CALL_MAPPED = {
  id: 'a2W0k000002LNqnEAG',
  callDateTime: '2023-02-22T11:36:00.000+0000',
  accountId: '0010k00001TmnZUAAZ',
  account: {
    isPersonAccount: 1,
    recordType: {
      developerName: 'BC',
    },
  },
  status: 'Draft',
};
export const CALL_RAW_IOS = {
  Id: 'a2W0k000002LNqnEAG',
  [`${NAMESPACE}Account__c`]: '0010k00001TmnZUAAZ',
  [`${NAMESPACE}Account__r.IsPersonAccount`]: 1,
  [`${NAMESPACE}Account__r.RecordType.DeveloperName`]: 'BC',
  [`${NAMESPACE}CallDateTime__c`]: '2023-02-22T11:36:00.000+0000',
  [`${NAMESPACE}Status__c`]: 'Draft',
};
export const CALL_RAW_WEB = {
  Id: 'a2W0k000002LNqnEAG',
  [`${NAMESPACE}Account__c`]: '0010k00001TmnZUAAZ',
  [`${NAMESPACE}Account__r`]: { IsPersonAccount: 1, RecordType: { DeveloperName: 'BC' } },
  [`${NAMESPACE}CallDateTime__c`]: '2023-02-22T11:36:00.000+0000',
  [`${NAMESPACE}Status__c`]: 'Draft',
};
