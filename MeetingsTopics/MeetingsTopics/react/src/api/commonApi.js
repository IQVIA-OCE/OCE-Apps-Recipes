import api from '../utils/api';
import { NAMESPACE } from '../constants';
import {
  fetchContext,
  fetchContextConditions,
  fetchContextType,
  fetchWorkflowConfiguration,
  fetchWorkflowNodes,
} from './workflowPath';

/**
 *
 * @param {string} fieldName
 * @param {string} tableName
 *
 * @returns {Promise<boolean>}
 */
export const doesFieldExist = async (fieldName, tableName) => {
  try {
    await api.queryOffline(`SELECT ${fieldName} from ${tableName} LIMIT 1`);

    return true;
  } catch (e) {
    return false;
  }
};

/**
 *
 * @returns {Promise<boolean>}
 */
export const getIsAdvancedSearchEnabled = async () => {
  try {
    const [[response]] = await api.queryOffline(
      `SELECT ${NAMESPACE}EnableAdvancedSearch__c FROM ${NAMESPACE}ApplicationSettings__c`
    );

    return Boolean(response[`${NAMESPACE}EnableAdvancedSearch__c`]);
  } catch (e) {
    return false;
  }
};

/**
 *
 * @param {object} obj
 *
 * @returns {Promise<[permissions: object, ignoredConditions: [object]]>}
 */
export const getPermissions = async (obj) => {
  let permissions = {
    canAdd: true,
    canEdit: true,
    canDelete: true,
  };

  try {
    const [[contextType]] = await fetchContextType(
      `${NAMESPACE}MeetingTopic__c`
    );

    const [[workflowConfig]] = await fetchWorkflowConfiguration(
      contextType['Id']
    );

    if (workflowConfig && workflowConfig['Id']) {
      let conditionsPassed;
      let ignoredConditions = [];

      const conditionCheckers = {
        EQUALS: (value, conditionValue) => value === conditionValue,
        NOT_EQUALS: (value, conditionValue) => value !== conditionValue,
        EQUALS_NULL: value => value === null,
        NOT_EQUALS_NULL: value => value !== null,
        IN: (value, conditionValue) =>
          conditionValue.split(';').includes(value),
        NOT_IN: (value, conditionValue) =>
          !conditionValue.split(';').includes(value),
      };

      const [workflowNodes] = await fetchWorkflowNodes(workflowConfig['Id']);

      const relatedWorkflowNode = workflowNodes.find(el =>
        el[`${NAMESPACE}ControllingFieldValue__c`] ===
        obj[workflowConfig[`${NAMESPACE}ControllingField__c`]]
      );

      const [[workflowContext]] = await fetchContext(relatedWorkflowNode['Id']);

      const [workflowConditions] = await fetchContextConditions(
        workflowContext['Id']
      );

      for (const condition of workflowConditions) {
        if (conditionsPassed === false) break;

        const fieldNames = condition[`${NAMESPACE}Field__c`].split('.');
        const firstFieldName = fieldNames[0].replace('__r', '__c');
        const operator = condition[`${NAMESPACE}Operator__c`];
        const value = condition[`${NAMESPACE}Value__c`];

        if (Object.keys(obj).find((el) => el.toLowerCase() === firstFieldName.toLowerCase())) {
          switch (true) {
            case fieldNames.length === 1:
              conditionsPassed = conditionCheckers[operator](obj[fieldNames[0]], value);
              break;
            case fieldNames.length > 1 && fieldNames.length < 3:
              const field = fieldNames.slice(1).join('.');
              const [[requestedData]] = await api.queryOffline(
                `SELECT ${field} FROM ${firstFieldName} WHERE Id = '${obj[firstFieldName]}'`
              );
              conditionsPassed = conditionCheckers[operator](
                typeof value === 'boolean'
                  ? Boolean(requestedData[field])
                  : requestedData[field],
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

      permissions =
        conditionsPassed || workflowConditions.length === 0
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

      return [permissions, ignoredConditions];
    }
  } catch (error) {
    throw error;
  }
};
