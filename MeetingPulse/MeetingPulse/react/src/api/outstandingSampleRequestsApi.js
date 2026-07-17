import api from '../utils/api';
import { NAMESPACE } from '../constants/namespacePrefix';

export const fetchOutstandingSampleRequests = (accounts = [], userId) => {
    return api.queryOffline(`SELECT Id, ${NAMESPACE}Call__c, ${NAMESPACE}Account__c, ${NAMESPACE}Account__r.${NAMESPACE}AccountFullName__c, ${NAMESPACE}Quantity__c, ${NAMESPACE}Sample__r.Id, ${NAMESPACE}Sample__r.Name FROM ${NAMESPACE}CallSampleRequest__c WHERE ${NAMESPACE}IsFulfillingPossible__c = true AND ${NAMESPACE}Account__c IN ('${accounts.join("', '")}') ORDER BY ${NAMESPACE}Account__c ASC`);
};