// Which sObject type is described by workflow path
import { api } from '../utils';
import { NAMESPACE } from '../constants';

export const fetchContextType = object__c => {
  return api.queryOffline(
    `SELECT Id, Label, ${NAMESPACE}Object__c, ${NAMESPACE}isControlledByWorkflowPath__c FROM ${NAMESPACE}ContextType__mdt WHERE ${NAMESPACE}Object__c = '${object__c}' AND ${NAMESPACE}isControlledByWorkflowPath__c = 1`
  );
};

export const fetchContextTypeById = id => {
  return api.queryOffline(
    `SELECT Id, Label, ${NAMESPACE}Object__c, ${NAMESPACE}isControlledByWorkflowPath__c FROM ${NAMESPACE}ContextType__mdt WHERE uid = '${id}'`
  );
};

export const fetchChildContextType = object__c => {
  return api.queryOffline(
    `SELECT Id, Label, ${NAMESPACE}Object__c, ${NAMESPACE}isControlledByWorkflowPath__c FROM ${NAMESPACE}ContextType__mdt\
     WHERE ${NAMESPACE}Object__c = '${object__c}' AND ${NAMESPACE}isControlledByWorkflowPath__c = 1\
     AND ${NAMESPACE}Relationship__c != null`
  );
};

// Workflow path
// Defines Record type and Controlling field for sObject type that was described by context type
// If Status is Inactive workflow path will not be applied to sObject
export const fetchWorkflowConfiguration = contextTypeId => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}ContextType__c, ${NAMESPACE}ControllingField__c, ${NAMESPACE}MeetingRecordTypeName__c FROM ${NAMESPACE}MeetingWorkFlowConfiguration__mdt WHERE ${NAMESPACE}ContextType__c = '${contextTypeId}' AND ${NAMESPACE}Status__c = 'Active'`
  );
};

// Workflow node
// State of an object, value for controlling field
// e.g. If controlling field is Status than value will be 'Approved' or 'Draft' or so on...
export const fetchWorkflowNode = workflowConfigurationId => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}MeetingStatus__c, ${NAMESPACE}DeleteSpeaker__c FROM ${NAMESPACE}MeetingWorkFlowNodeConfiguration__mdt WHERE ${NAMESPACE}MeetingWorkFlowConfiguration__c = '${workflowConfigurationId}'`
  );
};

// Context. Set of criterias Which defines what we can do with particular record
// CRUD permissions for the RECORD
export const fetchContext = (workflowNodeId, contextTypeIds) => {
  const contextTypeIdsString = contextTypeIds?.map(x => `'${x}'`)?.join(', ') ?? '';

  return api.queryOffline(`
      SELECT Id, DeveloperName ${NAMESPACE}Create__c, ${NAMESPACE}Delete__c, ${NAMESPACE}Edit__c, ${NAMESPACE}ContextType__c FROM ${NAMESPACE}Context__mdt\
      WHERE ${NAMESPACE}WorkflowPathNode__c = '${workflowNodeId}' ${
    contextTypeIdsString ? ` AND ${NAMESPACE}ContextType__c IN (${contextTypeIdsString})` : ''
  }
      `);
};

export const fetchChildContext = (parentName, childTypes) => {
  const childTypesIdsString = childTypes.map(x => `'${x}'`)?.join(', ') ?? '';

  return api.queryOffline(`
      SELECT Id, ${NAMESPACE}Create__c, ${NAMESPACE}Delete__c, ${NAMESPACE}Edit__c, ${NAMESPACE}ContextType__c FROM ${NAMESPACE}Context__mdt\
      WHERE ${NAMESPACE}ParentContext__c = '${parentName}' ${
    childTypesIdsString ? ` AND ${NAMESPACE}ContextType__c IN (${childTypesIdsString})` : ''
  }\
      ORDER BY ${NAMESPACE}Rank__c ASC, ${NAMESPACE}CreatedDate__c DESC  
      `);
};

// Context Conditions. Each context has single or several context conditions
// Which Field with what Operator (equals or in) for Value
export const fetchContextConditions = contextId => {
  return api.queryOffline(
    `SELECT Id, ${NAMESPACE}Field__c, ${NAMESPACE}Operator__c, ${NAMESPACE}Value__c, ${NAMESPACE}Context__c FROM ${NAMESPACE}ContextCondition__mdt WHERE ${NAMESPACE}Context__c = '${contextId}'`
  );
};
