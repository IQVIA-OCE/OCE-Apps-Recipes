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

jest.unmock('./StorageLocation');

const query = jest.spyOn(api, 'query');
const update = jest.spyOn(api, 'update');

describe('StorageLocation', () => {
  beforeEach(() => {
    query.mockClear();
    update.mockClear();
  });

  it('fetchLocationsList', () => {
    //without userId
    fetchLocationsList();
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = 'undefined' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC");

    //with userId
    fetchLocationsList("0050k000004CineAAC");
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '0050k000004CineAAC' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC");
  });

  it('fetchDefaultLocation', () => {
    //without userId
    fetchDefaultLocation();
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = 'undefined' AND OCE__IsDefaultStorageLocation__c = true ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC");

    //with userId
    fetchDefaultLocation("0050k000004CineAAC");
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '0050k000004CineAAC' AND OCE__IsDefaultStorageLocation__c = true ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC");
  });

  it('fetchUsers', () => {
    // without ids
    const response = fetchUsers();
    expect(response).resolves.toEqual([]);
    expect(query).not.toHaveBeenCalled();

    // with ids
    fetchUsers(["0050k000004CineAAC", "0050k000004CineAAD", "0050k000004CineAAE"]);
    expect(query).toHaveBeenCalledWith("SELECT ID, Name from USER Where ID IN ('0050k000004CineAAC','0050k000004CineAAD','0050k000004CineAAE')");
  });

  it('fetchLocationById', () => {
    // without ids
    const response = fetchLocationById();
    expect(response).resolves.toEqual([]);
    expect(query).not.toHaveBeenCalled();

    // with ids
    fetchLocationById("0050k000004CineAAC");
    expect(query).toHaveBeenCalledWith("SELECT Id, Name, OCE__AddressLine2__c, OCE__City__c, OCE__Country__c, OCE__State__c, OCE__IsDefaultStorageLocation__c, OCE__ZipCode__c, format(CreatedDate), format(LastModifiedDate), CreatedById, LastModifiedById FROM OCE__SamplesManagementAddress__c WHERE Id = '0050k000004CineAAC'");
  });

  it('saveLocations', () => {
    const create = jest.spyOn(api, 'create').mockImplementation();
    const item = {
      address1: "Address_1",
      address2: "Address_2",
      city: "City",
      country: {
        id: 1
      },
      state: {
        id: 1
      },
      default: "text",
      zip: "12345",
    };
    const fields = {
      Name: item.address1,
      OCE__AddressLine2__c: item.address2,
      OCE__City__c: item.city,
      OCE__Country__c: item.country.id,
      OCE__State__c: item.state.id,
      OCE__IsDefaultStorageLocation__c: item.default,
      OCE__ZipCode__c: item.zip,
    };
    const fieldsEmpty = {
      Name: undefined,
      OCE__AddressLine2__c: undefined,
      OCE__City__c: undefined,
      OCE__Country__c: '',
      OCE__State__c: '',
      OCE__IsDefaultStorageLocation__c: undefined,
      OCE__ZipCode__c: undefined,
    };

    // without params - create
    saveLocations();
    expect(create).toHaveBeenCalledWith("OCE__SamplesManagementAddress__c", fieldsEmpty);

    // without id - create
    saveLocations(item);
    expect(create).toHaveBeenCalledWith("OCE__SamplesManagementAddress__c", fields);

    // with id - update
    saveLocations(item, "0050k000004CineAAC");
    expect(update).toHaveBeenCalledWith("OCE__SamplesManagementAddress__c", "0050k000004CineAAC", fields);
  });

  it('fetchCountries', () => {
    const spy = jest.spyOn(api, 'describe').mockImplementation();
    fetchCountries();
    expect(spy).toHaveBeenCalledWith("OCE__SamplesManagementAddress__c");
  });

  it('updateDefaultLocation', () => {
    // without id
    updateDefaultLocation();
    expect(update).toHaveBeenCalledWith("OCE__SamplesManagementAddress__c", undefined, { "OCE__IsDefaultStorageLocation__c": true, });

    // with id
    updateDefaultLocation("0050k000004CineAAD");
    expect(update).toHaveBeenCalledWith("OCE__SamplesManagementAddress__c", "0050k000004CineAAD", { "OCE__IsDefaultStorageLocation__c": true, });
  });

  it('deleteLocation', () => {
    const del = jest.spyOn(api, 'del');

    // without id
    deleteLocation();
    expect(del).toHaveBeenCalledWith("OCE__SamplesManagementAddress__c", undefined);

    // with id
    deleteLocation("0050k000004CineAAD");
    expect(del).toHaveBeenCalledWith("OCE__SamplesManagementAddress__c", "0050k000004CineAAD");
  });
});
