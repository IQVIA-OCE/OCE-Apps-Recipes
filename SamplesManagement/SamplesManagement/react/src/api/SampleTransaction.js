import api from '../utils/api';
import moment from 'moment';
import { NAMESPACE } from '../constants/constants';

export const fetchTransactionRecordTypes = () => {
  return api.query(
    `SELECT Description, DeveloperName, Id, Name FROM RecordType WHERE SobjectType = '${NAMESPACE}SampleTransaction__c'`
  );
};

export const fetchSampleProducts = recordTypeDevName => {
  const today = moment().format('YYYY-MM-DD');

  if (recordTypeDevName == 'TransferOut' || recordTypeDevName == 'Adjustment') {
    return api.query(
      `SELECT Id, ${NAMESPACE}IsActive__c, ${NAMESPACE}Lot__c, ${NAMESPACE}Lot__r.${NAMESPACE}Product__c, ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name,\
              ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.${NAMESPACE}SKU__c, ${NAMESPACE}LotExpirationDate__c, ${NAMESPACE}LotIsActive__c,\
              ${NAMESPACE}LotNumber__c, ${NAMESPACE}LotProductId__c, Name, OwnerId, SystemModstamp, ${NAMESPACE}User__c\
              FROM ${NAMESPACE}SampleLotAllocation__c WHERE ${NAMESPACE}IsActive__c = true AND ${NAMESPACE}Lot__r.${NAMESPACE}product__r.RecordType.Name In ('Sample')\
              AND ${NAMESPACE}Lot__r.${NAMESPACE}product__r.${NAMESPACE}PhysicalSampleDrop__c = true\
              AND (${NAMESPACE}Lot__r.${NAMESPACE}Product__r.${NAMESPACE}StartDate__c = null OR ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.${NAMESPACE}StartDate__c <= ${today})\
              AND (${NAMESPACE}Lot__r.${NAMESPACE}Product__r.${NAMESPACE}EndDate__c = null OR ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.${NAMESPACE}EndDate__c >= ${today})\
              ORDER BY ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name, ${NAMESPACE}Lot__c`
    );
  } else if (recordTypeDevName == 'Return') {
    return api.query(
      `SELECT Id, ${NAMESPACE}IsActive__c, ${NAMESPACE}Lot__c, ${NAMESPACE}Lot__r.${NAMESPACE}Product__c, ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name, ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.${NAMESPACE}SKU__c,\
          ${NAMESPACE}LotExpirationDate__c, ${NAMESPACE}LotIsActive__c, ${NAMESPACE}LotNumber__c,\
          ${NAMESPACE}LotProductId__c, Name, OwnerId, SystemModstamp, ${NAMESPACE}User__c FROM ${NAMESPACE}SampleLotAllocation__c WHERE ${NAMESPACE}IsActive__c = true\
          AND ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.RecordType.Name In ('Sample') AND ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.${NAMESPACE}PhysicalSampleDrop__c = true ORDER BY ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name, ${NAMESPACE}Lot__c`
    );
  } else {
    return api.query(
      `SELECT Id, Name, ${NAMESPACE}Product__r.Name, ${NAMESPACE}Product__r.${NAMESPACE}SKU__c, ${NAMESPACE}Product__c, ${NAMESPACE}ExpirationDate__c, ${NAMESPACE}IsActive__c\
              FROM ${NAMESPACE}Lot__c WHERE ${NAMESPACE}Product__r.RecordType.Name In ('Sample')\
              AND ${NAMESPACE}Product__r.${NAMESPACE}PhysicalSampleDrop__c = true\
              AND ${NAMESPACE}IsActive__c = true\
              AND (${NAMESPACE}Product__r.${NAMESPACE}StartDate__c = null OR ${NAMESPACE}Product__r.${NAMESPACE}StartDate__c <= ${today})\
              AND (${NAMESPACE}Product__r.${NAMESPACE}EndDate__c = null OR ${NAMESPACE}Product__r.${NAMESPACE}EndDate__c >= ${today})\
              ORDER BY ${NAMESPACE}Product__r.${NAMESPACE}ParentProduct__r.Name, ${NAMESPACE}Product__r.name, Name`
    );
  }
};

export const fetchAllUsers = () =>
  api.query(`SELECT ID, Name from USER ORDER BY Name`);

export const fetchUserLocations = userId => {
  return userId
    ? api.query(
        `SELECT Id, ${NAMESPACE}IsDefaultStorageLocation__c, ${NAMESPACE}FullAddress__c FROM ${NAMESPACE}SamplesManagementAddress__c WHERE OwnerId = '${userId}' ORDER BY ${NAMESPACE}IsDefaultStorageLocation__c DESC, Name ASC`
      )
    : Promise.resolve([]);
};

