import api from '../utils/api';
import {
  fetchInventories,
  fetchInventoryTypes,
  fetchListId,
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
});
