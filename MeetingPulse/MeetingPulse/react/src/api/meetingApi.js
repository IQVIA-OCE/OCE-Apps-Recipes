import api from '../utils/api';
import { NAMESPACE } from '../constants/namespacePrefix';

export const fetchMeeting = (meetingId) => {
  return api.queryOffline(`SELECT ${NAMESPACE}Status__c, ${NAMESPACE}StartDateTime__c, ${NAMESPACE}EndDateTime__c, CurrencyIsoCode\
      FROM ${NAMESPACE}Meeting__c\
      WHERE Id = '${meetingId}'\
    `);
};

export const fetchEstimatedExpense = (meetingId) => {
  return api.queryOffline(`SELECT SUM(${NAMESPACE}Amount__c) Amount\
      FROM ${NAMESPACE}MeetingExpense__c\
      WHERE ${NAMESPACE}meeting__c = '${meetingId}' AND recordtype.name = 'Estimate'
    `);
};
