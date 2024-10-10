import { NAMESPACE } from '../constants';
import { api } from '../utils';
/**
 *
 * @param {string} meetingId
 */
export const fetchMeeting = meetingId => {
  const query = `SELECT Id, Name, ${NAMESPACE}StartDateTime__c, ${NAMESPACE}EndDateTime__c, RecordType.DeveloperName, RecordType.Name FROM ${NAMESPACE}Meeting__c WHERE Id = '${meetingId}'`;

  return api.queryOffline(query);
};
