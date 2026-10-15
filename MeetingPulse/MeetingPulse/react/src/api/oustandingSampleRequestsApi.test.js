import { fetchOutstandingSampleRequests } from './outstandingSampleRequestsApi';
import api from '../utils/api';

jest.mock('../utils/api', () => ({
  query: jest.fn(),
  queryOffline: jest.fn(),
}));

describe('fetchOutstandingSampleRequestsApi', () => {
  it('fetchOutstandingSampleRequests', async () => {
    await fetchOutstandingSampleRequests([], '123');
    expect(api.queryOffline).toHaveBeenCalled();
  });
});
