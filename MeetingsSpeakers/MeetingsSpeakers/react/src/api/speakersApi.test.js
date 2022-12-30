import * as speakerApi from './speakersApi';
import { databaseManager } from 'oce-apps-bridges';
import { isJapaneseLocale } from '../utils';
import { FETCH_MEETING_MEMBERS_RESPONSE, FETCH_MEETING_RESPONSE, FETCH_RECORD_TYPE_RESPONSE } from '../constants';
import api from '../utils/api';

jest.mock('../utils/isJapaneseLocale');
jest.mock('../utils/api');
/*jest.mock('oce-apps-bridges/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    locale: () => '',
  },
}));*/
jest.mock('oce-apps-bridges/lib/Database/DatabaseManager', () => ({
  databaseManager: {
    upsert: jest.fn(),
    delete: jest.fn(),
  },
}));

const FETCH_SPEAKERS_RESPONSE = [
  [
    {
      Id: 'a4v6g000000qLrbAAE',
      Name: 'Ziad Attar',
      professionalDesignation: null,
      specialty: null,
      status: 'Nominated',
    },
  ],
];

const FETCH_USER_PREFERRED_COUNTRY_RESPONSE = [
  [{ QIDC__MDM_Preferred_Country_ims__c: 'US', uid: '0056g000002f4cZAAQ' }],
];

const ADVANCED_SEARCH_AVAILABLE_RESPONSE = [[{ OCE__EnableAdvancedSearch__c: 1, uid: 'a1t6g000000BsbSAAS' }]];

const ADVANCED_SEARCH_UNAVAILABLE_RESPONSE = [[{ OCE__EnableAdvancedSearch__c: 0, uid: 'a1t6g000000BsbSAAS' }]];

const DOES_FIELD_EXIST_RESPONSE = [[{ OCE__Status__c: 'Nominated', uid: 'a4v6g000001AZqpAAG' }]];

