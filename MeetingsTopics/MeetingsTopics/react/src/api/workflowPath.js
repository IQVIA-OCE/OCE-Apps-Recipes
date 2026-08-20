import { api } from '../utils';
import { NAMESPACE } from '../constants';

export const fetchContextType = object__c => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}Object__c, ${NAMESPACE}isControlledByWorkflowPath__c FROM ${NAMESPACE}WorkflowContextType__c WHERE ${NAMESPACE}Object__c = '${object__c}' AND ${NAMESPACE}Relationship__c = null AND ${NAMESPACE}isControlledByWorkflowPath__c = 1 AND ${NAMESPACE}Relationship__c = null`
  );
};

export const fetchWorkflowConfiguration = contextTypeId => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}ControllingField__c, ${NAMESPACE}RecordTypeName__c FROM ${NAMESPACE}WorkflowPath__c WHERE ${NAMESPACE}ContextType__c = '${contextTypeId}' AND ${NAMESPACE}Status__c = 'Active'`
  );
};

export const fetchWorkflowNodes = workflowConfigurationId => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}ControllingFieldValue__c FROM ${NAMESPACE}WorkflowPathNode__c WHERE ${NAMESPACE}WorkflowPath__c = '${workflowConfigurationId}'`
  );
};

export const fetchContext = workflowNodeId => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}Create__c, ${NAMESPACE}Delete__c, ${NAMESPACE}Edit__c, ${NAMESPACE}ContextType__c FROM ${NAMESPACE}WorkflowContext__c WHERE ${NAMESPACE}WorkflowPathNode__c = '${workflowNodeId}'`
  );
};

export const fetchContextConditions = contextId => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}Field__c, ${NAMESPACE}Operator__c, ${NAMESPACE}Value__c FROM ${NAMESPACE}WorkflowContextCondition__c WHERE ${NAMESPACE}Context__c = '${contextId}'`
  );
};
