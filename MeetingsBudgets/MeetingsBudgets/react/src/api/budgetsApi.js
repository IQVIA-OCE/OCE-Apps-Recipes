import { DateTime } from 'luxon';
import { databaseManager } from '../../bridge/Database/DatabaseManager';
import { NAMESPACE } from '../constants';
import { api } from '../utils';
import {
  fetchContextType,
  fetchWorkflowConfiguration,
  fetchWorkflowNodes,
  fetchContext,
  fetchContextConditions,
} from './workflowPath';

export const fetchMeeting = (meetingId) => {
  try {
    return api.queryOffline(
      `SELECT Id,\
                   Name,\
                   ${NAMESPACE}StartDateTime__c,\
                   ${NAMESPACE}EndDateTime__c,\
                   RecordType.DeveloperName,\
                   RecordType.Name\
            FROM ${NAMESPACE}Meeting__c\
            WHERE Id = '${meetingId}'`
    );
  } catch (error) {
    throw error;
  }
};

export const getSystemGeneratedFiltersQueryString = (meeting) => {
  const formatDateToISO = (date) => DateTime.fromISO(date, { zone: 'utc' }).toISODate();
  const startDate = formatDateToISO(meeting.startDate);
  const endDate = formatDateToISO(meeting.endDate);

  return `${NAMESPACE}MeetingType__c INCLUDES ('${meeting.recordTypeDevName}')
          AND ${NAMESPACE}ConsumptionBudget__c = true
          AND ${NAMESPACE}Status__c = 'Active'
          AND ${NAMESPACE}StartDate__c <= '${startDate}'
          AND ${NAMESPACE}EndDate__c >= '${endDate}'`;
};

export const fetchBudgets = async ({
  limit = 15,
  offset = 0,
  searchQuery = '',
  isSystemGeneratedFilterEnabled,
  meeting,
}) => {
  try {
    const [budgetIds] = await api.queryOffline(
      `SELECT ${NAMESPACE}Budget__c\
            FROM ${NAMESPACE}MeetingBudget2__c\
            WHERE ${NAMESPACE}Meeting__c = '${meeting.id}'`
    );
    const budgetsIdsString = budgetIds
      .map((el) => `'${el[`${NAMESPACE}Budget__c`]}'`)
      .join(', ');
    const query = `SELECT Id,
                          Name,
                          CurrencyIsoCode,
                          ${NAMESPACE}ChildrenAllocatedAmount__c,
                          ${NAMESPACE}ActualAmount__c,
                          ${NAMESPACE}ConsumptionBudget__c,
                          ${NAMESPACE}EndDate__c,
                          ${NAMESPACE}EstimatedAmount__c,
                          ${NAMESPACE}MeetingType__c,
                          ${NAMESPACE}Remaining__c,
                          ${NAMESPACE}StartDate__c,
                          ${NAMESPACE}Status__c,
                          ${NAMESPACE}TotalAmount__c
                   FROM ${NAMESPACE}Budget__c`;
    const notBudgetsOfCurrentMeeting = budgetIds.length
      ? `Id NOT IN (${budgetsIdsString})`
      : '';
    const searchCondition = searchQuery
      ? `(${NAMESPACE}Budget__c.Name LIKE '%${searchQuery}%'
         OR ${NAMESPACE}Budget__c.${NAMESPACE}Status__c LIKE '%${searchQuery}%'
         OR ${NAMESPACE}Budget__c.${NAMESPACE}MeetingType__c INCLUDES ('${searchQuery}'))`
      : '';
    const systemGeneratedFilters = isSystemGeneratedFilterEnabled
      ? getSystemGeneratedFiltersQueryString(meeting)
      : '';
    const order = 'ORDER BY Name ASC NULLS FIRST';
    const limitSetting = `LIMIT ${limit} OFFSET ${offset}`;

    return api.queryOffline(
      `${query}
       ${budgetIds.length || searchQuery ||
        isSystemGeneratedFilterEnabled ? 'WHERE ' : ''}
       ${notBudgetsOfCurrentMeeting}
       ${budgetIds.length && searchQuery ? 'AND ' : ''}
       ${searchCondition}
       ${(budgetIds.length || searchQuery) && isSystemGeneratedFilterEnabled ? 'AND ' : ''}
       ${systemGeneratedFilters
      } ${order} ${limitSetting}`.replace(/\s+/g, ' ')
    );
  } catch (error) {
    throw error;
  }
};

