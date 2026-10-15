import api from './api';
import { databaseManager, sfNetAPI } from '@oce-apps/oce-apps-bridges';

describe('api utility', () => {
  beforeAll(() => {
    sfNetAPI.query = jest.fn();
  });

  it('query should return value', async () => {
    databaseManager.fetch.mockResolvedValue({ records: [1, 2], totalSize: 2 });
    const result = await api.query('');
    expect(result).toStrictEqual([[1, 2], { totalSize: 2 }]);
  });
});
