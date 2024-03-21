import api from '../utils/api';
import { NAMESPACE } from '../constants/constants';

export const fetchInventories = () =>
  api.query(
    `SELECT Id, (select Id from ${NAMESPACE}SampleInventoryDetails__r) ${NAMESPACE}AssignedToUser__c, ${NAMESPACE}Auditor__c, ${NAMESPACE}Comments__c, CreatedById, CreatedDate, ${NAMESPACE}IntegrationID__c, format(${NAMESPACE}InventoryDateTime__c), Name, RecordTypeId, RecordType.DeveloperName, ${NAMESPACE}Status__c,${NAMESPACE}Reason__c FROM ${NAMESPACE}SampleInventory__c ORDER BY LastModifiedDate DESC`
  );

export const fetchListId = () =>
  api.query(
    `SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = '${NAMESPACE}SampleInventory__c' AND DeveloperName = 'All'`
  );

export const fetchInventoryTypes = () =>
  api.query(
    `select Id, Name, DeveloperName, IsPersonType, Description, IsActive FROM RecordType WHERE SobjectType = '${NAMESPACE}SampleInventory__c' AND IsActive = true`
  );

export const fetchActiveLotsProducts = () =>
  api.query(
    `SELECT Id, ${NAMESPACE}IsActive__c, Name, ${NAMESPACE}Product__c, ${NAMESPACE}Product__r.Name, ${NAMESPACE}Product__r.${NAMESPACE}SKU__c FROM ${NAMESPACE}Lot__c WHERE ${NAMESPACE}IsActive__c = true AND ${NAMESPACE}Product__r.RecordType.DeveloperName = 'Sample' AND ${NAMESPACE}Product__r.${NAMESPACE}PhysicalSampleDrop__c = true ORDER BY ${NAMESPACE}Product__r.${NAMESPACE}ParentProduct__r.Name, ${NAMESPACE}Product__r.Name, Name`
  );

export const fetchLastSubmittedInventory = (userId, config) => {
  const obj = config ? `${NAMESPACE}AssignedToUser__c` : 'OwnerId';
  return api.query(
    `SELECT Id, Name, format(CreatedDate), ${NAMESPACE}Reason__c, ${NAMESPACE}Status__c, ${NAMESPACE}Comments__c, RecordTypeId, ${NAMESPACE}Auditor__c FROM  ${NAMESPACE}SampleInventory__c WHERE ${obj} = '${userId}' AND ${NAMESPACE}Status__c = 'Submitted' ORDER BY LastModifiedDate`
  );
};

export const fetchInventoryById = inventoryId =>
  api.query(
    `SELECT Id, Name, format(CreatedDate), ${NAMESPACE}Reason__c, ${NAMESPACE}Status__c, ${NAMESPACE}Comments__c, RecordTypeId, ${NAMESPACE}Auditor__c FROM ${NAMESPACE}SampleInventory__c WHERE Id = '${inventoryId}'`
  );

export const fetchInventoryDetail = (inventoryId, getZeroDetails) => {
  let zeroDetails = '';
  if (getZeroDetails) {
    zeroDetails = `AND ${NAMESPACE}PhysicalCount__c > 0`;
  }
  return api.query(
    `SELECT CreatedDate, Id, IsDeleted, ${NAMESPACE}IsDiscrepancy__c, ${NAMESPACE}Lot__c, ${NAMESPACE}Lot__r.Name, Name, ${NAMESPACE}PhysicalCount__c, ${NAMESPACE}Product__c, ${NAMESPACE}Product__r.Name, ${NAMESPACE}SampleInventory__c, ${NAMESPACE}Status__c, ${NAMESPACE}SystemCount__c, ${NAMESPACE}DiscrepancyReason__c FROM ${NAMESPACE}SampleInventoryDetail__c WHERE ${NAMESPACE}SampleInventory__c = '${inventoryId}' ${zeroDetails} ORDER BY ${NAMESPACE}Product__r.Name ASC`
  );
};

export const fetchTransactionDetails = (
  inventoryId = null,
  user = '',
  status = ''
) => {
  if (inventoryId) inventoryId = `'${inventoryId}'`;
  if (status)
    status = `AND ${NAMESPACE}SampleTransaction__r.${NAMESPACE}Status__c = '${status}'`;
  if (user)
    user = `AND ${NAMESPACE}SampleTransaction__r.${NAMESPACE}TransactionRep__c = '${user}'`;
  return api.query(
    `SELECT Id, ${NAMESPACE}SampleTransaction__c, ${NAMESPACE}SampleTransaction__r.RecordType.Name, ${NAMESPACE}Product__r.Name, ${NAMESPACE}Comments__c, ${NAMESPACE}LotNumber__r.Name, ${NAMESPACE}SampleTransaction__r.RecordType.DeveloperName, ${NAMESPACE}Quantity__c, ${NAMESPACE}ShippedQuantity__c, ${NAMESPACE}Product__c, ${NAMESPACE}LotNumber__c, CreatedDate, ${NAMESPACE}SampleTransaction__r.${NAMESPACE}TransactionDateTime__c FROM ${NAMESPACE}SampleTransactionDetail__c WHERE ${NAMESPACE}SampleInventory__c = ${inventoryId} ${status} ${user} AND ${NAMESPACE}SampleTransaction__r.${NAMESPACE}Duplicate__c = false AND  ${NAMESPACE}SampleTransaction__r.${NAMESPACE}ReturnToSender__c = false ORDER BY ${NAMESPACE}Product__c ASC NULLS FIRST,  ${NAMESPACE}LotNumber__c ASC NULLS FIRST`
  );
};

export const saveInventory = (data, transactions = []) => {
  const deletedProducts = data.deletedProducts ? data.deletedProducts : [];
  const payload = {
    record: {
      [`${NAMESPACE}Status__c`]: data.status,
      [`${NAMESPACE}InventoryDateTime__c`]: data.dateTime,
      [`${NAMESPACE}AssignedToUser__c`]: data.userId,
      [`${NAMESPACE}AssignedToUser__r`]: { Id: data.userId },
      RecordTypeId: data.recordTypeId,
      sobjectType: `${NAMESPACE}SampleInventory__c`,
      [`${NAMESPACE}Comments__c`]: data.comments,
      [`${NAMESPACE}Reason__c`]: data.reason,
      [`${NAMESPACE}Auditor__c`]: data.auditor,
    },
    detailRecords: [...data.products, ...deletedProducts],
    transactions,
  };

  if (data.id) {
    payload.record.Id = data.id;
  }

  payload.record = JSON.stringify(payload.record);
  payload.detailRecords = JSON.stringify(payload.detailRecords);
  payload.transactions = JSON.stringify(payload.transactions);
  const namespace = NAMESPACE ? NAMESPACE.replace('__','') : '';

  return api.apexRest('POST', 'sampleinventorysave', namespace, payload);
};

export const fetchAuditors = username =>
  api.query(
    `SELECT Id, Name FROM User WHERE Name LIKE '%${username}%' ORDER BY Name ASC LIMIT 10`
  );

export const fetchAuditorById = id =>
  api.query(`SELECT Id, Name FROM User WHERE Id = '${id}'`);

export const deleteInventory = inventoryId =>
  api.del(`${NAMESPACE}SampleInventory__c`, inventoryId);
