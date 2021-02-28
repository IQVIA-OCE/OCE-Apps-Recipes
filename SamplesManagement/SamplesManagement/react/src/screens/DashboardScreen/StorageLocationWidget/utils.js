export const normalizeLocation = records =>
  records.length ? records[0]['OCE__FullAddress__c'] : '';
