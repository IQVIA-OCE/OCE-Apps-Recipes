import { NAMESPACE } from '../constants/namespacePrefix';
import api from '../utils/api';

export const fetchAllAccounts = meetingId => {
  const query = `SELECT ${NAMESPACE}Customer__c, ${NAMESPACE}Speaker__r.${NAMESPACE}Account__c\
      FROM ${NAMESPACE}MeetingMember__c\
      WHERE ${NAMESPACE}Meeting__c = '${meetingId}'\
      AND (${NAMESPACE}Customer__c != null OR (${NAMESPACE}Speaker__c != null AND ${NAMESPACE}Speaker__r.${NAMESPACE}Account__c != null))`;

  return api.queryOffline(query);
};
