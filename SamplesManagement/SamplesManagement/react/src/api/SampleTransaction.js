import api from '../utils/api';
import moment from 'moment';
import {
  mapFormDetails,
  mapFormProducts,
} from '../screens/TransactionScreen/utils';

export const fetchTransactionRecordTypes = () => {
  return api.query(
    `SELECT Description, DeveloperName, Id, Name FROM RecordType WHERE SobjectType = 'OCE__SampleTransaction__c'`
  );
};

export const fetchSampleProducts = recordTypeDevName => {
  const today = moment().format('YYYY-MM-DD');

  if (recordTypeDevName == 'TransferOut' || recordTypeDevName == 'Adjustment') {
    return api.query(
      `SELECT Id, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name,\
              OCE__Lot__r.OCE__Product__r.OCE__SKU__c, OCE__LotExpirationDate__c, OCE__LotIsActive__c,\
              OCE__LotNumber__c, OCE__LotProductId__c, Name, OwnerId, SystemModstamp, OCE__User__c\
              FROM OCE__SampleLotAllocation__c WHERE OCE__IsActive__c = true AND OCE__Lot__r.OCE__product__r.RecordType.Name In ('Sample')\
              AND OCE__Lot__r.OCE__product__r.OCE__PhysicalSampleDrop__c = true\
              AND (OCE__Lot__r.OCE__Product__r.OCE__StartDate__c = null OR OCE__Lot__r.OCE__Product__r.OCE__StartDate__c <= ${today})\
              AND (OCE__Lot__r.OCE__Product__r.OCE__EndDate__c = null OR OCE__Lot__r.OCE__Product__r.OCE__EndDate__c >= ${today})\
              ORDER BY OCE__Lot__r.OCE__Product__r.Name, OCE__Lot__c`
    );
  } else if (recordTypeDevName == 'Return') {
    return api.query(
      `SELECT Id, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name, OCE__Lot__r.OCE__Product__r.OCE__SKU__c,\
          OCE__LotExpirationDate__c, OCE__LotIsActive__c, OCE__LotNumber__c,\
          OCE__LotProductId__c, Name, OwnerId, SystemModstamp, OCE__User__c FROM OCE__SampleLotAllocation__c WHERE OCE__IsActive__c = true\
          AND OCE__Lot__r.OCE__Product__r.RecordType.Name In ('Sample') AND OCE__Lot__r.OCE__Product__r.OCE__PhysicalSampleDrop__c = true ORDER BY OCE__Lot__r.OCE__Product__r.Name, OCE__Lot__c`
    );
  } else {
    return api.query(
      `SELECT Id, Name, OCE__Product__r.Name, OCE__Product__r.OCE__SKU__c, OCE__Product__c, OCE__ExpirationDate__c, OCE__IsActive__c\
              FROM OCE__Lot__c WHERE OCE__Product__r.RecordType.Name In ('Sample')\
              AND OCE__Product__r.OCE__PhysicalSampleDrop__c = true\
              AND OCE__IsActive__c = true\
              AND (OCE__Product__r.OCE__StartDate__c = null OR OCE__Product__r.OCE__StartDate__c <= ${today})\
              AND (OCE__Product__r.OCE__EndDate__c = null OR OCE__Product__r.OCE__EndDate__c >= ${today})\
              ORDER BY OCE__Product__r.OCE__ParentProduct__r.Name, OCE__Product__r.name, Name`
    );
  }
};

export const fetchAllUsers = () =>
  api.query(`SELECT ID, Name from USER ORDER BY Name`);

export const fetchUserLocations = user =>
  user && user.value
    ? api.query(
        `SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '${user.value}' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC`
      )
    : Promise.resolve([]);

export const fetchUserTerritory = user =>
  user && user.value
    ? api.query(
        `SELECT Id,OCE__Territory__c FROM OCE__UserSettings__c WHERE SetupOwnerId = '${user.value}'`
      )
    : Promise.resolve([]);

export const saveFormDetails = (values, type) => {
  if (type == 'submit') values.fields.status = 'Submitted';
  return api.create('OCE__SampleTransaction__c', mapFormDetails(values));
};

//ToDo change to use saveFormDetails
export const saveTransferInDetails = values => {
  return api.create('OCE__SampleTransaction__c', values);
};

export const saveFormProduct = (product, transactionId, recordTypeDevName) => {
  return api.create(
    'OCE__SampleTransactionDetail__c',
    mapFormProducts(product, transactionId, recordTypeDevName)
  );
};
