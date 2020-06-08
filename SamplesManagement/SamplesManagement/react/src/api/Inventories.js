import api from '../utils/api';

export const fetchInventories = () =>
  api.query(
    'SELECT Id, (select Id from OCE__SampleInventoryDetails__r) OCE__AssignedToUser__c, OCE__Auditor__c, OCE__Comments__c, CreatedById, CreatedDate, OCE__IntegrationID__c, OCE__InventoryDateTime__c, Name, RecordTypeId, RecordType.DeveloperName, OCE__Status__c,OCE__Reason__c FROM OCE__SampleInventory__c ORDER BY LastModifiedDate DESC'
  );

export const fetchListId = () =>
  api.query(
    `SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = 'OCE__SampleInventory__c' AND DeveloperName = 'All'`
  );

export const fetchInventoryTypes = () =>
  api.query(
    `select Id, Name, DeveloperName, IsPersonType, Description, IsActive FROM RecordType WHERE SobjectType = 'OCE__SampleInventory__c' AND IsActive = true`
  );
