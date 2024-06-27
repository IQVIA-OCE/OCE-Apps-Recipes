import api from '../utils/api';
import { NAMESPACE } from '../constants';
import * as meetingApi from './meetingApi';

jest.mock('../utils/api');

const RESPONSE = [
  {
    Id: 'a5T6g0000009JWIEA2',
    Name: 'Meeting1 for testing Primary Meeting Locations',
    [`${NAMESPACE}StartDateTime__c`]: '2021-09-19T00:00:00.000Z',
    [`${NAMESPACE}EndDateTime__c`]: '2021-09-21T00:00:00.000Z',
    [`RecordType.DeveloperName`]: 'Speaker_Meeting',
    [`RecordType.Name`]: 'Speaker Meeting',
  },
];

describe('fetchMeeting', () => {
  it('fetchMeeting should return error if API returns error', async () => {
    api.queryOffline.mockImplementation(() => {
      throw 'Test error';
    });

    await expect(() => {
      meetingApi.fetchMeeting('a6d0k0000error005lsMAAQ');
    }).toThrow('Test error');
  });

  it('fetchMeeting default', async () => {
    api.queryOffline.mockResolvedValue([RESPONSE]);

    const response = await meetingApi.fetchMeeting('a470k0000010B32AAE');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual([RESPONSE]);
  });
});
