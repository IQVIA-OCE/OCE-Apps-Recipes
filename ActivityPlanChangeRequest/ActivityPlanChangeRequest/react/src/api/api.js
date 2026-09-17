import api from '../utils/api';
import { NAMESPACE } from '../constants/namespacePrefix';
import {
  ADD_ACCOUNT_TYPE,
  REMOVE_ACCOUNT_TYPE,
  UPDATE_ACTIVITY_TYPE,
} from '../constants/updateRecordTypes';

export const fetchDescribedAPCR = () => {
  return api.describe(`${NAMESPACE}ActivityPlanChangeRequest__c`);
};

export const fetchUpdateRecordTypes = () => {
  return api.query(
    `SELECT Id, Name, SobjectType FROM RecordType WHERE SobjectType = '${NAMESPACE}ActivityPlanChangeRequest__c' AND NAME IN ('${ADD_ACCOUNT_TYPE}', '${REMOVE_ACCOUNT_TYPE}', '${UPDATE_ACTIVITY_TYPE}')`
  );
};

export const fetchAccount = (accountId) => {
  return api.query(
    `SELECT Id, FirstName, LastName, ${NAMESPACE}PrimaryAccountAddress__r.${NAMESPACE}FullAddress__c FROM Account WHERE Id = '${accountId}'`
  );
};

export const fetchAccountGoals = (accountId) => {
  return api.query(
    `SELECT Id, ${NAMESPACE}PlanCycle__c, ${NAMESPACE}PlanCycle__r.${NAMESPACE}APCRThreshold__c, ${NAMESPACE}PlanCycle__r.${NAMESPACE}Territory__c, ${NAMESPACE}PlanCycle__r.${NAMESPACE}APCRApproved__c FROM ${NAMESPACE}AccountGoal__c WHERE ${NAMESPACE}Account__c = '${accountId}' AND ${NAMESPACE}PlanCycle__r.${NAMESPACE}Active__c = true`
  );
};

export const fetchAccountPlanCycleDates = (accountId) => {
  return api.query(
    `SELECT ${NAMESPACE}PlanCycle__r.${NAMESPACE}EmployeeReviewEndDate__c, ${NAMESPACE}PlanCycle__r.${NAMESPACE}EmployeeReviewStartDate__c, ${NAMESPACE}PlanCycle__r.${NAMESPACE}ManagerReviewEndDate__c, ${NAMESPACE}PlanCycle__r.${NAMESPACE}ManagerReviewStartDate__c, ${NAMESPACE}PlanCycle__r.${NAMESPACE}EndDate__c, ${NAMESPACE}PlanCycle__r.${NAMESPACE}StartDate__c FROM ${NAMESPACE}AccountGoal__c WHERE ${NAMESPACE}Account__c = '${accountId}'`
  );
};

export const fetchActivityPlan = (accountGoals) => {
  const accountGoalsIdsArray = accountGoals.map(goal => `'${goal.Id}'`).join(', ')
  return api.query(
    `SELECT Id, ${NAMESPACE}AccountGoal__c, ${NAMESPACE}APCRHQGoal__c, ${NAMESPACE}HQGoal__c FROM ${NAMESPACE}ActivityPlan__c WHERE ${NAMESPACE}AccountGoal__r.Id IN (${accountGoalsIdsArray})`
  );
};

export const fetchRelatedGoals = (planCycleId) => {
  return api.query(
    `SELECT Id FROM ${NAMESPACE}AccountGoal__c WHERE ${NAMESPACE}PlanCycle__c = '${planCycleId}'`
  );
};

export const fetchAccountsList = () => {
  return api.query(`SELECT Id, Name FROM Account`);
};
