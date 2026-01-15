import api from '../utils/api';
import { NAMESPACE } from '../constants/namespacePrefix';

export const fetchMeetingAttendees = (meetingId) => {
  return api.queryOffline(`SELECT Id, Name, ${NAMESPACE}Status__c, ${NAMESPACE}Customer__c, ${NAMESPACE}Colleague__c, ${NAMESPACE}MeetingRecordTypeName__c, ${NAMESPACE}Email__c, ${NAMESPACE}Type__c, ${NAMESPACE}CurrentUser__c, RecordType.DeveloperName\
                          FROM ${NAMESPACE}MeetingMember__c\
                          WHERE ${NAMESPACE}Meeting__c = '${meetingId}'`
  )
}
