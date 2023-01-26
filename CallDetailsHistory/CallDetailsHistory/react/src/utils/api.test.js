import api from './api';
import { sfNetAPI } from 'oce-apps-bridges';

describe('api utility', () => {
  beforeAll(() => {
    sfNetAPI.query = jest.fn();
    sfNetAPI.describe = jest.fn();
    sfNetAPI.create = jest.fn();
    sfNetAPI.update = jest.fn();
    sfNetAPI.del = jest.fn();
    sfNetAPI.apexRest = jest.fn();
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
    sfNetAPI.del.mockImplementation(
      (objectType, id, callback, error) => callback({ objectType })
    );
    const result = await api.del('someType', {});
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('del should return error', async () => {
    sfNetAPI.del.mockImplementation(
      (objectType, id,callback, error) => error('Error')
    );
    try {
      await api.del('someType');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('apexRest should return value', async () => {
    sfNetAPI.apexRest.mockImplementation(
      (method, endPoint, namespace, params, callback, error) => callback({ records: [1, 2], page: 1 })
    );
    const result = await api.apexRest('GET', '/rest/data/records', 'OCE__', { org: 'sandbox' });
    expect(result).toStrictEqual([{ records: [1, 2], page: 1 }]);
  });

  it('apexRest should return error', async () => {
    sfNetAPI.apexRest.mockImplementation(
      (method, endPoint, namespace, params, callback, error) => error('Error')
    );
    try {
      await api.apexRest('GET', '/rest/data/records');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });
});
