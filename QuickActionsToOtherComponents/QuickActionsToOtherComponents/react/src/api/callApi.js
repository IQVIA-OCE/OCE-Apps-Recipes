import { databaseManager } from 'oce-apps-bridges';
import { NAMESPACE } from '../constants';

export const ORDERS_QUERY = `
  SELECT Id,
         Name,
         ${NAMESPACE}OrderDate__c,
         ${NAMESPACE}Type__c,
         ${NAMESPACE}SubType__c,
         ${NAMESPACE}NetAmount__c,
         ${NAMESPACE}Status__c
  FROM ${NAMESPACE}Order2__c`;

export const INQUIRIES_QUERY = `
    SELECT Id,
           Name,
           ${NAMESPACE}Account__c,
           ${NAMESPACE}Account__r.Name,
           ${NAMESPACE}Inquiry_Type__c,
           ${NAMESPACE}Priority__c,
           ${NAMESPACE}ResponsePreference__c
    FROM ${NAMESPACE}Inquiry__c`;

export const STORE_CHECK_QUERY = `
    SELECT Id,
           Name,
           ${NAMESPACE}StoreCheckDateTime__c,
           ${NAMESPACE}Status__c
    FROM ${NAMESPACE}StoreCheck__c`;

export const fetchCall = (callId) => {
  const query = `
    SELECT Id,
           OwnerId,
           Name,
           ${NAMESPACE}Account__c,
           ${NAMESPACE}Account__r.Name,
           ${NAMESPACE}CallDateTime__c,
           ${NAMESPACE}Status__c
    FROM ${NAMESPACE}Call__c
    WHERE Id = '${callId}'`;

  return databaseManager.fetch(query);
};

export const fetchCallAttendees = (parentCallId) => {
  const query = `
    SELECT Id,
           ${NAMESPACE}Account__c,
           ${NAMESPACE}Account__r.Name
    FROM ${NAMESPACE}Call__c
    WHERE ${NAMESPACE}ParentCall__c = '${parentCallId}'`;

  return databaseManager.fetchWithParams(query, { batchSize: 100 });
};

export const checkIfUserIsOwnerOfCall = (callId, userId) => {
  const query = `
    SELECT COUNT(Id) total
    FROM ${NAMESPACE}Call__c
    WHERE Id = '${callId}' AND OwnerId = '${userId}'`;

  return databaseManager.fetch(query);
};

export const fetchOrders = (callId) => {
  const query = `
    ${ORDERS_QUERY}
    WHERE ${NAMESPACE}Call__c = '${callId}'`;

  return databaseManager.fetchWithParams(query, { batchSize: 100 });
};

export const fetchInquiries = (callId) => {
  const query = `
    ${INQUIRIES_QUERY}
    WHERE ${NAMESPACE}Call__c = '${callId}'`;

  return databaseManager.fetchWithParams(query, { batchSize: 100 });
};

export const fetchStoreCheck = (callId) => {
  const query = `
    ${STORE_CHECK_QUERY}
    WHERE ${NAMESPACE}Call__c = '${callId}'`;

  return databaseManager.fetchWithParams(query, { batchSize: 100 });
};

export const createNewInquiry = (inquiry) => {
  const objectToSave = {
    ...inquiry,
    sObject: `${NAMESPACE}Inquiry__c`,
  };

  return databaseManager.upsert([objectToSave]);
};