describe('speakersApi', () => {
  it('fetchSpeakers', async () => {
    api.queryOffline.mockResolvedValueOnce(FETCH_SPEAKERS_RESPONSE);

    await speakerApi.fetchSpeakers({});
    expect(api.queryOffline).toHaveBeenCalledWith(
      'SELECT Id, Name, OCE__Account__c, OCE__Account__r.OCE__AllowRestrictedProducts__c, OCE__Account__r.Id, OCE__Specialty__c, OCE__ProfessionalDesignation__c, OCE__Status__c, OCE__User__c FROM OCE__Speaker__c ORDER BY Name ASC LIMIT 15 OFFSET 0'
    );

    api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_UNAVAILABLE_RESPONSE);
    api.queryOffline.mockResolvedValueOnce(FETCH_SPEAKERS_RESPONSE);

    await speakerApi.fetchSpeakers({
      limit: 15,
      offset: 0,
      searchQuery: 'Test',
    });

    expect(api.queryOffline).toHaveBeenLastCalledWith(
      `SELECT Id, Name, OCE__Account__c, OCE__Account__r.OCE__AllowRestrictedProducts__c, OCE__Account__r.Id, OCE__Specialty__c, OCE__ProfessionalDesignation__c, OCE__Status__c, OCE__User__c FROM OCE__Speaker__c WHERE (Name LIKE '%Test%') ORDER BY Name ASC LIMIT 15 OFFSET 0`
    );

    api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_AVAILABLE_RESPONSE);
    api.queryOffline.mockResolvedValueOnce(FETCH_SPEAKERS_RESPONSE);

    await speakerApi.fetchSpeakers({
      limit: 15,
      offset: 0,
      searchQuery: 'Test',
    });

    expect(api.queryOffline).toHaveBeenLastCalledWith(
      `SELECT Id, Name, OCE__Account__c, OCE__Account__r.OCE__AllowRestrictedProducts__c, OCE__Account__r.Id, OCE__Specialty__c, OCE__ProfessionalDesignation__c, OCE__Status__c, OCE__User__c FROM OCE__Speaker__c WHERE (Name LIKE '%Test%' OR OCE__Specialty__c INCLUDES ('Test') OR OCE__ProfessionalDesignation__c INCLUDES ('Test') OR OCE__Status__c LIKE '%Test%') ORDER BY Name ASC LIMIT 15 OFFSET 0`
    );
  });

  it('fetchMeeting', async () => {
    api.queryOffline.mockResolvedValue(FETCH_MEETING_RESPONSE);

    const response = await speakerApi.fetchMeeting('a3c04000000Gs0UAAS');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual(FETCH_MEETING_RESPONSE);
  });

  it('fetchRecordType', async () => {
    api.queryOffline.mockResolvedValue(FETCH_RECORD_TYPE_RESPONSE);

    const response = await speakerApi.fetchRecordType('0126g000000LvxTAAS');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual(FETCH_RECORD_TYPE_RESPONSE);
  });

  it('fetchMeetingMembers', async () => {
    api.queryOffline.mockResolvedValue(FETCH_MEETING_MEMBERS_RESPONSE);

    const response = await speakerApi.fetchMeetingMembers('a3c04000000Gs0UAAS', '0126g000000LvxTAAS');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual(FETCH_MEETING_MEMBERS_RESPONSE);
  });

  it('fetchUserPreferredCountries', async () => {
    api.queryOffline.mockResolvedValue(FETCH_USER_PREFERRED_COUNTRY_RESPONSE);

    const response = await speakerApi.fetchUserPreferredCountries('0056g000002f4cZAAQ');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual(FETCH_USER_PREFERRED_COUNTRY_RESPONSE);
  });

  it('createMeetingMembers', async () => {
    const members = [
      {
        Id: '1',
      },
    ];
    await speakerApi.createMeetingMembers(members);

    expect(databaseManager.upsert).toHaveBeenCalledWith([
      {
        Id: '1',
        sobject: 'OCE__meetingmember__c',
      },
    ]);
  });

  it('deleteMeetingMembers', async () => {
    const ids = ['1'];
    await speakerApi.deleteMeetingMembers(ids);

    expect(databaseManager.delete).toHaveBeenCalledWith(ids);
  });

  it('doesFieldExist', async () => {
    api.queryOffline.mockResolvedValueOnce(DOES_FIELD_EXIST_RESPONSE);

    let doesExist = await speakerApi.doesFieldExist('OCE__Status__c', 'OCE__Speaker__C');
    expect(doesExist).toBe(true);

    api.queryOffline.mockRejectedValueOnce(new Error('error'));

    doesExist = await speakerApi.doesFieldExist('OCE__Status__c', 'OCE__Speaker__C');
    expect(doesExist).toBe(false);
  });

  it('getIsAdvancedSearchEnabled', async () => {
    api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_AVAILABLE_RESPONSE);

    let isAvailable = await speakerApi.getIsAdvancedSearchEnabled('1');
    expect(isAvailable).toBe(true);

    api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_UNAVAILABLE_RESPONSE);

    isAvailable = await speakerApi.getIsAdvancedSearchEnabled('1');
    expect(isAvailable).toBe(false);

    api.queryOffline.mockResolvedValueOnce([[{}]]);

    isAvailable = await speakerApi.getIsAdvancedSearchEnabled('1');
    expect(isAvailable).toBe(false);
  });

  describe('getDbSearchFields', () => {
    it('with enabled advanced search', async () => {
      isJapaneseLocale.mockReturnValueOnce(false);
      api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_AVAILABLE_RESPONSE);

      api.queryOffline.mockResolvedValueOnce(DOES_FIELD_EXIST_RESPONSE);
      api.queryOffline.mockResolvedValueOnce(DOES_FIELD_EXIST_RESPONSE);
      api.queryOffline.mockResolvedValueOnce(DOES_FIELD_EXIST_RESPONSE);

      const fields = await speakerApi.getDbSearchFields();
      expect(fields).toStrictEqual(['Name', 'OCE__Specialty__c', 'OCE__ProfessionalDesignation__c', 'OCE__Status__c']);
    });

    it('with disabled advanced search', async () => {
      isJapaneseLocale.mockReturnValueOnce(false);
      api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_UNAVAILABLE_RESPONSE);

      const fields = await speakerApi.getDbSearchFields();
      expect(fields).toStrictEqual(['Name']);
    });

    it('japanese locale', async () => {
      isJapaneseLocale.mockReturnValueOnce(true);

      api.queryOffline.mockResolvedValueOnce(ADVANCED_SEARCH_UNAVAILABLE_RESPONSE);

      const fields = await speakerApi.getDbSearchFields();
      expect(fields).toStrictEqual(['Name', 'OCE__kananame__c']);
    });
  });
});
