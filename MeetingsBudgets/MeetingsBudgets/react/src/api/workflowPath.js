import { api } from '../utils';
import { NAMESPACE } from '../constants';

export const fetchContextType = (object__c) => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}Object__c, ${NAMESPACE}isControlledByWorkflowPath__c FROM ${NAMESPACE}ContextType__mdt WHERE ${NAMESPACE}Object__c = '${object__c}' AND ${NAMESPACE}isControlledByWorkflowPath__c = 1`
  );
};

export const fetchWorkflowConfiguration = (contextTypeId) => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}ControllingField__c, ${NAMESPACE}MeetingRecordTypeName__c FROM ${NAMESPACE}MeetingWorkFlowConfiguration__mdt WHERE ${NAMESPACE}ContextType__c = '${contextTypeId}' AND ${NAMESPACE}Status__c = 'Active'`
  );
};

export const fetchWorkflowNodes = (workflowConfigurationId) => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}MeetingStatus__c FROM ${NAMESPACE}MeetingWorkFlowNodeConfiguration__mdt WHERE ${NAMESPACE}MeetingWorkFlowConfiguration__c = '${workflowConfigurationId}'`
  );
};

export const fetchContext = (workflowNodeId) => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}Create__c, ${NAMESPACE}Delete__c, ${NAMESPACE}Edit__c, ${NAMESPACE}ContextType__c FROM ${NAMESPACE}Context__mdt WHERE ${NAMESPACE}WorkflowPathNode__c = '${workflowNodeId}'`
  );
};

export const fetchContextConditions = (contextId) => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}Field__c, ${NAMESPACE}Operator__c, ${NAMESPACE}Value__c FROM ${NAMESPACE}ContextCondition__mdt WHERE ${NAMESPACE}Context__c = '${contextId}'`
  );
}
