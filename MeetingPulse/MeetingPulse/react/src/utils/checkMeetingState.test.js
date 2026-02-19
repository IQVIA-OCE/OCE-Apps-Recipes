import { checkMeetingState } from './checkMeetingState';
import { MEETING_STATE, MEETING_STATUS } from '../constants/meeting';

const MEETING = {
  endDate: '2022-01-27T13:45:00.000+0000',
  startDate: '2021-12-01T13:45:00.000+0000',
  status: 'Draft',
};

const meetingStartDate = new Date(MEETING.startDate).getTime();
const meetingEndDate = new Date(MEETING.endDate).getTime();

describe('checkMeetingState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('now is before start date', () => {
    beforeEach(() => {
      jest.spyOn(global.Date, 'now').mockImplementation(() => meetingStartDate - 60 * 1000);
    });

    it.each`
      status                            | startDate           | endDate           | expectedState
      ${MEETING_STATUS.Draft}           | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.NotStarted}
      ${MEETING_STATUS.PendingApproval} | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.NotStarted}
      ${MEETING_STATUS.Approved}        | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.NotStarted}
      ${MEETING_STATUS.Execute}         | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.Concluded}       | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.Closed}          | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.Cancelled}       | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
    `(
      'if now > meetingStartDate and the status is "$status", expected meeting state is "$expectedState"',
      ({ status, startDate, endDate, expectedState }) => {
        expect(checkMeetingState(status, startDate, endDate)).toBe(expectedState);
      }
    );
  });

  describe('now is between start date and end date', () => {
    beforeEach(() => {
      jest.spyOn(global.Date, 'now').mockImplementation(() => meetingStartDate + 60 * 1000);
    });

    it.each`
      status                            | startDate           | endDate           | expectedState
      ${MEETING_STATUS.Draft}           | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.InProgress}
      ${MEETING_STATUS.PendingApproval} | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.InProgress}
      ${MEETING_STATUS.Approved}        | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.InProgress}
      ${MEETING_STATUS.Execute}         | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.InProgress}
      ${MEETING_STATUS.Concluded}       | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.Closed}          | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.Cancelled}       | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
    `(
      'if now >= startDate && now <= endDate and the status is "$status", expected meeting state is "$expectedState"',
      ({ status, startDate, endDate, expectedState }) => {
        expect(checkMeetingState(status, startDate, endDate)).toBe(expectedState);
      }
    );
  });

  describe('now is after end date', () => {
    beforeEach(() => {
      jest.spyOn(global.Date, 'now').mockImplementation(() => meetingEndDate + 60 * 1000);
    });

    it.each`
      status                            | startDate           | endDate           | expectedState
      ${MEETING_STATUS.Draft}           | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.PendingApproval} | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.Approved}        | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.Execute}         | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
      ${MEETING_STATUS.Concluded}       | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Ended}
      ${MEETING_STATUS.Closed}          | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Ended}
      ${MEETING_STATUS.Cancelled}       | ${meetingStartDate} | ${meetingEndDate} | ${MEETING_STATE.Conflicting}
    `(
      'if now > endDate and the status is "$status", expected meeting state is "$expectedState"',
      ({ status, startDate, endDate, expectedState }) => {
        expect(checkMeetingState(status, startDate, endDate)).toBe(expectedState);
      }
    );
  });
});
