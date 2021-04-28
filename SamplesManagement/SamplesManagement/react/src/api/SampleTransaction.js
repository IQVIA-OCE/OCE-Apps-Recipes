import api from '../utils/api';
import moment from 'moment';

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

export const fetchUserLocations = userId => {
  return userId
    ? api.query(
        `SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '${userId}' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC`
      )
    : Promise.resolve([]);
};

export const fetchUserTerritory = userId =>
  userId
    ? api.query(
        `SELECT Id,OCE__Territory__c FROM OCE__UserSettings__c WHERE SetupOwnerId = '${userId}'`
      )
    : Promise.resolve([]);

export const saveFormDetails = (fields, type, id) => {
  if (type == 'submit') fields.OCE__Status__c = 'Submitted';
  if (id) {
    return api.update('OCE__SampleTransaction__c', id, fields);
  } else {
    return api.create('OCE__SampleTransaction__c', fields);
  }
};

//ToDo change to use saveFormDetails
export const saveTransferInDetails = values => {
  return api.create('OCE__SampleTransaction__c', values);
};

export const saveTransactionProduct = (product, id) => {
  if (id) {
    return api.update('OCE__SampleTransactionDetail__c', id, product);
  } else {
    return api.create('OCE__SampleTransactionDetail__c', product);
  }
};

export const deleteFormProduct = id => {
  return api.del('OCE__SampleTransactionDetail__c', id);
};

export const fetchTransactionDetails = transactionId =>
  transactionId
    ? api.query(
        `SELECT Id,LastModifiedDate,Name,OCE__AddressLine1__c,OCE__Call__c,OCE__City__c,OCE__Comments__c,OCE__ConditionOfPackage__c,OCE__Country__c,OCE__Duplicate__c,OCE__FromSalesRepTerritory__c,OCE__FromSalesRep__c, OCE__FromSalesRep__r.Name,\
        OCE__FullAddress__c,OCE__IntegrationID__c,OCE__IsException__c,OCE__IsSystemCreated__c,OCE__Reason__c,OCE__ReceivedDate__c,OCE__RelatedTransactionId__c,OCE__RelatedTransactionName__c,OCE__ReturnToSender__c,OCE__SampleOrderName__c,\
        OCE__SampleOrder__c,OCE__ShipmentCarrier__c,OCE__ShipmentDate__c,OCE__ShipToID__c, OCE__State__c,OCE__Status__c,OCE__ToSalesRepTerritory__c,OCE__ToSalesRep__c, OCE__ToSalesRep__r.Name,OCE__TrackingNumber__c,OCE__TransactionDateTime__c,OCE__TransactionRepTerritory__c,\
        OCE__TransactionRep__c, OCE__TransactionRep__r.Name, OCE__Zip__c,OwnerId,RecordTypeId,RecordType.Name, RecordType.DeveloperName FROM OCE__SampleTransaction__c WHERE Id = '${transactionId}'`
      )
    : Promise.resolve([]);

export const fetchTransactionProducts = transactionId =>
  transactionId
    ? api.query(
        `Select Id, OCE__LotNumber__c, Name, OCE__Product__c, OCE__Product__r.Name, OCE__LotNumber__r.Name, OCE__Quantity__c, OCE__Reason__c, OCE__SampleTransaction__c , OCE__Comments__c, OCE__ShippedQuantity__c, OCE__IsSystemCreated__c from OCE__SampleTransactionDetail__c where OCE__SampleTransaction__c = '${transactionId}'`
      )
    : Promise.resolve([]);

export const deleteTransaction = id => {
  return api.del('OCE__SampleTransaction__c', id);
};

export const saveTransactionAsDuplicate = (id, values) =>
  api.update('OCE__SampleTransaction__c', id, {
    OCE__Comments__c: values.fields.comments,
    OCE__Duplicate__c: true,
    OCE__Status__c: 'Duplicate',
  });

export const saveTransactionAsReturnToSender = (id, values) =>
  api.update('OCE__SampleTransaction__c', id, {
    OCE__ReturnToSender__c: true,
    OCE__Status__c: 'Returned',
  });

export const saveTransaction = transaction => {
  return api.apexRest('POST', 'sampletransactionservice', 'OCE', transaction);
};
