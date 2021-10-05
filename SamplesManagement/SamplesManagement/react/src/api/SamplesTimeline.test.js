import api from '../utils/api';
import {
  fetchOrdersData,
  fetchOrdersListId,
  fetchTransactionsData,
  fetchTransactionsListId,
} from './SamplesTimeline';

describe('SamplesTimeline', () => {
  it('fetchTransactionsData', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchTransactionsData();
    expect(spy).toHaveBeenCalled();
  });
  it('fetchOrdersData', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchOrdersData();
    expect(spy).toHaveBeenCalled();
  });
  it('fetchTransactionsListId', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchTransactionsListId();
    expect(spy).toHaveBeenCalled();
  });
  it('fetchOrdersListId', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchOrdersListId();
    expect(spy).toHaveBeenCalled();
  });
});
