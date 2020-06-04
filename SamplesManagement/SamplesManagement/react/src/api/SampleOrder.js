import api from '../utils/api';
import moment from 'moment';
import { mapFormDetails, mapFormProducts } from '../screens/SampleOrder/utils';

export const fetchUserLocations = userId =>
  api.query(
    `SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '${userId}' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC`
  );

export const fetchSampleProducts = () => {
  const today = moment().format('YYYY-MM-DD');

  return api.query(
    `SELECT Id, Name, OCE__IsAvailableForAllocation__c, OCE__ParentProduct__r.Name, OCE__MaxOrder__c, OCE__MinOrder__c, OCE__SKU__c\
                FROM OCE__Product__c\
                WHERE RecordType.DeveloperName = 'Sample' AND OCE__PhysicalSampleDrop__c = true\
                AND OCE__IsActive__c = true\
                AND (OCE__StartDate__c = null OR OCE__StartDate__c <= ${today})\
                AND (OCE__EndDate__c = null OR OCE__EndDate__c >= ${today})\
                ORDER BY OCE__ParentProduct__r.Name, Name`
  );
};

export const fetchSampleOrderConfig = () => {
  return api.query(
    `SELECT SetupOwnerId, OCE__SOEnableProductAllocation__c, OCE__SOFinalStatus__c, OCE__SOIsApprovalRequired__c, OCE__SOLockedStatus__c, OCE__SOProductQuantityLimit__c, OCE__SOShowProductAllocationRemaining__c FROM OCE__SamplesManagemenConfig__c`
  );
};

export const fetchUserProfile = userId => {
  return api.query(`SELECT Id, ProfileId FROM User WHERE Id = '${userId}'`);
};

export const fetchOrgId = () => {
  return api.query(`SELECT Id FROM Organization`);
};

export const fetchProductTerritoryAllocationRecords = () => {
  return api.query(
    `Select Id, Name, OCE__PlanCycle__r.OCE__Territory__c, OCE__Product__c, OCE__Product__r.Name, OCE__PlanCycle__r.OCE__Active__c, OCE__AllocationsRemaining__c From OCE__ProductTerritoryAllocation__c Where OCE__Product__r.RecordType.DeveloperName = 'Sample'\
    AND OCE__Product__r.OCE__PhysicalSampleDrop__c = true\
    AND OCE__PlanCycle__r.OCE__Active__c = true\
    AND OCE__Product__r.OCE__IsActive__c = true\
    AND OCE__Product__r.OCE__IsAvailableForAllocation__c = true\
    AND (RecordType.DeveloperName = 'PhysicalDrop' OR RecordType.DeveloperName = NULL)`
  );
};

export const saveFormDetails = values => {
  return api.create('OCE__SampleOrder__c', mapFormDetails(values));
};

export const updateFormDetailsStatus = (id, values, status) => {
  values.fields.status = status;
  return api.update('OCE__SampleOrder__c', id, { OCE__Status__c: status });
};

export const saveFormProduct = (product, orderId, recordTypeDevName) => {
  return api.create(
    'OCE__SampleOrderDetail__c',
    mapFormProducts(product, orderId, recordTypeDevName)
  );
};
