import api from '../utils/api';
import {
  fetchActiveLotsProducts,
  fetchConfigs,
  fetchInventories,
  fetchInventoryDetail,
  fetchInventoryTypes,
  fetchLastSubmittedInventory,
  fetchListId,
  fetchTransactionDetails,
  saveInventory,
} from './Inventories';

describe('Inventories', () => {
  it('fetchLocationsList', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchInventories();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchListId', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchListId();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchInventoryTypes', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchInventoryTypes();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchConfigs', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchConfigs();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchActiveLotsProducts', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchActiveLotsProducts();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchLastSubmittedInventory', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchLastSubmittedInventory();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchInventoryDetail', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchInventoryDetail();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchTransactionDetails', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchTransactionDetails();
    expect(spy).toHaveBeenCalled();
  });

  it('saveInventory', () => {
    const spy = jest.spyOn(api, 'apexRest').mockImplementation();
    saveInventory({ products: [] });
    expect(spy).toHaveBeenCalled();
  });
});
