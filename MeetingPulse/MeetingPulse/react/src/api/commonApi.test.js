import api from '../utils/api';
import { fetchAllAccounts } from './commonApi';

jest.mock('../utils/api', () => ({
  queryOffline: jest.fn(),
}));

describe('commonApi', () => {
  it('fetchAllAccounts', async () => {
    await fetchAllAccounts();
    expect(api.queryOffline).toHaveBeenCalled();
  });
});
