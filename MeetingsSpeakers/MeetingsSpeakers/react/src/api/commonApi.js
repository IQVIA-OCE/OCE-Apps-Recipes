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

export const checkCanDeleteMeetingMember = async (meeting, meetingMember) => {
  try {
    const [[contextType]] = await workflowApi.fetchContextType(`${NAMESPACE}Meeting__c`);
    const [[workflowConfig]] = await workflowApi.fetchWorkflowConfiguration(contextType.Id);

    const [contextNode, ignoredConditions] = await fetchCurrentContextNode({
      config: workflowConfig,
      meeting,
      meetingMember,
    });

    return [contextNode ? Boolean(contextNode[`${NAMESPACE}Delete__c`]) : false, ignoredConditions];
  } catch (e) {
    return [false, []];
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

    const [conditionsPassed] = await checkConditionsPassed(conditions, relatedObject);
    if (conditionsPassed && !topContext) {
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
  let ignoredConditions = [];
  for (const context of childContexts) {
    const [conditions] = await workflowApi.fetchContextConditions(context.Id);
    const [conditionsPassed, _ignoredConditions] = await checkConditionsPassed(conditions, meetingMember);
    if (conditionsPassed && !childContext) {
      childContext = context;
      ignoredConditions = _ignoredConditions;
      break;
    }
  }

  return [childContext, ignoredConditions];
};

/**
 *
 * @param conditions
 * @param obj
 */
export const checkConditionsPassed = async (conditions, obj) => {
  const conditionCheckers = {
    EQUALS: (value, conditionValue) => value === conditionValue,
    NOT_EQUALS: (value, conditionValue) => value !== conditionValue,
    EQUALS_NULL: value => value === null,
    NOT_EQUALS_NULL: value => value !== null,
    IN: (value, conditionValue) => conditionValue.split(';').includes(value),
    NOT_IN: (value, conditionValue) => !conditionValue.split(';').includes(value),
  };

  let conditionsPassed;
  const ignoredConditions = [];

  for (const condition of conditions) {
    if (conditionsPassed === false) break;

    const fieldNames = condition[`${NAMESPACE}Field__c`].split('.');
    const firstFieldName = fieldNames[0].replace('__r', '__c');
    const operator = condition[`${NAMESPACE}Operator__c`];
    const value = condition[`${NAMESPACE}Value__c`];

    if (Object.keys(obj).find(el => el.toLowerCase() === firstFieldName.toLowerCase())) {
      switch (true) {
        case fieldNames.length === 1:
          conditionsPassed = conditionCheckers[operator](obj[fieldNames[0]], value);
          break;
        case fieldNames.length > 1 && fieldNames.length <= 3:
          const field = fieldNames.slice(1).join('.');
          const [[requestedData]] = await api.queryOffline(
            `SELECT ${field}
                 FROM ${firstFieldName}
                 WHERE Id = '${obj[firstFieldName]}'`
          );
          conditionsPassed = conditionCheckers[operator](
            typeof value === 'boolean' ? Boolean(requestedData[field]) : requestedData[field],
            value
          );
          break;
        default:
          conditionsPassed = true;
          ignoredConditions.push(condition);
      }
    } else {
      conditionsPassed = true;
      ignoredConditions.push(condition);
    }
  }

  return [conditionsPassed, ignoredConditions];
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
