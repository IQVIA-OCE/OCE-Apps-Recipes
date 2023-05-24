import { sfNetAPI } from 'oce-apps-bridges';
import api from '../utils/api';
import * as accountTeamsApi from './accountTeamsApi';
import {
    territoryIds,
    customSettingsForTrue,
    customSettingsForFalse,
    territoryNames,
    teamMembers,
    searchTeamMemeberData,
    layoutData
} from './../constants/mockData'

jest.mock('../utils/api');
jest.mock('oce-apps-bridges', () => ({
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        locale: () => '',
    },
    sfNetAPI: {
        query: () => jest.fn()
    }
}));

describe('accountTeams Api', () => {
    beforeAll(() => {
        sfNetAPI.query = jest.fn();
        sfNetAPI.describe = jest.fn();
    });
    it('should call fetchTerritoryIdForAccounts for given account and DoNotUseTerritories255Field__c is true', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: customSettingsForTrue, total: 1 })
        const data = await accountTeamsApi.fetchTerritoryIdForAccounts('0014x000009EWxNAAW');
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(customSettingsForTrue);
    });
    it('should call fetchTerritoryIdForAccounts for given account and DoNotUseTerritories255Field__c is false', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: customSettingsForFalse, total: 1 })
        const data = await accountTeamsApi.fetchTerritoryIdForAccounts('0014x000009EWxNAAW');
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual("");
    });
    it('should fetch territoryIds  for given account and DoNotUseTerritories255Field__c is true', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: territoryIds, total: 1 })
        const data = await accountTeamsApi.fetchTerritoryIds('0014x000009EWxNAAW');
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(territoryIds);
    });
    it('should fetch fetchTerritoryIdForAccounts  for given account and DoNotUseTerritories255Field__c is false', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: territoryNames, total: 1 })
        const data = await accountTeamsApi.fetchTerritoryIdFromName('0014x000009EWxNAAW');
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(territoryNames);
    });

    it('should fetch team members for given account and territoryIds', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: teamMembers, total: 1 })

        const params = {
            limit: 15,
            offset: 0,
            searchQuery: '',
            territoryIds: "'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'"
        }
        const data = await accountTeamsApi.fetchAccountTeamMemebers({ ...params });
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(teamMembers);
    });
    it('should call teamMemebers without territoryIds and given account', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: [], total: 1 })
        const data = await accountTeamsApi.fetchAccountTeamMemebers({});
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual([]);
    });
    it('should call teamMemebers with a search query parameter', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: searchTeamMemeberData, total: 1 })
        const params = {
            limit: 15,
            offset: 0,
            searchQuery: 'test',
            territoryIds: "'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'"
        }
        const data = await accountTeamsApi.fetchAccountTeamMemebers({ ...params });
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(searchTeamMemeberData);
    });
    it('should call teamMemebers with a filter query parameter', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: searchTeamMemeberData, total: 1 })
        const params = {
            limit: 15,
            offset: 0,
            searchQuery: '',
            filter: {
                'User.Name': 'test',
                'Territory2.Name': 'Aurora',
                'User.Phone': '480',
                'Territory2.AccountAccessLevel': 'Read'
            },
            territoryIds: "'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'"

        }
        const data = await accountTeamsApi.fetchAccountTeamMemebers({ ...params });
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(searchTeamMemeberData);
    });
    it('should call teamMemebers with territory name filter query parameter', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: searchTeamMemeberData, total: 1 })
        const params = {
            limit: 15,
            offset: 0,
            searchQuery: '',
            filter: {
                'Territory2.Name': 'Aurora',
                'User.Phone': '480',
                'Territory2.AccountAccessLevel': 'Read'
            },
            territoryIds: "'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'"

        }
        const data = await accountTeamsApi.fetchAccountTeamMemebers({ ...params });
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(searchTeamMemeberData);
    });
    it('should call teamMemebers with user phone filter query parameter', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: searchTeamMemeberData, total: 1 })
        const params = {
            limit: 15,
            offset: 0,
            searchQuery: '',
            filter: {
                'User.Phone': '480',
                'Territory2.AccountAccessLevel': 'Read'
            },
            territoryIds: "'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'"

        }
        const data = await accountTeamsApi.fetchAccountTeamMemebers({ ...params });
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(searchTeamMemeberData);
    });
    it('should call teamMemebers with AccountAccessLevel filter query parameter', async () => {
        const spy = sfNetAPI.query.mockImplementation().mockResolvedValue({ records: searchTeamMemeberData, total: 1 })
        const params = {
            limit: 15,
            offset: 0,
            searchQuery: '',
            filter: {
                'Territory2.AccountAccessLevel': 'Read'
            },
            territoryIds: "'0MI4x0000000TLGGA2','0MI4x0000000TLHGA2','0MI4x0000000TLIGA2'"

        }
        const data = await accountTeamsApi.fetchAccountTeamMemebers({ ...params });
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual(searchTeamMemeberData);
    });
    it('should call layouts for Territory2', async () => {
        const spy = sfNetAPI.describe.mockImplementation().mockResolvedValue({ records: layoutData })
        const data = await accountTeamsApi.fetchLayouts('Territory2');
        expect(spy).toHaveBeenCalled();
        expect(data).toStrictEqual({ records: layoutData });
    });
});