import api from '../utils/api';

export const fetchLocationsList = userId =>
  api.query(
    `SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '${userId}' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC`
  );

export const fetchDefaultLocation = userId =>
  api.query(
    `SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '${userId}' AND OCE__IsDefaultStorageLocation__c = true ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC`
  );

export const fetchUsers = (ids = []) =>
  ids.length
    ? api.query(`SELECT ID, Name from USER Where ID IN ('${ids.join("','")}')`)
    : Promise.resolve([]);

export const fetchLocationById = id =>
  id
    ? api.query(
        `SELECT Id, Name, OCE__AddressLine2__c, OCE__City__c, OCE__Country__c, OCE__State__c, OCE__IsDefaultStorageLocation__c, OCE__ZipCode__c, format(CreatedDate), format(LastModifiedDate), CreatedById, LastModifiedById FROM OCE__SamplesManagementAddress__c WHERE Id = '${id}'`
      )
    : Promise.resolve([]);

export const saveLocations = (values = {}, id = '') => {
  const fields = {
    Name: values.address1,
    OCE__AddressLine2__c: values.address2,
    OCE__City__c: values.city,
    OCE__Country__c: values.country ? values.country.id : '',
    OCE__State__c: values.state ? values.state.id : '',
    OCE__IsDefaultStorageLocation__c: values.default,
    OCE__ZipCode__c: values.zip,
  };
  if (id) {
    return api.update('OCE__SamplesManagementAddress__c', id, fields);
  }
  return api.create('OCE__SamplesManagementAddress__c', fields);
};

export const fetchCountries = () =>
  api.describe('OCE__SamplesManagementAddress__c');

export const updateDefaultLocation = id =>
  api.update('OCE__SamplesManagementAddress__c', id, {
    OCE__IsDefaultStorageLocation__c: true,
  });

export const deleteLocation = id =>
  api.del('OCE__SamplesManagementAddress__c', id);
