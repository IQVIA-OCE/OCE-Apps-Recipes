import { ACCOUNT_CALLS_MOCK, ACCOUNTS_MOCK, CALL_DETAILS_MOCK } from '../mocks/dataMocks';
import api from '../utils/api';
import * as callDetailsHistoryApi from './callDetailsHistoryApi'

jest.mock('../utils/api');

describe('callDetailsHistoryApi', () => {
  beforeEach(() => {
    api.query.mockReset();
  });

  describe('fetchAccountById method', () => {
    it('should return data from API', async () => {
      api.query.mockResolvedValueOnce([[ACCOUNTS_MOCK[0]]]);
      const response = await callDetailsHistoryApi.fetchAccountById('0');

      expect(api.query).toHaveBeenCalled();
      expect(response).toStrictEqual(ACCOUNTS_MOCK[0]);
    });

    it('should return error if API returns error', async () => {
      api.query.mockImplementationOnce(() => {
        throw 'Test error';
      });
      const consoleWarnMock = jest.spyOn(global.console, 'warn');

      try {
        await callDetailsHistoryApi.fetchAccountById('0');
      } catch (error) {
        expect(error).toStrictEqual('Test error');
        expect(consoleWarnMock).toHaveBeenCalled();
      }
    });
  });

  describe('fetchAccounts method', () => {
    it('should return data from API', async () => {
      api.query.mockResolvedValueOnce([ACCOUNTS_MOCK]);
      const response = await callDetailsHistoryApi.fetchAccounts('Da');

      expect(api.query).toHaveBeenCalled();
      expect(response).toStrictEqual([
        {
          value: '0',
          label: 'Danca Luchici'
        },
        {
          value: '1',
          label: 'David Labotka'
        },
      ]);
    });

    it('should return error if API returns error', async () => {
      api.query.mockImplementation(() => {
        throw 'Test error';
      });
      const consoleWarnMock = jest.spyOn(global.console, 'warn');

      try {
        await callDetailsHistoryApi.fetchAccounts('Test');
      } catch (error) {
        expect(error).toStrictEqual('Test error');
        expect(consoleWarnMock).toHaveBeenCalled();
      }
    });
  });

  describe('fetchAccountCalls method', () => {
    it('should return data from API', async () => {
      api.query.mockResolvedValueOnce([ACCOUNT_CALLS_MOCK]);
      const response = await callDetailsHistoryApi.fetchAccountCalls('0');

      expect(api.query).toHaveBeenCalled();
      expect(response).toStrictEqual(ACCOUNT_CALLS_MOCK);
    });

    it('should return error if API returns error', async () => {
      api.query.mockImplementationOnce(() => {
        throw 'Test error';
      });
      const consoleWarnMock = jest.spyOn(global.console, 'warn');

      try {
        await callDetailsHistoryApi.fetchAccountCalls('0');
      } catch (error) {
        expect(error).toStrictEqual('Test error');
        expect(consoleWarnMock).toHaveBeenCalled();
      }
    });
  });

  describe('fetchCallDetails method', () => {
    it('should return data from API', async () => {
      api.query.mockResolvedValueOnce([CALL_DETAILS_MOCK]);
      const response = await callDetailsHistoryApi.fetchCallDetails(ACCOUNT_CALLS_MOCK);

      expect(api.query).toHaveBeenCalled();
      expect(response).toStrictEqual(CALL_DETAILS_MOCK);
    });

    it('should return error if API returns error', async () => {
      api.query.mockImplementationOnce(() => {
        throw 'Test error';
      });
      const consoleWarnMock = jest.spyOn(global.console, 'warn');

      try {
        await callDetailsHistoryApi.fetchCallDetails(ACCOUNT_CALLS_MOCK);
      } catch (error) {
        expect(error).toStrictEqual('Test error');
        expect(consoleWarnMock).toHaveBeenCalled();
      }
    });
  });
});
