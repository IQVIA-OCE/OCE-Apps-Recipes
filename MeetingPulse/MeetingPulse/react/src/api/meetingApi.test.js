import { fetchMeeting } from './meetingApi';
import api from '../utils/api';

jest.mock('../utils/api', () => ({
  queryOffline: jest.fn(),
}));

describe('meetingApi', () => {
  it('fetchMeeting', async () => {
    await fetchMeeting(1);
    expect(api.queryOffline).toHaveBeenCalled();
  });
});
