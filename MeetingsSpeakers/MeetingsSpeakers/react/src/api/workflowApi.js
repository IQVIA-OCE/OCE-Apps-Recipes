// Which sObject type is described by workflow path
import { api } from '../utils';
import { NAMESPACE } from '../constants';

export const fetchContextType = (object__c) => {
  return api.queryOffline(`
    SELECT Id, ${NAMESPACE}Object__c, ${NAMESPACE}isControlledByWorkflowPath__c FROM ${NAMESPACE}WorkflowContextType__c\
    WHERE ${NAMESPACE}Object__c = '${object__c}' AND ${NAMESPACE}Relationship__c = null AND ${NAMESPACE}isControlledByWorkflowPath__c = 1
    AND ${NAMESPACE}Relationship__c = null`);
};

// Workflow path
// Defines Record type and Controlling field for sObject type that was described by context type
// If Status is Inactive workflow path will not be applied to sObject
export const fetchWorkflowConfiguration = (contextTypeId) => {
  return api.queryOffline(`
    SELECT Id, ${NAMESPACE}ContextType__c, ${NAMESPACE}ControllingField__c, ${NAMESPACE}RecordTypeName__c FROM ${NAMESPACE}WorkflowPath__c\
    WHERE ${NAMESPACE}ContextType__c = '${contextTypeId}' AND ${NAMESPACE}Status__c = 'Active'
    `);
};

// Workflow node
// State of an object, value for controlling field
// e.g. If controlling field is Status than value will be 'Approved' or 'Draft' or so on...
export const fetchWorkflowNode = (workflowConfigurationId) => {
  return api.queryOffline(`
    SELECT Id, ${NAMESPACE}ControllingFieldValue__c FROM ${NAMESPACE}WorkflowPathNode__c\
    WHERE ${NAMESPACE}WorkflowPath__c = '${workflowConfigurationId}'
    `);
};

// Context. Set of criteria which defines what we can do with particular record
// CRUD permissions for the RECORD
export const fetchContext = (workflowNodeId, ordered, contextTypeIds) => {
  const contextTypeIdsString = contextTypeIds?.map(x => `'${x}'`)?.join(', ') ?? '';

  return api.queryOffline(`
    SELECT Id, ${NAMESPACE}Create__c, ${NAMESPACE}Delete__c, ${NAMESPACE}Edit__c, ${NAMESPACE}ContextType__c FROM ${NAMESPACE}WorkflowContext__c\
    WHERE ${NAMESPACE}WorkflowPathNode__c = '${workflowNodeId}'\
    ${ contextTypeIdsString ? ` AND ${NAMESPACE}ContextType__c IN (${contextTypeIdsString})` : '' }\
    ${ ordered ? ` ORDER BY ${NAMESPACE}Rank__c ASC, ${NAMESPACE}CreatedDate DESC` : '' }\
    `);
};

// Context Conditions. Each context has single or several context conditions
// Which Field with what Operator (equals or in) for Value
export const fetchContextConditions = (contextId) => {
  return api.queryOffline(`
    SELECT Id, ${NAMESPACE}Field__c, ${NAMESPACE}Operator__c, ${NAMESPACE}Value__c, ${NAMESPACE}Context__c FROM ${NAMESPACE}WorkflowContextCondition__c
    WHERE ${NAMESPACE}Context__c = '${contextId}'
    `);
};
