import api from '../utils/api';
import * as meetingApi from './meetingApi';

jest.mock('../utils/api');
jest.mock('@oce-apps/oce-apps-bridges', () => {
  const actualModule = jest.requireActual('@oce-apps/oce-apps-bridges');

  return {
    ...actualModule,
    environment: {
      ...actualModule.environment,
      profileId: () => '1'
    }
  }
});

const MEETING_ATTENDEES = [{ Id: '2' }];
const MEETING_SPEAKERS = [{ Id: '3' }];

describe('meetingApi', () => {
  it('fetchMeetingAttendees', async () => {
    api.queryOffline.mockResolvedValueOnce([[{ Id: '1' }]]).mockResolvedValueOnce([MEETING_ATTENDEES]);

    const response = await meetingApi.fetchMeetingAttendees('1', 'OCE_MeetingMember__c');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual(MEETING_ATTENDEES);
  });

  it('fetchMeetingSpeakers', async () => {
    api.queryOffline.mockResolvedValueOnce([[{ Id: '1' }]]).mockResolvedValueOnce([MEETING_SPEAKERS]);

    const response = await meetingApi.fetchMeetingSpeakers('1', 'OCE_MeetingMember__c');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual(MEETING_SPEAKERS);
  });
});
