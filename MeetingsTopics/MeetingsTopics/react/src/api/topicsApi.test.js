import api from '../utils/api';
import * as topicsApi from './topicsApi';
import { databaseManager } from '../../bridge/Database/DatabaseManager.native';
import {
  FETCH_TOPICS_DATA,
  MOCK_MEETING,
  SEARCH_TOPICS_DATA
} from '../constants/testData';

jest.mock('../utils/dateTimeFormat', () => ({
  formatDate: (date) => date,
}));

jest.mock('../utils/api');
jest.mock('../../bridge/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    locale: () => '',
  },
}));

jest.mock('../../bridge/Database/DatabaseManager.native', () => ({
  databaseManager: {
    upsert: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('topicsApi', () => {
  it('fetchTopics default', async () => {
    api.queryOffline.mockResolvedValue([FETCH_TOPICS_DATA]);

    const response = await topicsApi.fetchTopics({
      isSystemGeneratedFilterEnabled: false,
      meeting: MOCK_MEETING,
    });
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual([FETCH_TOPICS_DATA]);
  });

  it('fetchTopics on Search', async () => {
    api.queryOffline.mockResolvedValue([SEARCH_TOPICS_DATA]);

    const response = await topicsApi.fetchTopics({
      limit: 15,
      offset: 0,
      searchQuery: 'Meeting Topic 2',
      isSystemGeneratedFilterEnabled: true,
      meeting: MOCK_MEETING,
    });
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual([SEARCH_TOPICS_DATA]);
  });

  it('fetchTopics should return error if API returns error', async () => {
    api.queryOffline.mockImplementationOnce(() => new Promise.resolve([[]]));
    api.queryOffline.mockImplementationOnce(() => {
      throw 'Test error';
    });

    await expect(() =>
      topicsApi.fetchTopics({
        isSystemGeneratedFilterEnabled: true,
        meeting: MOCK_MEETING,
      })
    ).rejects.toEqual('Test error');
  });

  it('fetchMeetingTopics should return error if API returns error', async () => {
    api.queryOffline.mockImplementation(() => {
      throw 'Test error';
    });

    await expect(() => {
      topicsApi.fetchMeetingTopics('test_error');
    }).toThrow('Test error');
  });

  it('fetchMeetingTopics default', async () => {
    api.queryOffline.mockResolvedValue([FETCH_TOPICS_DATA]);

    const response = await topicsApi.fetchMeetingTopics('a470k0000010B32AAE');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual([FETCH_TOPICS_DATA]);
  });

  it('createMeetingTopics', async () => {
    const products = [
      {
        Id: '1',
      },
    ];
    await topicsApi.createMeetingTopics(products);

    expect(databaseManager.upsert).toHaveBeenCalledWith([
      {
        Id: '1',
        sobject: 'OCE__MeetingTopic__c',
      },
    ]);
  });

  it('createMeetingTopics should return error', async () => {
    databaseManager.upsert.mockImplementation(() => {
      throw 'Test error';
    });

    await expect(() => {
      topicsApi.createMeetingTopics([ { Id: '1' } ]);
    }).toThrow('Test error');
  });

  it('deleteMeetingTopic', async () => {
    const ids = ['1'];
    await topicsApi.deleteMeetingTopic(ids);

    expect(databaseManager.delete).toHaveBeenCalledWith(ids);
  });
});
