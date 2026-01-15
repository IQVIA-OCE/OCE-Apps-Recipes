import api from '../utils/api';
import { NAMESPACE } from '../constants/constants';

export const fetchLocationsList = userId =>
  api.query(
    `SELECT Id, ${NAMESPACE}IsDefaultStorageLocation__c, ${NAMESPACE}FullAddress__c FROM ${NAMESPACE}SamplesManagementAddress__c WHERE OwnerId = '${userId}' ORDER BY ${NAMESPACE}IsDefaultStorageLocation__c DESC, Name ASC`
  );

export const fetchDefaultLocation = userId =>
  api.query(
    `SELECT Id, ${NAMESPACE}IsDefaultStorageLocation__c, ${NAMESPACE}FullAddress__c FROM ${NAMESPACE}SamplesManagementAddress__c WHERE OwnerId = '${userId}' AND ${NAMESPACE}IsDefaultStorageLocation__c = true ORDER BY ${NAMESPACE}IsDefaultStorageLocation__c DESC, Name ASC`
  );

export const fetchUsers = (ids = []) =>
  ids.length
    ? api.query(`SELECT ID, Name from USER Where ID IN ('${ids.join("','")}')`)
    : Promise.resolve([]);

export const fetchLocationById = id =>
  id
    ? api.query(
        `SELECT Id, Name, ${NAMESPACE}AddressLine2__c, ${NAMESPACE}City__c, ${NAMESPACE}Country__c, ${NAMESPACE}State__c, ${NAMESPACE}IsDefaultStorageLocation__c, ${NAMESPACE}ZipCode__c, format(CreatedDate), format(LastModifiedDate), CreatedById, LastModifiedById FROM ${NAMESPACE}SamplesManagementAddress__c WHERE Id = '${id}'`
      )
    : Promise.resolve([]);

export const saveLocations = (values = {}, id = '') => {
  const fields = {
    Name: values.address1,
    [`${NAMESPACE}AddressLine2__c`]: values.address2,
    [`${NAMESPACE}City__c`]: values.city,
    [`${NAMESPACE}Country__c`]: values.country ? values.country.id : '',
    [`${NAMESPACE}State__c`]: values.state ? values.state.id : '',
    [`${NAMESPACE}IsDefaultStorageLocation__c`]: values.default,
    [`${NAMESPACE}ZipCode__c`]: values.zip,
  };
  if (id) {
    return api.update(`${NAMESPACE}SamplesManagementAddress__c`, id, fields);
  }
  return api.create(`${NAMESPACE}SamplesManagementAddress__c`, fields);
};

export const fetchCountries = () =>
  api.describe(`${NAMESPACE}SamplesManagementAddress__c`);

export const updateDefaultLocation = id =>
  api.update(`${NAMESPACE}SamplesManagementAddress__c`, id, {
    [`${NAMESPACE}IsDefaultStorageLocation__c`]: true,
  });

export const deleteLocation = id =>
  api.del(`${NAMESPACE}SamplesManagementAddress__c`, id);
