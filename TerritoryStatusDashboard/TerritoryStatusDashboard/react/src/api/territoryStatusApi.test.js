import { sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { getChangeRequestsMockData } from '../mocks/territoryStatusTestData';
import * as territoryStatusApi from './territoryStatusApi';

const countResponseWithData = [{ number: 2 }];
const errorMessage = 'Test error';

const wrapToAPIResponseObj = (data) => ({ records: data, metadata: { done: true } });

describe('territoryStatusApi', () => {
  beforeEach(() => {
    sfNetAPI.query.mockReset();
  });

  describe('fetchTerritoryAccounts', () => {
    test('should return data from API', async () => {
      sfNetAPI.query
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData))
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData))
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData));

      const responseForPersonsWithPeriod = await territoryStatusApi.fetchTerritoryAccounts(true, true);

      expect(sfNetAPI.query.mock.calls.length).toBe(1);
      expect(responseForPersonsWithPeriod).toStrictEqual(countResponseWithData);

      const responseForNotPersonsWithPeriod = await territoryStatusApi.fetchTerritoryAccounts(false, true);

      expect(sfNetAPI.query.mock.calls.length).toBe(2);
      expect(responseForNotPersonsWithPeriod).toStrictEqual(countResponseWithData);

      const responseForPersonsWithoutPeriod = await territoryStatusApi.fetchTerritoryAccounts(true, false);

      expect(sfNetAPI.query.mock.calls.length).toBe(3);
      expect(responseForPersonsWithoutPeriod).toStrictEqual(countResponseWithData);
    });

    test('should return error if API returns error', async () => {
      sfNetAPI.query.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      await expect(() =>
        territoryStatusApi.fetchTerritoryAccounts(true, true)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchChangeRequests', () => {
    test('should return data from API', async () => {
      sfNetAPI.query
        .mockResolvedValueOnce(wrapToAPIResponseObj(getChangeRequestsMockData(1, 2)))
        .mockResolvedValueOnce(wrapToAPIResponseObj(getChangeRequestsMockData(3, 4)));

      const responseForPreviousPeriod = await territoryStatusApi.fetchChangeRequests(true);

      expect(sfNetAPI.query.mock.calls.length).toBe(1);
      expect(responseForPreviousPeriod).toStrictEqual(getChangeRequestsMockData(1, 2));

      const responseForThisPeriod = await territoryStatusApi.fetchChangeRequests(false);

      expect(sfNetAPI.query.mock.calls.length).toBe(2);
      expect(responseForThisPeriod).toStrictEqual(getChangeRequestsMockData(3, 4));
    });

    test('should return error if API returns error', async () => {
      sfNetAPI.query.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(() =>
        territoryStatusApi.fetchChangeRequests(false)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchNewEnrollments', () => {
    test('should return data from API', async () => {
      sfNetAPI.query
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData))
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData));

      const responseForPreviousPeriod = await territoryStatusApi.fetchNewEnrollments(true);

      expect(sfNetAPI.query.mock.calls.length).toBe(1);
      expect(responseForPreviousPeriod).toStrictEqual(countResponseWithData);

      const responseForThisPeriod = await territoryStatusApi.fetchNewEnrollments(false);

      expect(sfNetAPI.query.mock.calls.length).toBe(2);
      expect(responseForThisPeriod).toStrictEqual(countResponseWithData);
    });

    test('should return error if API returns error', async () => {
      sfNetAPI.query.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(() =>
        territoryStatusApi.fetchNewEnrollments(false)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchConnectRegistration', () => {
    test('should return data from API', async () => {
      sfNetAPI.query
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData))
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData));

      const responseForPreviousPeriod = await territoryStatusApi.fetchConnectRegistration(true);

      expect(sfNetAPI.query.mock.calls.length).toBe(1);
      expect(responseForPreviousPeriod).toStrictEqual(countResponseWithData);

      const responseForThisPeriod = await territoryStatusApi.fetchConnectRegistration(false);

      expect(sfNetAPI.query.mock.calls.length).toBe(2);
      expect(responseForThisPeriod).toStrictEqual(countResponseWithData);
    });

    test('should return error if API returns error', async () => {
      sfNetAPI.query.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(() =>
        territoryStatusApi.fetchConnectRegistration(false)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchCollectedOpt', () => {
    test('should return data from API', async () => {
      sfNetAPI.query
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData))
        .mockResolvedValueOnce(wrapToAPIResponseObj(countResponseWithData));

      const responseForPreviousPeriod = await territoryStatusApi.fetchCollectedOpt(true);

      expect(sfNetAPI.query.mock.calls.length).toBe(1);
      expect(responseForPreviousPeriod).toStrictEqual(countResponseWithData);

      const responseForThisPeriod = await territoryStatusApi.fetchCollectedOpt(false);

      expect(sfNetAPI.query.mock.calls.length).toBe(2);
      expect(responseForThisPeriod).toStrictEqual(countResponseWithData);
    });

    test('should return error if API returns error', async () => {
      sfNetAPI.query.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(() =>
        territoryStatusApi.fetchCollectedOpt(false)
      ).rejects.toThrow(errorMessage);
    });
  });
});
