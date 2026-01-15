import { databaseManager, metadataBridge, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { NAMESPACE } from '../constants';
import { Platform } from 'react-native';
import { DateTime } from 'luxon';

export const fetchToDo = async ({
  sortDirection,
  sortColumn,
  selectedComplianceType,
  searchValue,
}) => {
  const today = DateTime.utc().toFormat('yyyy-LL-dd');

  const searchCondition = searchValue
    ? `AND (${NAMESPACE}AccountCompliance__r.${NAMESPACE}Compliance__r.Name LIKE '%${searchValue}%'\
      OR ${NAMESPACE}AccountCompliance__r.${NAMESPACE}Account__r.${NAMESPACE}AccountFullName__c LIKE '%${searchValue}%')`
    : '';

  const query = `
      SELECT  Id,
              ${NAMESPACE}AccountCompliance__c,
              ${NAMESPACE}AccountCompliance__r.${NAMESPACE}Compliance__r.Name,
              ${NAMESPACE}AccountCompliance__r.${NAMESPACE}Account__r.${NAMESPACE}AccountFullName__c,
              ${NAMESPACE}AccountCompliance__r.${NAMESPACE}Account__c,
              ${NAMESPACE}AccountComplianceCycle__c,
              ${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}SortOrder__c,
              ${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}CycleStartDate__c,
              ${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}CycleEndDate__c
      FROM ${NAMESPACE}ToDo__c
      WHERE ${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}Status__c = 'New'
        AND ${NAMESPACE}AccountComplianceCycle__r.${NAMESPACE}CycleStartDate__c <= ${today}
        AND ${NAMESPACE}AccountCompliance__r.${NAMESPACE}Compliance__r.${NAMESPACE}ComplianceType__c = '${selectedComplianceType.value}'
        AND ${NAMESPACE}AccountCompliance__r.${NAMESPACE}Compliance__r.${NAMESPACE}EditEndDate__c >= ${today}
        ${searchCondition}
      ORDER BY ${sortColumn.value} ${sortDirection}`;

  return databaseManager.fetch(query);
};

export const fetchByQueryLocator = async (queryLocator) => {
  if (Platform.OS === 'web') {
    const actualLocator = queryLocator.substring(
      queryLocator.lastIndexOf('/') + 1
    );
    return sfNetAPI.restRequest(`query/${actualLocator}`, 'GET');
  }
  return databaseManager.fetch(queryLocator);
};

export const fetchComplianceMetadata = async () => {
  if (Platform.OS === 'web') {
    return sfNetAPI.describe(`${NAMESPACE}Compliance__c`);
  } else {
    return metadataBridge.describe(`${NAMESPACE}Compliance__c`);
  }
};

export const fetchAccountComplianceCycleMetadata = async () => {
  if (Platform.OS === 'web') {
    return sfNetAPI.describe(`${NAMESPACE}AccountComplianceCycle__c`);
  } else {
    return metadataBridge.describe(`${NAMESPACE}AccountComplianceCycle__c`);
  }
};

export const fetchAccounts = async (parentId) => {
  const query = `
    SELECT Id, Name
    FROM Account
    WHERE ${NAMESPACE}ParentAccount__c = '${parentId}'
    AND (IsPersonAccount = TRUE
      OR RecordType.DeveloperName = 'Ins_Doc')
    ORDER BY Name ASC NULLS FIRST`;

  return databaseManager.fetch(query);
};

export const fetchAllAccounts = async (
  parentId,
  recordTypes,
  queryLocator = null
) => {
  try {
    let response;

    if (queryLocator) {
      response = await fetchByQueryLocator(queryLocator);
    } else {
      response = await fetchAccounts(parentId);
    }
    let { records } = response;
    const { done } = response;

    const nextQueryLocator = response.queryLocator;

    if (!done && nextQueryLocator) {
      const extraData = await fetchAllAccounts(
        parentId,
        recordTypes,
        nextQueryLocator
      );
      records = records.concat(extraData);
    }
    return records;
  } catch (err) {
    return console.log(err);
  }
};

export const fetchInProgressACCNumber = async (accountComplianceId = '') => {
  const query = `
    SELECT Id
    FROM ${NAMESPACE}AccountComplianceCycle__c
    WHERE ${NAMESPACE}AccountCompliance__c = '${accountComplianceId}'
    AND ${NAMESPACE}Status__c NOT IN ('Completed', 'Skipped')`;

  return databaseManager.fetch(query);
};

export const saveToDo = async (objects) => {
  return databaseManager.upsert(objects);
};
