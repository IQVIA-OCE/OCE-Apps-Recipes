import api from '../utils/api';

export const fetchInventories = () =>
  api.query(
    'SELECT Id, (select Id from OCE__SampleInventoryDetails__r) OCE__AssignedToUser__c, OCE__Auditor__c, OCE__Comments__c, CreatedById, CreatedDate, OCE__IntegrationID__c, format(OCE__InventoryDateTime__c), Name, RecordTypeId, RecordType.DeveloperName, OCE__Status__c,OCE__Reason__c FROM OCE__SampleInventory__c ORDER BY LastModifiedDate DESC'
  );

export const fetchListId = () =>
  api.query(
    `SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = 'OCE__SampleInventory__c' AND DeveloperName = 'All'`
  );

export const fetchInventoryTypes = () =>
  api.query(
    `select Id, Name, DeveloperName, IsPersonType, Description, IsActive FROM RecordType WHERE SobjectType = 'OCE__SampleInventory__c' AND IsActive = true`
  );

export const fetchConfigs = (userId, profileId, orgId) =>
  api.query(
    `SELECT Id, SetupOwnerId, OCE__SIShowSystemCalculatedFields__c,OCE__SIShowSystemCount__c, OCE__STFinalStatus__c, OCE__SIShowLoggedInUserRecords__c, OCE__SIHistoryListHidden__c FROM OCE__SamplesManagemenConfig__c WHERE SetupOwnerId = '${orgId}' OR SetupOwnerId = '${userId}' OR SetupOwnerId = '${profileId}'`
  );

export const fetchActiveLotsProducts = () =>
  api.query(
    `SELECT Id, OCE__IsActive__c, Name, OCE__Product__c, OCE__Product__r.Name, OCE__Product__r.OCE__SKU__c FROM OCE__Lot__c WHERE OCE__IsActive__c = true AND OCE__Product__r.RecordType.DeveloperName = 'Sample' AND OCE__Product__r.OCE__PhysicalSampleDrop__c = true ORDER BY OCE__Product__r.OCE__ParentProduct__r.Name, OCE__Product__r.Name, Name`
  );

export const fetchLastSubmittedInventory = (userId, config) => {
  const obj = config ? 'OCE__AssignedToUser__c' : 'OwnerId';
  return api.query(
    `SELECT Id, Name, format(CreatedDate), OCE__Reason__c, OCE__Status__c, OCE__Comments__c, RecordTypeId, OCE__Auditor__c FROM  OCE__SampleInventory__c WHERE ${obj} = '${userId}' AND OCE__Status__c = 'Submitted' ORDER BY LastModifiedDate`
  );
};

export const fetchInventoryById = inventoryId =>
  api.query(
    `SELECT Id, Name, format(CreatedDate), OCE__Reason__c, OCE__Status__c, OCE__Comments__c, RecordTypeId, OCE__Auditor__c FROM OCE__SampleInventory__c WHERE Id = '${inventoryId}'`
  );

export const fetchInventoryDetail = (inventoryId, getZeroDetails) => {
  let zeroDetails = '';
  if (getZeroDetails) {
    zeroDetails = 'AND OCE__PhysicalCount__c > 0';
  }
  return api.query(
    `SELECT CreatedDate, Id, IsDeleted, OCE__IsDiscrepancy__c, OCE__Lot__c, OCE__Lot__r.Name, Name, OCE__PhysicalCount__c, OCE__Product__c, OCE__Product__r.Name, OCE__SampleInventory__c, OCE__Status__c, OCE__SystemCount__c, OCE__DiscrepancyReason__c FROM OCE__SampleInventoryDetail__c WHERE OCE__SampleInventory__c = '${inventoryId}' ${zeroDetails} ORDER BY OCE__Product__r.Name ASC`
  );
};

export const fetchTransactionDetails = (
  inventoryId = null,
  user = '',
  status = ''
) => {
  if (inventoryId) inventoryId = `'${inventoryId}'`;
  if (status)
    status = `AND OCE__SampleTransaction__r.OCE__Status__c = '${status}'`;
  if (user)
    user = `AND OCE__SampleTransaction__r.OCE__TransactionRep__c = '${user}'`;
  return api.query(
    `SELECT Id, OCE__SampleTransaction__c, OCE__SampleTransaction__r.RecordType.Name, OCE__Product__r.Name, OCE__Comments__c, OCE__LotNumber__r.Name, OCE__SampleTransaction__r.RecordType.DeveloperName, OCE__Quantity__c, OCE__ShippedQuantity__c, OCE__Product__c, OCE__LotNumber__c, CreatedDate, OCE__SampleTransaction__r.OCE__TransactionDateTime__c FROM OCE__SampleTransactionDetail__c WHERE OCE__SampleInventory__c = ${inventoryId} ${status} ${user} AND OCE__SampleTransaction__r.OCE__Duplicate__c = false AND  OCE__SampleTransaction__r.OCE__ReturnToSender__c = false ORDER BY OCE__Product__c ASC NULLS FIRST,  OCE__LotNumber__c ASC NULLS FIRST`
  );
};

export const saveInventory = (data, transactions = []) => {
  const deletedProducts = data.deletedProducts ? data.deletedProducts : [];
  const payload = {
    record: {
      OCE__Status__c: data.status,
      OCE__InventoryDateTime__c: data.dateTime,
      OCE__AssignedToUser__c: data.userId,
      OCE__AssignedToUser__r: { Id: data.userId },
      RecordTypeId: data.recordTypeId,
      sobjectType: 'OCE__SampleInventory__c',
      OCE__Comments__c: data.comments,
      OCE__Reason__c: data.reason,
      OCE__Auditor__c: data.auditor,
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

  return api.apexRest('POST', 'sampleinventorysave', 'OCE', payload);
};

export const fetchAuditors = username =>
  api.query(
    `SELECT Id, Name FROM User WHERE Name LIKE '%${username}%' ORDER BY Name ASC LIMIT 10`
  );

export const fetchAuditorById = id =>
  api.query(`SELECT Id, Name FROM User WHERE Id = '${id}'`);

export const deleteInventory = inventoryId =>
  api.del('OCE__SampleInventory__c', inventoryId);
