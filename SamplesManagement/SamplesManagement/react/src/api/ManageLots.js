import api from '../utils/api';

export const fetchLots = (limit = 4) =>
  api.query(
    `SELECT Id, Name, CreatedDate, LastModifiedDate, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name, OCE__LotExpirationDate__c, OCE__Lot__r.Name FROM OCE__SampleLotAllocation__c WHERE OCE__Lot__c != null AND OCE__IsActive__c = true ORDER BY OCE__LotExpirationDate__c Asc LIMIT ${limit}`
  );

export const fetchLotsOffset = (limit, status, offset = 0) => {
  const active = status ? 'AND OCE__IsActive__c = true' : '';
  return api.query(
    `SELECT Id, Name, CreatedDate, LastModifiedDate, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name, OCE__LotExpirationDate__c, OCE__Lot__r.Name FROM OCE__SampleLotAllocation__c WHERE OCE__Lot__c != null ${active} ORDER BY OCE__LotExpirationDate__c, Name Asc LIMIT ${limit} OFFSET ${offset}`
  );
};

export const changeLotStatus = (status, id) =>
  api.update('OCE__SampleLotAllocation__c', id, { OCE__IsActive__c: status });
