import api from '../utils/api';
import {
  fetchActiveLotsProducts,
  fetchInventories,
  fetchInventoryDetail,
  fetchInventoryTypes,
  fetchLastSubmittedInventory,
  fetchListId,
  fetchTransactionDetails,
  saveInventory,
  fetchInventoryById,
  fetchAuditors,
  fetchAuditorById,
  deleteInventory
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

  it('fetchInventoryDetail with args', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchInventoryDetail('id', true);
    expect(spy).toHaveBeenCalled();
  });

  it('fetchTransactionDetails', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchTransactionDetails();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchTransactionDetails with args', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchTransactionDetails('id', 'status', 'userId');
    expect(spy).toHaveBeenCalled();
  });

  it('fetchInventoryById', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchInventoryById('id');
    expect(spy).toHaveBeenCalled();
  });

  it('fetchAuditors', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchAuditors('username');
    expect(spy).toHaveBeenCalled();
  });

  it('fetchAuditorById', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchAuditorById('id');
    expect(spy).toHaveBeenCalled();
  });

  it('saveInventory', () => {
    const spy = jest.spyOn(api, 'apexRest').mockImplementation();
    saveInventory({ products: [] });
    expect(spy).toHaveBeenCalled();
  });

  it('deleteInventory', () => {
    const spy = jest.spyOn(api, 'apexRest').mockImplementation();
    deleteInventory('id');
    expect(spy).toHaveBeenCalled();
  });
});
