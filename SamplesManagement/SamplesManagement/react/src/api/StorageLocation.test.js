import {
  deleteLocation,
  fetchCountries,
  fetchDefaultLocation,
  fetchLocationById,
  fetchLocationsList,
  fetchUsers,
  saveLocations,
  updateDefaultLocation,
} from './StorageLocation';
import api from '../utils/api';

describe('StorageLocation', () => {
  it('fetchLocationsList', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchLocationsList();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchDefaultLocation', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchDefaultLocation();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchUsers', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchUsers([1]);
    expect(spy).toHaveBeenCalled();
  });

  it('fetchUsers empty', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchUsers();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchLocationById', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchLocationById(1);
    expect(spy).toHaveBeenCalled();
  });

  it('fetchLocationById empty', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchLocationById();
    expect(spy).toHaveBeenCalled();
  });

  it('saveLocations create', () => {
    const spy = jest.spyOn(api, 'create').mockImplementation();
    saveLocations();
    expect(spy).toHaveBeenCalled();
  });

  it('saveLocations update', () => {
    const spy = jest.spyOn(api, 'update').mockImplementation();
    saveLocations({ country: {}, state: {} }, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('fetchCountries', () => {
    const spy = jest.spyOn(api, 'describe').mockImplementation();
    fetchCountries();
    expect(spy).toHaveBeenCalled();
  });

  it('updateDefaultLocation', () => {
    const spy = jest.spyOn(api, 'update').mockImplementation();
    updateDefaultLocation(1);
    expect(spy).toHaveBeenCalled();
  });

  it('deleteLocation', () => {
    const spy = jest.spyOn(api, 'del').mockImplementation();
    deleteLocation(1);
    expect(spy).toHaveBeenCalled();
  });
});