export const saveBudget = async (budget, parentId) => {
  const getNormalizedAmount = (value) => {
    if (!value) return null;
    const parsedNumber = parseFloat(value.replace(/[^\d.-]/g, ''));
    if (parsedNumber) return parsedNumber;
    if (parsedNumber === 0) return 0;
    return null;
  };

  try {
    const objectToSave = {
      sObject: `${NAMESPACE}MeetingBudget2__c`,
      CurrencyIsoCode: budget['currencyISOCode'],
      Name: budget['name'],
      [`${NAMESPACE}Budget__c`]: budget['id'],
      [`${NAMESPACE}BudgetActualAmount__c`]: getNormalizedAmount(
        budget['actualAmount']
      ),
      [`${NAMESPACE}BudgetEstimatedAmount__c`]: getNormalizedAmount(
        budget['estimatedAmount']
      ),
      [`${NAMESPACE}BudgetTotalAmount__c`]: getNormalizedAmount(
        budget['totalAmount']
      ),
      [`${NAMESPACE}ChildrenAllocatedAmount__c`]: budget['childrenAllocatedAmount'],
      [`${NAMESPACE}Meeting__c`]: parentId,
    };


    const permissions = await getPermissions(objectToSave);

    if (permissions.canAdd) {
      return await databaseManager.upsert([objectToSave]);
    } else {
      throw new Error('Workflow validation error.');
    }
  } catch (error) {
    throw error;
  }
};

const getPermissions = async (obj) => {
  let permissions = {
    canAdd: true,
    canEdit: true,
    canDelete: true,
  };

  try {
    const [[contextType]] = await fetchContextType(`${NAMESPACE}MeetingBudget2__c`);
    const [[workflowConfig]] = await fetchWorkflowConfiguration(
      contextType['Id']
    );
    if (workflowConfig && workflowConfig['Id']) {
      let conditionsPassed;

      const conditionCheckers = {
        EQUALS: (value, conditionValue) => value === conditionValue,
        NOT_EQUALS: (value, conditionValue) => value !== conditionValue,
        EQUALS_NULL: (value) => value === null,
        NOT_EQUALS_NULL: (value) => value !== null,
        IN: (value, conditionValue) =>
          conditionValue.split(';').includes(value),
        NOT_IN: (value, conditionValue) =>
          !conditionValue.split(';').includes(value),
      };

      const [workflowNodes] = await fetchWorkflowNodes(workflowConfig['Id']);

      const relatedWorkflowNode = workflowNodes.find(
        (el) =>
          el[`${NAMESPACE}MeetingStatus__c`] ===
          obj[workflowConfig[`${NAMESPACE}ControllingField__c`]]
      );
      const [[workflowContext]] = await fetchContext(relatedWorkflowNode['Id']);

      const [workflowConditions] = await fetchContextConditions(
        workflowContext['Id']
      );

      for (let i = 0; i < workflowConditions.length; i++) {
        if (conditionsPassed === false) break;

        const condition = workflowConditions[i];

        const fieldName = condition[`${NAMESPACE}Field__c`];
        const operator = condition[`${NAMESPACE}Operator__c`];
        const value = condition[`${NAMESPACE}Value__c`];

        conditionsPassed = conditionCheckers[operator](obj[fieldName], value);
      }

      permissions = conditionsPassed
        ? {
            canAdd: workflowContext[`${NAMESPACE}Create__c`],
            canEdit: workflowContext[`${NAMESPACE}Edit__c`],
            canDelete: workflowContext[`${NAMESPACE}Delete__c`],
          }
        : {
            canAdd: false,
            canEdit: false,
            canDelete: false,
          };

      return permissions;
    }
  } catch (error) {
    throw error;
  }
};
