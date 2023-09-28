import { sfNetAPI, databaseManager } from 'oce-apps-bridges';
import api from './api';

describe('api utility', () => {
  beforeEach(() => {
    sfNetAPI.query.mockReset();
    sfNetAPI.describe.mockReset();
    sfNetAPI.create.mockReset();
    sfNetAPI.update.mockReset();
    sfNetAPI.del.mockReset();
    sfNetAPI.apexRest.mockReset();
    databaseManager.fetch.mockReset();
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

  it('queryOffline should return value', async () => {
    databaseManager.fetch.mockImplementation(
      (soql) =>
        new Promise((resolve) =>
          resolve({
            records: [1, 2],
            method: 'test',
            amount: 2,
          })
        )
    );
    const result = await api.queryOffline('test');
    expect(result).toStrictEqual([[1, 2], { amount: 2, method: 'test' }]);
  });

  it('queryOffline should return empty value', async () => {
    databaseManager.fetch.mockImplementation(
      (soql) => new Promise((resolve) => resolve(null))
    );
    const result = await api.queryOffline();
    expect(result).toBeNull();
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

  it('update should return value', async () => {
    sfNetAPI.update.mockImplementation(
      (objectType, id, fields, callback, error) => callback({ objectType })
    );
    const result = await api.update('someType', {});
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('update should return error', async () => {
    sfNetAPI.update.mockImplementation(
      (objectType, id, fields, callback, error) => error('Error')
    );
    try {
      await api.update('someType');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('del should return value', async () => {
    sfNetAPI.del.mockImplementation((objectType, id, callback, error) =>
      callback({ objectType })
    );
    const result = await api.del('someType', {});
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('del should return error', async () => {
    sfNetAPI.del.mockImplementation((objectType, id, callback, error) =>
      error('Error')
    );
    try {
      await api.del('someType');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('apexRest should return value', async () => {
    sfNetAPI.apexRest.mockImplementation(
      (method, endPoint, namespace, params, callback, error) =>
        callback({ method })
    );
    const result = await api.apexRest(
      'someMethod',
      'someEndPoint',
      'namespace',
      {}
    );
    expect(result).toStrictEqual([{ method: 'someMethod' }]);
  });

  it('apexRest should return error', async () => {
    sfNetAPI.apexRest.mockImplementation(
      (method, endPoint, namespace, params, callback, error) => error('Error')
    );
    try {
      await api.apexRest('someMethod');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });
});
