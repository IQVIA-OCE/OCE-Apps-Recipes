import { NAMESPACE } from '../constants';
import { databaseManager } from 'oce-apps-bridges';

export const fetchActivityPlan = () => {
    return databaseManager.fetch(`select  ${NAMESPACE}limitData__c, ${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id, recordtypeid,recordtype.name from ${NAMESPACE}ActivityPlan__c where recordtype.name = 'Limit'`);
};

export const fetchAccounts = (searchText = '') => {
    return databaseManager.fetch(`select  Id,${NAMESPACE}AccountFullname__c from account WHERE  ${NAMESPACE}AccountFullname__c LIKE '%${searchText}%' OR Id LIKE '%${searchText}%' ORDER BY ${NAMESPACE}AccountFullname__c ASC  `);
};
