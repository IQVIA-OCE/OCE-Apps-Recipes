import { ATTENDEESS_STATUSES } from '../../../constants/attendeessStatuses';
import { NAMESPACE } from '../../../constants/namespacePrefix';
import { environment } from 'oce-apps-bridges';

export const mapAttendeesList = (array) => {
  const mappedArray = array.map((attendee) => ({
    id: attendee.Id,
    name: attendee.Name,
    status: attendee[`${NAMESPACE}Status__c`],
    email: attendee[`${NAMESPACE}Email__c`],
    type: attendee[`${NAMESPACE}Type__c`],
    recordTypeName: attendee['RecordType.DeveloperName'],
    meetingMemberRecordTypeName: attendee[`${NAMESPACE}MeetingRecordTypeName__c`],
    isCurrentUser: attendee[`${NAMESPACE}Colleague__c`] === environment.userID(),
    customerId: attendee[`${NAMESPACE}Customer__c`]
  }));

  const includedStatuses = {
    pending: [ATTENDEESS_STATUSES.NOMINATED, ATTENDEESS_STATUSES.INVITED],
    accepted: [ATTENDEESS_STATUSES.ACCEPTED, ATTENDEESS_STATUSES.WALK_IN],
    declined: [ATTENDEESS_STATUSES.DECLINED, ATTENDEESS_STATUSES.CANCELLED_LATE],
  };

  const mappedList = {
    pending: [],
    accepted: [],
    declined: [],
    other: [],
  };

  mappedArray.forEach((attendee) => {
    const status =
      Object.keys(includedStatuses).find((key) => includedStatuses[key].includes(attendee.status)) || 'other';

    mappedList[status].push(attendee);
  });

  return mappedList;
};
