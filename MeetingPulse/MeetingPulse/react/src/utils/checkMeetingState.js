import { MEETING_STATE, MEETING_STATUS, POST_MEETING_STATUSES, PRE_MEETING_STATUSES } from '../constants/meeting';

export const checkMeetingState = (status, startDate, endDate) => {
  const now = Date.now();
  const meetingHasNotStarted = PRE_MEETING_STATUSES.includes(status);
  const meetingInProgress = status === MEETING_STATUS.Execute;
  const meetingHasEnded = POST_MEETING_STATUSES.includes(status);

  switch (true) {
    case meetingHasNotStarted:
      if (now < startDate) {
        return MEETING_STATE.NotStarted;
      } else if (now >= startDate && now <= endDate) {
        return MEETING_STATE.InProgress;
      }

      return MEETING_STATE.Conflicting;
    case meetingInProgress:
      if (now >= startDate && now <= endDate) {
        return MEETING_STATE.InProgress;
      }

      return MEETING_STATE.Conflicting;
    case meetingHasEnded:
      if (now > endDate) {
        return MEETING_STATE.Ended;
      }

      return MEETING_STATE.Conflicting;
    default:
      return MEETING_STATE.Conflicting;
  }
};
