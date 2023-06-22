import { Platform } from 'react-native';
import { databaseManager, metadataBridge, sfNetAPI } from 'oce-apps-bridges';
import { DateTime } from 'luxon';
import { NAMESPACE, SORT_ORDER_TO_SOQL_VALUES_MAP, UI_TO_SOQL_FIELD_NAMES_MAP } from '../constants';

export const fetchCallToDos = ({ callId, page, rowsPerPage, sortColumn, sortOrder }) => {
  const offset = (page - 1) * rowsPerPage;
  const _sortColumn = UI_TO_SOQL_FIELD_NAMES_MAP[sortColumn];
  const _sortOrder = SORT_ORDER_TO_SOQL_VALUES_MAP[sortOrder];

  const query = `
    SELECT Id, 
           ${NAMESPACE}Compliance__r.Id,
           ${NAMESPACE}Compliance__r.Name,
           ${NAMESPACE}Compliance__r.${NAMESPACE}ComplianceType__c,
           ${NAMESPACE}SurveyType__c,
           ${NAMESPACE}Interviewee__r.Id,
           ${NAMESPACE}Interviewee__r.Name,
           ${NAMESPACE}IntervieweeOther__c
    FROM ${NAMESPACE}CallToDo__c
    WHERE ${NAMESPACE}Call__c = '${callId}'
    ORDER BY ${_sortColumn} ${_sortOrder}
    LIMIT ${rowsPerPage} OFFSET ${offset}
  `;

  return databaseManager.fetch(query);
};

export const fetchCallToDosCount = (callId) => {
  const query = `SELECT COUNT(Id) totalSize FROM ${NAMESPACE}CallToDo__c WHERE ${NAMESPACE}Call__c = '${callId}'`;

  return databaseManager.fetch(query).then((res) => {
    return res.records[0].totalSize;
  });
};

const fetchComplianceMetadata = () => {
  if (Platform.OS === 'web') {
    return sfNetAPI.describe(`${NAMESPACE}Compliance__c`);
  } else {
    return metadataBridge.describe(`${NAMESPACE}Compliance__c`);
  }
};

export const fetchComplianceTypes = async () => {
  const complianceMetadata = await fetchComplianceMetadata();
  const complianceTypeField = complianceMetadata.fields.find((item) => item.name === `${NAMESPACE}ComplianceType__c`);
  const complianceTypes = complianceTypeField.picklistValues.filter((pVal) => pVal.active === true);

  return complianceTypes;
};

const fetchAccountComplianceCycleMetadata = async () => {
  if (Platform.OS === 'web') {
    return sfNetAPI.describe(`${NAMESPACE}AccountComplianceCycle__c`);
  } else {
    return metadataBridge.describe(`${NAMESPACE}AccountComplianceCycle__c`);
  }
};

export const fetchSurveyTypes = async () => {
  const complianceCycleMetadata = await fetchAccountComplianceCycleMetadata();
  const complianceCycleSurveyField = complianceCycleMetadata.fields.find(
    (item) => item.name === `${NAMESPACE}SurveyType__c`
  );
  const surveyTypes = complianceCycleSurveyField.picklistValues.filter((pVal) => pVal.active === true);

  return surveyTypes;
};

export const fetchByQueryLocator = async (queryLocator) => {
  return databaseManager.fetch(queryLocator);
};

export const fetchComplianceRecords = ({ callDateTime, complianceType }) => {
  const today = DateTime.utc().toFormat('yyyy-LL-dd');
  const formattedCallDateTime = DateTime.fromISO(callDateTime).toFormat('yyyy-LL-dd');

  const abortDateCondition = `${NAMESPACE}AbortDate__c != null AND ${NAMESPACE}AbortDate__c >= ${formattedCallDateTime}`;
  const extensionDueDateCondition = `${NAMESPACE}AbortDate__c = null AND ${NAMESPACE}ExtensionDueDate__c >= ${formattedCallDateTime}`;

  const query = `
    SELECT Id,
           Name
    FROM ${NAMESPACE}Compliance__c
    WHERE ${NAMESPACE}ComplianceType__c = '${complianceType}'
      AND ${NAMESPACE}AnnounceDate__c <= ${today}
      AND ${NAMESPACE}EditEndDate__c >= ${today}
      AND ${NAMESPACE}StartDate__c <= ${formattedCallDateTime}
      AND ((${abortDateCondition}) OR (${extensionDueDateCondition}))
    ORDER BY Name ASC
  `;

  return databaseManager.fetch(query);
};

export const fetchAllComplianceRecords = async ({ callDateTime, complianceType }, queryLocator) => {
  let response;

  if (queryLocator) {
    response = await fetchByQueryLocator(queryLocator);
  } else {
    response = await fetchComplianceRecords({ callDateTime, complianceType });
  }

  let { records } = response;
  const { done } = response;

  const nextQueryLocator = response.queryLocator;

  if (!done && nextQueryLocator) {
    const extraData = await fetchAllComplianceRecords({ callDateTime, complianceType }, nextQueryLocator);
    records = records.concat(extraData);
  }

  return records;
};

export const fetchCall = (callId) => {
  const query = `
    SELECT Id,
           ${NAMESPACE}CallDateTime__c,
           ${NAMESPACE}Account__c,
           ${NAMESPACE}Account__r.IsPersonAccount,
           ${NAMESPACE}Status__c
    FROM ${NAMESPACE}Call__c
    WHERE Id = '${callId}'
  `;

  return databaseManager.fetch(query);
};

export const fetchAccounts = async ({ parentId, searchQuery, sortColumn, sortOrder }) => {
  const _sortOrder = SORT_ORDER_TO_SOQL_VALUES_MAP[sortOrder];
  const searchCondition = searchQuery
    ? `AND (Name LIKE '%${searchQuery}%'\
      OR ${NAMESPACE}KanaName__c LIKE '%${searchQuery}%')`
    : '';

  const query = `
    SELECT Id, Name, ${NAMESPACE}KanaName__c
    FROM Account
    WHERE ${NAMESPACE}ParentAccount__c = '${parentId}'
      AND (IsPersonAccount = TRUE
      OR RecordType.DeveloperName = 'Ins_Doc')
      ${searchCondition}
    ORDER BY ${sortColumn} ${_sortOrder} NULLS FIRST`;

  return databaseManager.fetch(query);
};

export const fetchCallToDoRecordType = async (complianceType) => {
  try {
    const query = `
    SELECT Id
    FROM RecordType
    WHERE sObjectType = '${NAMESPACE}CallToDo__c'
      AND DeveloperName = 'Compliance${complianceType}'
  `;

    const { records } = await databaseManager.fetch(query);
    return records[0];
  } catch (e) {
    console.log(e);
    throw new Error(`Failed to fetch record type for compliance type ${complianceType}`);
  }
};

export const saveCallToDo = (obj) => {
  return databaseManager.upsert([obj]);
};

export const deleteCallToDo = (id) => {
  return databaseManager.delete([id]);
};
