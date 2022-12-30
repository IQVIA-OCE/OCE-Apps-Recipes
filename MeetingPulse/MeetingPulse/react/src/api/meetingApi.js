import api from '../utils/api';
import { NAMESPACE } from '../constants/namespacePrefix';

export const fetchMeeting = meetingId => {
  return api.queryOffline(`SELECT ${NAMESPACE}Status__c, ${NAMESPACE}StartDateTime__c, ${NAMESPACE}EndDateTime__c, ${NAMESPACE}TotalEstimatedExpenses__c, CurrencyIsoCode\
      FROM ${NAMESPACE}Meeting__c\
      WHERE Id = '${meetingId}'\
    `);
};
