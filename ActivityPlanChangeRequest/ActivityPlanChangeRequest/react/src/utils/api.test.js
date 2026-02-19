import api from './api';
import { sfNetAPI } from '@oce-apps/oce-apps-bridges';

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
    sfNetAPI.query.mockResolvedValueOnce({ records: [1, 2], page: 1 });
    const result = await api.query('');
    expect(result).toStrictEqual([[1, 2], { page: 1 }]);
  });

  it('query should return empty value', async () => {
    sfNetAPI.query.mockResolvedValueOnce(null);
    const result = await api.query();
    expect(result).toStrictEqual(null);
  });

  it('query should return error', async () => {
    sfNetAPI.query.mockRejectedValueOnce('Error');
    try {
      await api.query('');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('describe should return value', async () => {
    sfNetAPI.describe.mockResolvedValueOnce({ objectType: 'someType' });
    const result = await api.describe('someType');
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('describe should return error', async () => {
    sfNetAPI.describe.mockRejectedValueOnce('Error');
    try {
      await api.describe();
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('create should return value', async () => {
    sfNetAPI.create.mockResolvedValueOnce({ objectType: 'someType' });
    const result = await api.create('someType', {});
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('create should return error', async () => {
    sfNetAPI.create.mockRejectedValueOnce('Error');
    try {
      await api.create();
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('update should return value', async () => {
    sfNetAPI.update.mockResolvedValueOnce({ objectType: 'someType' });
    const result = await api.update('someType', '1', {});
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('update should return error', async () => {
    sfNetAPI.update.mockRejectedValueOnce('Error');
    try {
      await api.update('someType');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('del should return value', async () => {
    sfNetAPI.del.mockResolvedValueOnce({ objectType: 'someType' });
    const result = await api.del('someType', '1', {});
    expect(result).toStrictEqual([{ objectType: 'someType' }]);
  });

  it('del should return error', async () => {
    sfNetAPI.del.mockRejectedValueOnce('Error');
    try {
      await api.del('someType');
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });

  it('apexRest should return value', async () => {
    sfNetAPI.apexRest.mockResolvedValueOnce({
      method: 'POST',
      endPoint: '/someUrl',
      namespace: 'OCE',
      params: {}
    });
    const result = await api.apexRest('POST', '/someUrl', 'OCE', {});
    expect(result).toStrictEqual([{
      method: 'POST',
      endPoint: '/someUrl',
      namespace: 'OCE',
      params: {}
    }]);
  });

  it('apexRest should return error', async () => {
    sfNetAPI.apexRest.mockRejectedValueOnce('Error');
    try {
      await api.apexRest('POST', '/someUrl', 'OCE', {});
    } catch (e) {
      expect(e).toStrictEqual('Error');
    }
  });
});
