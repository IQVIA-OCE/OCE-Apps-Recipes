import api from './api';
import { sfNetAPI } from '@oce-apps/oce-apps-bridges';

describe('api utility', () => {
  beforeAll(() => {
    sfNetAPI.query = jest.fn();
    sfNetAPI.describe = jest.fn();
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
});
