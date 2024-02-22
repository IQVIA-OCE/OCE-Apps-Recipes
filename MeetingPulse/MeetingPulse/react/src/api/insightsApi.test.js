import api from '../utils/api';
import { fetchInsights } from './insightsApi';

jest.mock('../utils/api', () => ({
  queryOffline: jest.fn(),
}));

describe('insightsApi', () => {
  it('fetchInsights', async () => {
    await fetchInsights([1]);
    expect(api.queryOffline).toHaveBeenCalled();
  });
});