export const fetchUserTerritory = userId =>
  userId
    ? api.query(
        `SELECT Id,${NAMESPACE}Territory__c FROM ${NAMESPACE}UserSettings__c WHERE SetupOwnerId = '${userId}'`
      )
    : Promise.resolve([]);

export const saveFormDetails = (fields, type, id) => {
  if (type == 'submit') fields[`${NAMESPACE}Status__c`] = 'Submitted';
  if (id) {
    return api.update(`${NAMESPACE}SampleTransaction__c`, id, fields);
  } else {
    return api.create(`${NAMESPACE}SampleTransaction__c`, fields);
  }
};

//ToDo change to use saveFormDetails
export const saveTransferInDetails = values => {
  return api.create(`${NAMESPACE}SampleTransaction__c`, values);
};

export const saveTransactionProduct = (product, id) => {
  if (id) {
    return api.update(`${NAMESPACE}SampleTransactionDetail__c`, id, product);
  } else {
    return api.create(`${NAMESPACE}SampleTransactionDetail__c`, product);
  }
};

export const deleteFormProduct = id => {
  return api.del(`${NAMESPACE}SampleTransactionDetail__c`, id);
};

export const fetchTransactionDetails = transactionId =>
  transactionId
    ? api.query(
        `SELECT Id,LastModifiedDate,Name,${NAMESPACE}AddressLine1__c,${NAMESPACE}Call__c,${NAMESPACE}City__c,${NAMESPACE}Comments__c,${NAMESPACE}ConditionOfPackage__c,${NAMESPACE}Country__c,${NAMESPACE}Duplicate__c,${NAMESPACE}FromSalesRepTerritory__c,${NAMESPACE}FromSalesRep__c, ${NAMESPACE}FromSalesRep__r.Name,\
        ${NAMESPACE}FullAddress__c,${NAMESPACE}IntegrationID__c,${NAMESPACE}IsException__c,${NAMESPACE}IsSystemCreated__c,${NAMESPACE}Reason__c,${NAMESPACE}ReceivedDate__c,${NAMESPACE}RelatedTransactionId__c,${NAMESPACE}RelatedTransactionName__c,${NAMESPACE}ReturnToSender__c,${NAMESPACE}SampleOrderName__c,\
        ${NAMESPACE}SampleOrder__c,${NAMESPACE}ShipmentCarrier__c,${NAMESPACE}ShipmentDate__c,${NAMESPACE}ShipToID__c, ${NAMESPACE}State__c,${NAMESPACE}Status__c,${NAMESPACE}ToSalesRepTerritory__c,${NAMESPACE}ToSalesRep__c, ${NAMESPACE}ToSalesRep__r.Name,${NAMESPACE}TrackingNumber__c,${NAMESPACE}TransactionDateTime__c,${NAMESPACE}TransactionRepTerritory__c,\
        ${NAMESPACE}TransactionRep__c, ${NAMESPACE}TransactionRep__r.Name, ${NAMESPACE}Zip__c,OwnerId,RecordTypeId,RecordType.Name, RecordType.DeveloperName FROM ${NAMESPACE}SampleTransaction__c WHERE Id = '${transactionId}'`
      )
    : Promise.resolve([]);

export const fetchTransactionProducts = transactionId =>
  transactionId
    ? api.query(
        `Select Id, ${NAMESPACE}LotNumber__c, Name, ${NAMESPACE}Product__c, ${NAMESPACE}Product__r.Name, ${NAMESPACE}LotNumber__r.Name, ${NAMESPACE}Quantity__c, ${NAMESPACE}Reason__c, ${NAMESPACE}SampleTransaction__c , ${NAMESPACE}Comments__c, ${NAMESPACE}ShippedQuantity__c, ${NAMESPACE}IsSystemCreated__c from ${NAMESPACE}SampleTransactionDetail__c where ${NAMESPACE}SampleTransaction__c = '${transactionId}'`
      )
    : Promise.resolve([]);

export const deleteTransaction = id => {
  return api.del(`${NAMESPACE}SampleTransaction__c`, id);
};

export const saveTransactionAsDuplicate = (id, values) =>
  api.update(`${NAMESPACE}SampleTransaction__c`, id, {
    [`${NAMESPACE}Comments__c`]: values.fields.comments,
    [`${NAMESPACE}Duplicate__c`]: true,
    [`${NAMESPACE}Status__c`]: 'Duplicate',
  });

export const saveTransactionAsReturnToSender = (id, values) =>
  api.update(`${NAMESPACE}SampleTransaction__c`, id, {
    [`${NAMESPACE}ReturnToSender__c`]: true,
    [`${NAMESPACE}Status__c`]: 'Returned',
  });

export const saveTransaction = transaction => {
  const namespace = NAMESPACE ? NAMESPACE.replace('__','') : '';

  return api.apexRest('POST', 'sampletransactionservice', namespace, transaction);
};
