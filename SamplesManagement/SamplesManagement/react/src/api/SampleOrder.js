import api from '../utils/api';
import moment from 'moment';
import { NAMESPACE } from '../constants/constants';

export const fetchUserLocations = userId =>
  api.query(
    `SELECT Id, ${NAMESPACE}IsDefaultStorageLocation__c, ${NAMESPACE}FullAddress__c FROM ${NAMESPACE}SamplesManagementAddress__c WHERE OwnerId = '${userId}' ORDER BY ${NAMESPACE}IsDefaultStorageLocation__c DESC, Name ASC`
  );

export const fetchSampleProducts = () => {
  const today = moment().format('YYYY-MM-DD');

  return api.query(
    `SELECT Id, Name, ${NAMESPACE}IsAvailableForAllocation__c, ${NAMESPACE}ParentProduct__r.Name, ${NAMESPACE}MaxOrder__c, ${NAMESPACE}MinOrder__c, ${NAMESPACE}SKU__c\
                FROM ${NAMESPACE}Product__c\
                WHERE RecordType.DeveloperName = 'Sample' AND ${NAMESPACE}PhysicalSampleDrop__c = true\
                AND ${NAMESPACE}IsActive__c = true\
                AND (${NAMESPACE}StartDate__c = null OR ${NAMESPACE}StartDate__c <= ${today})\
                AND (${NAMESPACE}EndDate__c = null OR ${NAMESPACE}EndDate__c >= ${today})\
                ORDER BY ${NAMESPACE}ParentProduct__r.Name, Name`
  );
};

export const fetchSampleOrderConfig = () => {
  return api.query(
    `SELECT SetupOwnerId, ${NAMESPACE}SOEnableProductAllocation__c, ${NAMESPACE}SOFinalStatus__c, ${NAMESPACE}SOIsApprovalRequired__c, ${NAMESPACE}SOLockedStatus__c, ${NAMESPACE}SOProductQuantityLimit__c, ${NAMESPACE}SOShowProductAllocationRemaining__c FROM ${NAMESPACE}SamplesManagemenConfig__c`
  );
};

export const fetchUserProfile = userId => {
  return api.query(`SELECT Id, ${NAMESPACE}ProfileId__c FROM User WHERE Id = '${userId}'`);
};

export const fetchProductTerritoryAllocationRecords = () => {
  return api.query(
    `Select Id, Name, ${NAMESPACE}PlanCycle__r.${NAMESPACE}Territory__c, ${NAMESPACE}Product__c, ${NAMESPACE}Product__r.Name, ${NAMESPACE}PlanCycle__r.${NAMESPACE}Active__c, ${NAMESPACE}AllocationsRemaining__c From ${NAMESPACE}ProductTerritoryAllocation__c Where ${NAMESPACE}Product__r.RecordType.DeveloperName = 'Sample'\
    AND ${NAMESPACE}Product__r.${NAMESPACE}PhysicalSampleDrop__c = true\
    AND ${NAMESPACE}PlanCycle__r.${NAMESPACE}Active__c = true\
    AND ${NAMESPACE}Product__r.${NAMESPACE}IsActive__c = true\
    AND ${NAMESPACE}Product__r.${NAMESPACE}IsAvailableForAllocation__c = true\
    AND (RecordType.DeveloperName = 'PhysicalDrop' OR RecordType.DeveloperName = NULL)`
  );
};

export const saveSampleOrder = (fields, id) => {
  if (id) {
    return api.update(`${NAMESPACE}SampleOrder__c`, id, fields);
  } else {
    return api.create(`${NAMESPACE}SampleOrder__c`, fields);
  }
};

export const updateFormDetailsStatus = (id, values, status) => {
  values.fields.status = status;
  return api.update(`${NAMESPACE}SampleOrder__c`, id, { [`${NAMESPACE}Status__c`]: status });
};

export const saveSampleOrderProduct = product => {
  if (product.Id) {
    const productFields = {...product};
    delete productFields.Id;
    delete productFields[`${NAMESPACE}SampleOrder__c`];

    return api.update(`${NAMESPACE}SampleOrderDetail__c`, product.Id, productFields);
  } else {
    return api.create(`${NAMESPACE}SampleOrderDetail__c`, product);
  }
};

export const deleteSampleOrderProduct = id => {
  return api.del(`${NAMESPACE}SampleOrderDetail__c`, id);
};

export const deleteSampleOrder = id => {
  return api.del(`${NAMESPACE}SampleOrder__c`, id);
};

export const fetchOrderDetails = orderId =>
  orderId
    ? api.query(
        `SELECT Id, LastModifiedDate, Name, ${NAMESPACE}Comments__c, ${NAMESPACE}ShipToID__c, ${NAMESPACE}ShipToText__c, ${NAMESPACE}IsUrgent__c, ${NAMESPACE}Status__c, ${NAMESPACE}RecipientTerritory__c FROM ${NAMESPACE}SampleOrder__c WHERE Id = '${orderId}'`
      )
    : Promise.resolve([]);

export const fetchOrderProducts = orderId =>
  orderId
    ? api.query(
        `Select Id, Name, ${NAMESPACE}Product__c, ${NAMESPACE}Product__r.Name, ${NAMESPACE}Quantity__c, ${NAMESPACE}SampleOrder__c , ${NAMESPACE}Comments__c from ${NAMESPACE}SampleOrderDetail__c where ${NAMESPACE}SampleOrder__c = '${orderId}'`
      )
    : Promise.resolve([]);
