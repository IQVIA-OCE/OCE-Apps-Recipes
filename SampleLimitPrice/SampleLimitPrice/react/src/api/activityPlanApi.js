import { NAMESPACE } from '../constants';
import { databaseManager } from 'oce-apps-bridges';

export const fetchActivityPlan = () => {
    return databaseManager.fetch(`select  ${NAMESPACE}limitData__c, ${NAMESPACE}AccountGoal__r.${NAMESPACE}Account__r.Id, recordtypeid,recordtype.name from ${NAMESPACE}ActivityPlan__c where recordtype.name = 'Limit'`);
};


export const fetchAccountDetails = (searchText) => {
    return databaseManager.fetch(`select  Id, ${NAMESPACE}AccountFullname__c from account WHERE  ${NAMESPACE}AccountFullname__c LIKE '%${searchText}%' OR Id='${searchText}'  ORDER BY ${NAMESPACE}AccountFullname__c ASC`);
}


export const fetchAllActivityPlans = async (queryLocator = null) => {
    let response;
    if (queryLocator) {
        response = await databaseManager.fetch(queryLocator);
    } else {
        response = await fetchActivityPlan();
    }
    const { done } = response;
    const nextQueryLocator = response.queryLocator;
    let { records } = response;
    if (!done) {
        const extraData = await fetchAllActivityPlans(nextQueryLocator);
        records = records.concat(extraData);
    }
    return records;
}
export const fetchAccounts = async (searchText = '', queryLocator = null) => {
    let response;
    if (queryLocator) {
        response = await databaseManager.fetch(queryLocator);
    } else {
        response = await fetchAccountDetails(searchText);
    }
    const { done } = response;
    const nextQueryLocator = response.queryLocator
    let { records } = response;
    if (!done) {
        const extraData = await fetchAccounts(searchText, nextQueryLocator);
        records = records.concat(extraData);
    }
    return records;
};