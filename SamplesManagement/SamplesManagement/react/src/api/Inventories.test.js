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
  deleteInventory,
} from './Inventories';

jest.unmock('./Inventories');

const spy = jest.spyOn(api, 'query').mockImplementation();

describe('Inventories', () => {
  beforeEach(() => {
    spy.mockClear();
  });

  it('fetchLocationsList', () => {
    fetchInventories();
    expect(spy).toHaveBeenCalledWith('SELECT Id, (select Id from OCE__SampleInventoryDetails__r) OCE__AssignedToUser__c, OCE__Auditor__c, OCE__Comments__c, CreatedById, CreatedDate, OCE__IntegrationID__c, format(OCE__InventoryDateTime__c), Name, RecordTypeId, RecordType.DeveloperName, OCE__Status__c,OCE__Reason__c FROM OCE__SampleInventory__c ORDER BY LastModifiedDate DESC');
  });

  it('fetchListId', () => {
    fetchListId();
    expect(spy).toHaveBeenCalledWith('SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = \'OCE__SampleInventory__c\' AND DeveloperName = \'All\'');
  });

  it('fetchInventoryTypes', () => {
    fetchInventoryTypes();
    expect(spy).toHaveBeenCalledWith('select Id, Name, DeveloperName, IsPersonType, Description, IsActive FROM RecordType WHERE SobjectType = \'OCE__SampleInventory__c\' AND IsActive = true');
  });

  it('fetchActiveLotsProducts', () => {
    fetchActiveLotsProducts();
    expect(spy).toHaveBeenCalledWith('SELECT Id, OCE__IsActive__c, Name, OCE__Product__c, OCE__Product__r.Name, OCE__Product__r.OCE__SKU__c FROM OCE__Lot__c WHERE OCE__IsActive__c = true AND OCE__Product__r.RecordType.DeveloperName = \'Sample\' AND OCE__Product__r.OCE__PhysicalSampleDrop__c = true ORDER BY OCE__Product__r.OCE__ParentProduct__r.Name, OCE__Product__r.Name, Name');
  });

  it('fetchLastSubmittedInventory with "config"', () => {
    fetchLastSubmittedInventory('0050k000004CineAAC', {});
    expect(spy).toHaveBeenCalledWith('SELECT Id, Name, format(CreatedDate), OCE__Reason__c, OCE__Status__c, OCE__Comments__c, RecordTypeId, OCE__Auditor__c FROM  OCE__SampleInventory__c WHERE OCE__AssignedToUser__c = \'0050k000004CineAAC\' AND OCE__Status__c = \'Submitted\' ORDER BY LastModifiedDate');
  });

  it('fetchLastSubmittedInventory without "config"', () => {
    fetchLastSubmittedInventory('0050k000004CineAAC');
    expect(spy).toHaveBeenCalledWith('SELECT Id, Name, format(CreatedDate), OCE__Reason__c, OCE__Status__c, OCE__Comments__c, RecordTypeId, OCE__Auditor__c FROM  OCE__SampleInventory__c WHERE OwnerId = \'0050k000004CineAAC\' AND OCE__Status__c = \'Submitted\' ORDER BY LastModifiedDate');
  });

  it('fetchInventoryDetail', () => {
    fetchInventoryDetail('a5dF7000000piqPIAQ');
    expect(spy).toHaveBeenCalledWith('SELECT CreatedDate, Id, IsDeleted, OCE__IsDiscrepancy__c, OCE__Lot__c, OCE__Lot__r.Name, Name, OCE__PhysicalCount__c, OCE__Product__c, OCE__Product__r.Name, OCE__SampleInventory__c, OCE__Status__c, OCE__SystemCount__c, OCE__DiscrepancyReason__c FROM OCE__SampleInventoryDetail__c WHERE OCE__SampleInventory__c = \'a5dF7000000piqPIAQ\'  ORDER BY OCE__Product__r.Name ASC');
  });

  it('fetchInventoryDetail with args', () => {
    fetchInventoryDetail('a5dF7000000piqPIAQ', true);
    expect(spy).toHaveBeenCalledWith('SELECT CreatedDate, Id, IsDeleted, OCE__IsDiscrepancy__c, OCE__Lot__c, OCE__Lot__r.Name, Name, OCE__PhysicalCount__c, OCE__Product__c, OCE__Product__r.Name, OCE__SampleInventory__c, OCE__Status__c, OCE__SystemCount__c, OCE__DiscrepancyReason__c FROM OCE__SampleInventoryDetail__c WHERE OCE__SampleInventory__c = \'a5dF7000000piqPIAQ\' AND OCE__PhysicalCount__c > 0 ORDER BY OCE__Product__r.Name ASC');
  });

  it('fetchTransactionDetails', () => {
    fetchTransactionDetails();
    expect(spy).toHaveBeenCalledWith('SELECT Id, OCE__SampleTransaction__c, OCE__SampleTransaction__r.RecordType.Name, OCE__Product__r.Name, OCE__Comments__c, OCE__LotNumber__r.Name, OCE__SampleTransaction__r.RecordType.DeveloperName, OCE__Quantity__c, OCE__ShippedQuantity__c, OCE__Product__c, OCE__LotNumber__c, CreatedDate, OCE__SampleTransaction__r.OCE__TransactionDateTime__c FROM OCE__SampleTransactionDetail__c WHERE OCE__SampleInventory__c = null   AND OCE__SampleTransaction__r.OCE__Duplicate__c = false AND  OCE__SampleTransaction__r.OCE__ReturnToSender__c = false ORDER BY OCE__Product__c ASC NULLS FIRST,  OCE__LotNumber__c ASC NULLS FIRST');
  });

  it('fetchTransactionDetails with args', () => {
    fetchTransactionDetails('a5dF7000000piqPIAQ', '0050k000004CineAAC', 'Submitted');
    expect(spy).toHaveBeenCalledWith('SELECT Id, OCE__SampleTransaction__c, OCE__SampleTransaction__r.RecordType.Name, OCE__Product__r.Name, OCE__Comments__c, OCE__LotNumber__r.Name, OCE__SampleTransaction__r.RecordType.DeveloperName, OCE__Quantity__c, OCE__ShippedQuantity__c, OCE__Product__c, OCE__LotNumber__c, CreatedDate, OCE__SampleTransaction__r.OCE__TransactionDateTime__c FROM OCE__SampleTransactionDetail__c WHERE OCE__SampleInventory__c = \'a5dF7000000piqPIAQ\' AND OCE__SampleTransaction__r.OCE__Status__c = \'Submitted\' AND OCE__SampleTransaction__r.OCE__TransactionRep__c = \'0050k000004CineAAC\' AND OCE__SampleTransaction__r.OCE__Duplicate__c = false AND  OCE__SampleTransaction__r.OCE__ReturnToSender__c = false ORDER BY OCE__Product__c ASC NULLS FIRST,  OCE__LotNumber__c ASC NULLS FIRST');
  });

  it('fetchInventoryById', () => {
    fetchInventoryById('a5dF7000000piqPIAQ');
    expect(spy).toHaveBeenCalledWith('SELECT Id, Name, format(CreatedDate), OCE__Reason__c, OCE__Status__c, OCE__Comments__c, RecordTypeId, OCE__Auditor__c FROM OCE__SampleInventory__c WHERE Id = \'a5dF7000000piqPIAQ\'');
  });

  it('fetchAuditors', () => {
    fetchAuditors('Sales');
    expect(spy).toHaveBeenCalledWith('SELECT Id, Name FROM User WHERE Name LIKE \'%Sales%\' ORDER BY Name ASC LIMIT 10');
  });

  it('fetchAuditorById', () => {
    fetchAuditorById('0050k000004CineABC');
    expect(spy).toHaveBeenCalledWith('SELECT Id, Name FROM User WHERE Id = \'0050k000004CineABC\'');
  });

  it('saveInventory', () => {
    const spy = jest.spyOn(api, 'apexRest').mockImplementation();
    saveInventory({ products: [] });
    expect(spy).toHaveBeenCalledWith('POST', 'sampleinventorysave', 'OCE', {
        'record':
          '{"OCE__AssignedToUser__r":{},"sobjectType":"OCE__SampleInventory__c"}',
        'detailRecords': '[]',
        'transactions': '[]',
      },
    );
  });

  it('deleteInventory', () => {
    const spy = jest.spyOn(api, 'del').mockImplementation();
    deleteInventory('a5dF7000000piqPIAQ');
    expect(spy).toHaveBeenCalledWith('OCE__SampleInventory__c', 'a5dF7000000piqPIAQ');
  });
});
