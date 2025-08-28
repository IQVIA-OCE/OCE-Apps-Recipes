import { databaseManager } from '@oce-apps/oce-apps-bridges';
import { NAMESPACE } from '../constants';

export const CALLS_QUERY = `
  SELECT Id,
         Name,
         ${NAMESPACE}Account__c,
         ${NAMESPACE}Account__r.Name,
         ${NAMESPACE}CallDateTime__c,
         ${NAMESPACE}Channel__c,
         ${NAMESPACE}Status__c
  FROM ${NAMESPACE}Call__c`;

export const fetchMeeting = (meetingId) => {
  const query = `
    SELECT Id,
           Name
    FROM ${NAMESPACE}Meeting__c
    WHERE Id = '${meetingId}'`;

  return databaseManager.fetch(query);
};

export const fetchCalls = (meetingId) => {
  const query = `
    ${CALLS_QUERY}
    WHERE ${NAMESPACE}Meeting__c = '${meetingId}'`;

  return databaseManager.fetchWithParams(query, { batchSize: 100 });
};

export const fetchMeetingAttendees = (meetingId) => {
  const query = `
    SELECT Id,
           Name,
           ${NAMESPACE}Customer__c
    FROM ${NAMESPACE}MeetingMember__c
    WHERE ${NAMESPACE}Meeting__c = '${meetingId}'
          AND RecordType.Name = 'Attendee'`;

  return databaseManager.fetchWithParams(query, { batchSize: 100 });
};
