import api from './api';
import { sfNetAPI, databaseManager } from '@oce-apps/oce-apps-bridges';

describe('api utility', () => {
  beforeAll(() => {
    sfNetAPI.query = jest.fn();
    sfNetAPI.describe = jest.fn();
    sfNetAPI.create = jest.fn();
    sfNetAPI.queryOffline = jest.fn();
  });

  it('query should return value', async () => {
    sfNetAPI.query.mockImplementation((soql, callback) =>
      callback({ records: [1, 2], page: 1 })
    );
    const result = await api.query('');
    expect(result).toStrictEqual([[1, 2], { page: 1 }]);
  });

  it('query should return empty value', async () => {
    sfNetAPI.query.mockImplementation((soql, callback) => callback(null));
    const result = await api.query();
    expect(result).toStrictEqual(null);
  });

  it('query should return error', async () => {
    sfNetAPI.query.mockImplementation((soql, callback, error) =>
      error('Error')
    );
    try {
      await api.query('');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('describe should return value', async () => {
    sfNetAPI.describe.mockImplementation((objectType, callback, error) =>
      callback({ objectType })
    );
    const result = await api.describe('someType');
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('describe should return error', async () => {
    sfNetAPI.describe.mockImplementation((objectType, callback, error) =>
      error('Error')
    );
    try {
      await api.describe();
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('queryOffline should return error', async () => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [] });

    try {
      await api.queryOffline();
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('queryOffline should return empty', async () => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [] });

    const result = await api.queryOffline('test');
    expect(result).toEqual([[],{}]);
  });

  it('queryOffline should return empty', async () => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue([]);

    const result = await api.queryOffline('');
    expect(result).toEqual([]);
  });

  it('create should return value', async () => {
    sfNetAPI.create.mockImplementation((objectType, fields, callback, error) =>
      callback({ objectType })
    );
    const result = await api.create('someType', {});
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('create should return error', async () => {
    sfNetAPI.create.mockImplementation((objectType, fields, callback, error) =>
      error('Error')
    );
    try {
      await api.create();
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });
});
