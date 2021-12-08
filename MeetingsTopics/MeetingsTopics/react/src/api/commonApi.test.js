import api from '../utils/api';
import * as commonApi from './commonApi';

jest.mock('../utils/api');
jest.mock('../../bridge/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    locale: () => '',
  },
}));

const CHECK_TOPIC_FIELDS = [
  { OCE__Status__c: 'Approved', uid: 'a4v6g000001AZqpAAG' }
  ];

const ADVANCED_SEARCH_AVAILABLE_RESPONSE = [
  [{ OCE__EnableAdvancedSearch__c: true, uid: 'a1t6g000000BsbSAAS' }],
];

const ADVANCED_SEARCH_UNAVAILABLE_RESPONSE = [
  [{ OCE__EnableAdvancedSearch__c: false, uid: 'a1t6g000000BsbSAAS' }],
];

describe('commonApi', () => {
  it('doesFieldExist', async () => {
    api.queryOffline.mockResolvedValueOnce(CHECK_TOPIC_FIELDS);

    let doesExist = await commonApi.doesFieldExist(
      'OCE__Status__c',
      'OCE__Topic__c'
    );
    expect(doesExist).toBe(true);

    api.queryOffline.mockRejectedValueOnce(new Error('error'));

    doesExist = await commonApi.doesFieldExist(
      'TEST',
      'OCE__Topic__c'
    );
    expect(doesExist).toBe(false);
  });

  it('getIsAdvancedSearchEnabled', async () => {
    api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_AVAILABLE_RESPONSE);

    let isAvailable = await commonApi.getIsAdvancedSearchEnabled('1');
    expect(isAvailable).toBe(true);

    api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_UNAVAILABLE_RESPONSE);

    isAvailable = await commonApi.getIsAdvancedSearchEnabled('2');
    expect(isAvailable).toBe(false);

    api.queryOffline.mockResolvedValueOnce([[{}]]);

    isAvailable = await commonApi.getIsAdvancedSearchEnabled('3');
    expect(isAvailable).toBe(false);
  });

});
