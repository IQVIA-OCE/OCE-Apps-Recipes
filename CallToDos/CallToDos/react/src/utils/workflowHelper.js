import { queryWithSOQL } from "../utils/helpers";

export const fetchContextType = objectName => {
  return queryWithSOQL(
    `SELECT Id, OCE__Object__c, OCE__isControlledByWorkflowPath__c FROM OCE__WorkflowContextType__c WHERE OCE__Object__c = '${objectName}' AND OCE__Relationship__c = null AND OCE__isControlledByWorkflowPath__c = true`
  );
};

export const fetchWorkflowConfiguration = contextTypeId => {
  return queryWithSOQL(
    `SELECT Id, OCE__ControllingField__c, OCE__RecordTypeName__c from OCE__WorkflowPath__c WHERE OCE__ContextType__c = '${contextTypeId}' AND OCE__Status__c = 'Active'`
  );
};

export const fetchWorkflowNodes = workflowConfigurationId => {
  return queryWithSOQL(
    `SELECT Id, OCE__ControllingFieldValue__c from OCE__WorkflowPathNode__c WHERE OCE__WorkflowPath__c  = '${workflowConfigurationId}'`
  );
};

export const fetchContextWithChildObject = (workflowNodeId, parentContextId, childObjectName) => {
  return queryWithSOQL(
    `SELECT Id, OCE__Create__c, OCE__Delete__c, OCE__Edit__c from OCE__WorkflowContext__c WHERE OCE__WorkflowPathNode__c = '${workflowNodeId}' and OCE__ParentContext__c = '${parentContextId}' and OCE__ContextType__r.OCE__Object__c = '${childObjectName}' order by OCE__Rank__c asc`
  );
};

export const fetchContext = workflowNodeId => {
  return queryWithSOQL(
    `SELECT Id, OCE__Create__c, OCE__Delete__c, OCE__Edit__c, OCE__ParentContext__r.OCE__ContextType__r.OCE__Object__c, OCE__ContextType__r.OCE__Relationship__c from OCE__WorkflowContext__c WHERE OCE__WorkflowPathNode__c = '${workflowNodeId}' and OCE__ParentContext__c = null order by OCE__Rank__c asc`
  );
};

export const fetchContextConditions = workflowNodeId => {
  return queryWithSOQL(
    `SELECT Id, OCE__Field__c, OCE__Operator__c, OCE__Value__c, OCE__Context__c from OCE__WorkflowContextCondition__c WHERE OCE__Context__r.OCE__WorkflowPathNode__c = '${workflowNodeId}'`
  );
};

export const getPermissionsByWorkflow = async (record, mainObjectName, childObjectName, childRecord) => {
  let permissions = {
    canAddMain: true,
    canEditMain: true,
    canDeleteMain: true,
    mainObjectContextFound: false,
    canAddChild: true,
    canEditChild: true,
    canDeleteChild: true,
    childObjectContextFound: false,
  };

  //try {
    let contextType = await fetchContextType(mainObjectName);

    let workflowConfig = await fetchWorkflowConfiguration(contextType[0].Id);
    if (workflowConfig[0].Id) {
      let conditionsPassed = true;
      let mainContextId = "";
      let canAddMain = true;
      let canEditMain = true;
      let canDeleteMain = true;
      let mainObjectContextFound = false;
      let canAddChild = true;
      let canEditChild = true;
      let canDeleteChild = true;
      let childObjectContextFound = false;

      const conditionCheckers = {
        EQUALS: (value, conditionValue) => String(value) === String(conditionValue),
        NOT_EQUALS: (value, conditionValue) => String(value) !== String(conditionValue),
        EQUALS_NULL: value => value === null,
        NOT_EQUALS_NULL: value => value !== null,
        IN: (value, conditionValue) =>
          conditionValue.split(';').includes(value),
        NOT_IN: (value, conditionValue) =>
          !conditionValue.split(';').includes(value),
      };

      const workflowNodes = await fetchWorkflowNodes(workflowConfig[0].Id);
      const relatedWorkflowNode = workflowNodes.find(node => {
        const controllingField = workflowConfig[0].OCE__ControllingField__c;
        return node['OCE__ControllingFieldValue__c'] === record[controllingField];
      });

      const workflowContext = await fetchContext(relatedWorkflowNode['Id']);
      const workflowConditions = await fetchContextConditions(relatedWorkflowNode['Id']);
      outerloop1: for (let i = 0; i < workflowContext.length; i++) {
        conditionsPassed = true;
        const context = workflowContext[i];
        const relatedWorkflowContextConditions = workflowConditions.filter((record) => record.OCE__Context__c == context['Id']);
        innerloop1: for (let j = 0; j < relatedWorkflowContextConditions.length; j++) {
          if (conditionsPassed === false) break innerloop1;

          canAddMain = false;
          canEditMain = false;
          canDeleteMain = false;
          mainObjectContextFound = true;

          const condition = relatedWorkflowContextConditions[j];

          const fieldName = condition['OCE__Field__c'];
          const operator = condition['OCE__Operator__c'];
          const value = condition['OCE__Value__c'];

          conditionsPassed = conditionCheckers[operator](
            record[fieldName],
            value
          );
        }
        if (conditionsPassed) {
          mainContextId = context['Id'];
          canAddMain = context['OCE__Create__c'];
          canEditMain = context['OCE__Edit__c'];
          canDeleteMain = context['OCE__Delete__c'];
          break outerloop1;
        }
      }
      if (childObjectName.length > 0 && mainContextId.length > 0) {
        const workflowContextWithChildObject = await fetchContextWithChildObject(relatedWorkflowNode['Id'], mainContextId, childObjectName);
        outerloop2: for (let i = 0; i < workflowContextWithChildObject.length; i++) {
          conditionsPassed = true;
          const context = workflowContextWithChildObject[i];
          if (childRecord) {
            const relatedWorkflowContextConditions = workflowConditions.filter((record) => record.OCE__Context__c == context['Id']);
            innerloop2: for (let j = 0; j < relatedWorkflowContextConditions.length; j++) {
              if (conditionsPassed === false) break innerloop2;

              canAddChild = false;
              canEditChild = false;
              canDeleteChild = false;
              childObjectContextFound = true;
    
              const condition = relatedWorkflowContextConditions[j];
    
              const fieldName = condition['OCE__Field__c'];
              const operator = condition['OCE__Operator__c'];
              const value = condition['OCE__Value__c'];
    
              conditionsPassed = conditionCheckers[operator](
                childRecord[fieldName],
                value
              );
            }
          }
          if (conditionsPassed) {
            canAddChild = context['OCE__Create__c'];
            canEditChild = context['OCE__Edit__c'];
            canDeleteChild = context['OCE__Delete__c'];
            break outerloop2;
          }
        }
      }
      permissions = {
        canAddMain: Boolean(canAddMain),
        canEditMain: Boolean(canEditMain),
        canDeleteMain: Boolean(canDeleteMain),
        mainObjectContextFound: Boolean(mainObjectContextFound),
        canAddChild: Boolean(canAddChild),
        canEditChild: Boolean(canEditChild),
        canDeleteChild: Boolean(canDeleteChild),
        childObjectContextFound: Boolean(childObjectContextFound),
      };

      return permissions;
    }
  /*
  } catch (error) {
    throw error;
  }
  */
};