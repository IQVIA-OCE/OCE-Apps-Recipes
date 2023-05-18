import { databaseManager, metadataBridge, sfNetAPI } from 'oce-apps-bridges';
import * as toDoApi from './ToDo';
import { TODO_IOS_RAW, UPSERT_PAYLOAD_NORMALIZED } from '../constants';
import { Platform } from 'react-native';

jest.mock('oce-apps-bridges', () => ({
  sfNetAPI: {
    restRequest: jest.fn(),
    describe: jest.fn(),
  },
  databaseManager: {
    upsert: jest.fn(),
    fetch: jest.fn(),
  },
  metadataBridge: {
    describe: jest.fn(),
  },
  environment: {
    namespace: () => 'OCE__',
  },
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  let platform = {
    OS: 'ios',
  };

  const select = jest.fn().mockImplementation((obj) => {
    const value = obj[platform.OS];
    return !value ? obj.default : value;
  });

  platform.select = select;

  return platform;
});

describe('ToDo api', () => {
  beforeEach(() => {
    databaseManager.upsert.mockReset();
    databaseManager.fetch.mockReset();
    metadataBridge.describe.mockReset();
    sfNetAPI.restRequest.mockReset();
    sfNetAPI.describe.mockReset();
  });

  describe('fetchToDo method', () => {
    test('fetchToDo should return data', async () => {
      databaseManager.fetch.mockResolvedValueOnce({
        records: TODO_IOS_RAW,
        done: true,
        queryLocator: null,
      });

      const response = await toDoApi.fetchToDo({
        sortDirection: 'DESC',
        sortColumn: { value: 'NAME' },
        selectedComplianceType: { value: 'EPPV' },
        searchValue: 'Seach text',
      });
      expect(databaseManager.fetch).toHaveBeenCalled();
      expect(response).toStrictEqual({
        records: TODO_IOS_RAW,
        done: true,
        queryLocator: null,
      });
    });
  });

  describe('fetchByQueryLocator method', () => {
    test('fetchByQueryLocator should return data on WEB', async () => {
      Platform.OS = 'web';

      sfNetAPI.restRequest.mockResolvedValueOnce({
        records: TODO_IOS_RAW,
        done: true,
        queryLocator: null,
      });

      const response = await toDoApi.fetchByQueryLocator('queryLocatorId');
      expect(sfNetAPI.restRequest).toHaveBeenCalled();
      expect(response).toStrictEqual({
        records: TODO_IOS_RAW,
        done: true,
        queryLocator: null,
      });
    });

    test('fetchByQueryLocator should return data on IOS', async () => {
      Platform.OS = 'ios';

      databaseManager.fetch.mockResolvedValueOnce({
        records: TODO_IOS_RAW,
        done: true,
        queryLocator: null,
      });

      const response = await toDoApi.fetchByQueryLocator('queryLocatorId');
      expect(databaseManager.fetch).toHaveBeenCalled();
      expect(response).toStrictEqual({
        records: TODO_IOS_RAW,
        done: true,
        queryLocator: null,
      });
    });
  });

  describe('fetchComplianceMetadata method', () => {
    test('fetchComplianceMetadata should return data on WEB', async () => {
      Platform.OS = 'web';

      sfNetAPI.describe.mockResolvedValueOnce({ sObjectField: 'test' });
      const response = await toDoApi.fetchComplianceMetadata('sObject');

      expect(sfNetAPI.describe).toHaveBeenCalled();
      expect(response).toStrictEqual({ sObjectField: 'test' });
    });

    test('fetchComplianceMetadata should return data on IOS', async () => {
      Platform.OS = 'ios';

      metadataBridge.describe.mockResolvedValueOnce({ sObjectField: 'test' });
      const response = await toDoApi.fetchComplianceMetadata('sObject');

      expect(metadataBridge.describe).toHaveBeenCalled();
      expect(response).toStrictEqual({ sObjectField: 'test' });
    });
  });

  describe('fetchAccountComplianceCycleMetadata method', () => {
    test('fetchAccountComplianceCycleMetadata should return data on WEB', async () => {
      Platform.OS = 'web';

      sfNetAPI.describe.mockResolvedValueOnce({ sObjectField: 'test' });
      const response = await toDoApi.fetchAccountComplianceCycleMetadata(
        'sObject'
      );

      expect(sfNetAPI.describe).toHaveBeenCalled();
      expect(response).toStrictEqual({ sObjectField: 'test' });
    });

    test('fetchAccountComplianceCycleMetadata should return data on IOS', async () => {
      Platform.OS = 'ios';

      metadataBridge.describe.mockResolvedValueOnce({ sObjectField: 'test' });
      const response = await toDoApi.fetchAccountComplianceCycleMetadata(
        'sObject'
      );

      expect(metadataBridge.describe).toHaveBeenCalled();
      expect(response).toStrictEqual({ sObjectField: 'test' });
    });
  });

  describe('fetchAccounts method', () => {
    test('fetchAccounts should return data', async () => {
      databaseManager.fetch.mockResolvedValueOnce({
        records: [{ Name: 'Account' }],
      });
      const response = await toDoApi.fetchAccounts('parentId');

      expect(databaseManager.fetch).toHaveBeenCalled();
      expect(response).toStrictEqual({
        records: [{ Name: 'Account' }],
      });
    });
  });

  describe('fetchInProgressACCNumber method', () => {
    test('fetchInProgressACCNumber should return data', async () => {
      databaseManager.fetch.mockResolvedValueOnce({ records: [] });
      const response = await toDoApi.fetchInProgressACCNumber();

      expect(databaseManager.fetch).toHaveBeenCalled();
      expect(response).toStrictEqual({ records: [] });
    });
  });

  describe('saveToDo method', () => {
    test('saveToDo should upsert data', async () => {
      databaseManager.upsert.mockResolvedValueOnce('todo_id');
      const response = await toDoApi.saveToDo(UPSERT_PAYLOAD_NORMALIZED);

      expect(databaseManager.upsert).toHaveBeenCalled();
      expect(response).toStrictEqual('todo_id');
    });
  });
});
