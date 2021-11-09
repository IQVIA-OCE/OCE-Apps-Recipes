import { api } from '../utils';
import { NAMESPACE } from '../constants';
import { doesFieldExist } from './speakersApi';
import * as workflowApi from './workflowApi';
import {
  MEETING_ACCOUNT_UTILIZATION_HANDLER,
  MEETING_MEMBER_ACCOUNT_UTILIZATION_HANDLER,
} from '../constants/dbTriggerNames';

/**
 *
 * @param {string} triggerName
 * @returns {Promise<boolean>}
 */
export const checkIfTriggerIsEnabled = async triggerName => {
  try {
    const [[{ [`${NAMESPACE}IsActive__c`]: isActive }]] = await api.queryOffline(`
    SELECT ${NAMESPACE}IsActive__c
    FROM ${NAMESPACE}TriggerHandler__mdt
    WHERE developerName = '${triggerName}'
  `);

    return Boolean(isActive);
  } catch (e) {
    return false;
  }
};

/**
 *
 * @return {Promise<({isAccessible: boolean, field: string})[]>}
 */
export const checkUtilizationFieldsAccessGranted = async () => {
  try {
    const [accountGoalFieldExists, accountFieldExists] = await Promise.all([
      doesFieldExist(`${NAMESPACE}AccountGoal__c`, `${NAMESPACE}ActivityPlan__c`),
      doesFieldExist(`${NAMESPACE}Account__c`, `${NAMESPACE}AccountGoal__c`),
    ]);

    return [
      {
        field: `${NAMESPACE}AccountGoal__c`,
        isAccessible: accountGoalFieldExists,
      },
      {
        field: `${NAMESPACE}Account__c`,
        isAccessible: accountFieldExists,
      },
    ];
  } catch (e) {
    return [
      {
        field: `${NAMESPACE}AccountGoal__c`,
        isAccessible: false,
      },
      {
        field: `${NAMESPACE}Account__c`,
        isAccessible: false,
      },
    ];
  }
};

export const fetchActivityPlanConfigs = () => {
  return api.queryOffline(`
    SELECT ${NAMESPACE}Criteria__c FROM ${NAMESPACE}ActivityPlanConfig__mdt\
    WHERE ${NAMESPACE}IsActive__c = 1\
    AND ${NAMESPACE}Criteria__c != null
  `);
};

/**
 *
 * @return {Promise<boolean>}
 */
export const checkCanDeleteMeetingMember = async (meeting, meetingMember) => {
  try {
    const [[contextType]] = await workflowApi.fetchContextType(`${NAMESPACE}Meeting__c`);
    const [[workflowConfig]] = await workflowApi.fetchWorkflowConfiguration(contextType.Id);

    const contextNode = await fetchCurrentContextNode({ config: workflowConfig, meeting, meetingMember });

    return contextNode ? Boolean(contextNode[`${NAMESPACE}Delete__c`]) : false;
  } catch (e) {
    return false;
  }
};

export const fetchCurrentContextNode = async ({ config, meeting, meetingMember }) => {
  const configField = `${NAMESPACE}Status__c`;
  const [[configContextType]] = await workflowApi.fetchContextTypeById(config[`${NAMESPACE}ContextType__c`]);

  const relatedContextTypeId = configContextType.Id;
  const relatedObject = meeting;

  const [nodes] = await workflowApi.fetchWorkflowNode(config.Id);

  const objectStatus = relatedObject[configField];
  const node = nodes.find(n => n[`${NAMESPACE}MeetingStatus__c`] === objectStatus);

  const [relatedContexts] = await workflowApi.fetchContext(node.Id, [relatedContextTypeId]);

  let topContext;

  for (const context of relatedContexts) {
    const [conditions] = await workflowApi.fetchContextConditions(context.Id);

    if (checkConditionsPassed(conditions, relatedObject) && !topContext) {
      topContext = context;
      break;
    }
  }

  const [childTypes] = await workflowApi.fetchChildContextType(`${NAMESPACE}MeetingMember__c`);

  if (!childTypes?.length) return null;

  const [childContexts] = await workflowApi.fetchChildContext(
    topContext.DeveloperName,
    childTypes.map(ct => ct.Id)
  );

  let childContext;
  for (const context of childContexts) {
    const [conditions] = await workflowApi.fetchContextConditions(context.Id);
    if (checkConditionsPassed(conditions, meetingMember) && !childContext) {
      childContext = context;
      break;
    }
  }

  return childContext;
};

/**
 *
 * @param conditions
 * @param andObject
 * @return {boolean}
 */
export const checkConditionsPassed = (conditions, andObject) => {
  const results = [];

  conditions.forEach(condition => {
    const conditionField = condition[`${NAMESPACE}Field__c`];
    const conditionOperator = condition[`${NAMESPACE}Operator__c`];
    const conditionValue = condition[`${NAMESPACE}Value__c`];
    const possibleMultipleConditionValues = condition[`${NAMESPACE}Value__c`].split(';');
    const objectCheckedField = andObject[conditionField];

    const sufficesCondition =
      (conditionOperator === 'EQUALS' && objectCheckedField === conditionValue) ||
      (conditionOperator === 'IN' &&
        possibleMultipleConditionValues.length > 1 &&
        possibleMultipleConditionValues.includes(objectCheckedField));

    results.push(sufficesCondition);
  });

  return results.length > 0 && results.every(Boolean);
};

/**
 *
 * @return {Promise<string|undefined>}
 */
export const validateAllActiveActivityPlanConfigs = async () => {
  const [activityPlanConfigs] = await fetchActivityPlanConfigs();

  for (const config of activityPlanConfigs) {
    const error = validateCriteriaJSON(config[`${NAMESPACE}Criteria__c`]);

    if (error) return error;
  }
};

/**
 *
 * @param data
 * @return {string|null} returns error if json is invalid
 */
export const validateCriteriaJSON = data => {
  const errorMessage = 'Invalid JSON format/structure of Activity Plan Config';

  try {
    const parsed = JSON.parse(data);

    const isValid =
      parsed.utilizationTypes.actual !== null &&
      parsed.utilizationTypes.estimated !== null &&
      parsed.utilizationTypes.committed !== null;

    if (!isValid) return errorMessage;

    return null;
  } catch (e) {
    return errorMessage;
  }
};

/**
 *
 * @return {Promise<boolean>}
 */
export const checkAccountUtilizationEnabled = async () => {
  const [meetingMemberTriggerEnabled, meetingTriggerEnabled] = await Promise.all([
    checkIfTriggerIsEnabled(MEETING_MEMBER_ACCOUNT_UTILIZATION_HANDLER),
    checkIfTriggerIsEnabled(MEETING_ACCOUNT_UTILIZATION_HANDLER),
  ]);

  return meetingMemberTriggerEnabled && meetingTriggerEnabled;
};
