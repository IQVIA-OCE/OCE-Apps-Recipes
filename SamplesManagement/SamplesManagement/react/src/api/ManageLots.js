import api from '../utils/api';
import { NAMESPACE } from '../constants/constants';

export const fetchLots = (limit = 4) =>
  api.query(
    `SELECT Id, Name, CreatedDate, LastModifiedDate, ${NAMESPACE}IsActive__c, ${NAMESPACE}Lot__c, ${NAMESPACE}Lot__r.${NAMESPACE}Product__c, ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name, ${NAMESPACE}LotExpirationDate__c, ${NAMESPACE}Lot__r.Name FROM ${NAMESPACE}SampleLotAllocation__c WHERE ${NAMESPACE}Lot__c != null AND ${NAMESPACE}IsActive__c = true ORDER BY ${NAMESPACE}LotExpirationDate__c Asc LIMIT ${limit}`
  );

export const fetchLotsOffset = (limit, status, offset = 0) => {
  const active = status ? `AND ${NAMESPACE}IsActive__c = true` : '';
  return api.query(
    `SELECT Id, Name, CreatedDate, LastModifiedDate, ${NAMESPACE}IsActive__c, ${NAMESPACE}Lot__c, ${NAMESPACE}Lot__r.${NAMESPACE}Product__c, ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name, ${NAMESPACE}LotExpirationDate__c, ${NAMESPACE}Lot__r.Name FROM ${NAMESPACE}SampleLotAllocation__c WHERE ${NAMESPACE}Lot__c != null ${active} ORDER BY ${NAMESPACE}LotExpirationDate__c, Name Asc LIMIT ${limit} OFFSET ${offset}`
  );
};

export const changeLotStatus = (status, id) =>
  api.update(`${NAMESPACE}SampleLotAllocation__c`, id, { [`${NAMESPACE}IsActive__c`]: status });
