import { api } from '../utils';
import { NAMESPACE } from '../constants';
import { checkIfTriggerIsEnabled } from './commonApi';
import {
  MEETING_ACCOUNT_UTILIZATION_HANDLER,
  MEETING_MEMBER_ACCOUNT_UTILIZATION_HANDLER,
} from '../constants/dbTriggerNames';

const MEETING_S_OBJECT_TYPE = `${NAMESPACE}MeetingMember__c`;

/**
 *
 * @param {string} by
 * @param {string} sObjectName
 * @return {Promise<*>}
 */
const fetchRecordType = (by, sObjectName) => {
  const query = `
    SELECT Id \
    FROM RecordType \
    WHERE DeveloperName = '${by}' AND SObjectType LIKE '${sObjectName}'
  `;

  return api.queryOffline(query);
};

/**
 *
 * @param {string} meetingId
 * @param {string[]} forIds
 */
const fetchMeetingMembers = (meetingId, forIds) => {
  const query = `
    SELECT Id, ${NAMESPACE}Speaker__c, Name, ${NAMESPACE}Customer__c, ${NAMESPACE}Customer__r.Id, ${NAMESPACE}Speaker__r.${NAMESPACE}Account__r.Id FROM ${NAMESPACE}MeetingMember__c \
    WHERE ${NAMESPACE}Meeting__c = '${meetingId}' AND RecordTypeId IN (${forIds.map(x => `'${x}'`).join(', ')})
  `;

  return api.queryOffline(query);
};

/**
 *
 * @param {string} meetingId
 * @return {Promise<*>}
 */
export const fetchMeetingAttendees = async meetingId => {
  const [[recordType]] = await fetchRecordType('Attendee', MEETING_S_OBJECT_TYPE);
  const [attendees] = await fetchMeetingMembers(meetingId, [recordType.Id]);

  return attendees;
};

/**
 *
 * @param {string} meetingId
 * @return {Promise<*>}
 */
export const fetchMeetingSpeakers = async meetingId => {
  const [[recordType]] = await fetchRecordType('Speaker', MEETING_S_OBJECT_TYPE);
  const [speakers] = await fetchMeetingMembers(meetingId, [recordType.Id]);

  return speakers;
};
