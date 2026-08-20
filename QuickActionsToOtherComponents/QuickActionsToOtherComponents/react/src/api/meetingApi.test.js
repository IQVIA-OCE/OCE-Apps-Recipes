import { databaseManager } from '@oce-apps/oce-apps-bridges';
import {
  CALLS_ORIG_DATA,
  MEETING_ATTENDEES_ORIG_DATA,
  MEETING_MAPPED_DATA,
  MEETING_ORIG_DATA,
} from '../mocks/meetingTestData';
import * as meetingApi from './meetingApi';

describe('meetingApi', () => {
  beforeEach(() => {
    databaseManager.fetch.mockReset();
    databaseManager.fetchWithParams.mockReset();
  });

  test('fetchMeeting() should return data', async () => {
    databaseManager.fetch.mockResolvedValueOnce(MEETING_ORIG_DATA);

    const response = await meetingApi.fetchMeeting(MEETING_MAPPED_DATA.id);

    expect(databaseManager.fetch).toHaveBeenCalled();
    expect(response).toStrictEqual(MEETING_ORIG_DATA);
  });

  test('fetchCalls() should return data', async () => {
    databaseManager.fetchWithParams.mockResolvedValueOnce(CALLS_ORIG_DATA);

    const response = await meetingApi.fetchCalls(MEETING_MAPPED_DATA.id);

    expect(databaseManager.fetchWithParams).toHaveBeenCalled();
    expect(response).toStrictEqual(CALLS_ORIG_DATA);
  });

  test('fetchMeetingAttendees() should return data', async () => {
    databaseManager.fetchWithParams.mockResolvedValueOnce(
      MEETING_ATTENDEES_ORIG_DATA
    );

    const response = await meetingApi.fetchMeetingAttendees(
      MEETING_MAPPED_DATA.id
    );

    expect(databaseManager.fetchWithParams).toHaveBeenCalled();
    expect(response).toStrictEqual(MEETING_ATTENDEES_ORIG_DATA);
  });
});
