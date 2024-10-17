import api from '../utils/api';
import {
  fetchProductTerritoryAllocationRecords,
  fetchSampleOrderConfig,
  fetchSampleProducts,
  fetchUserLocations,
  fetchUserProfile,
  saveSampleOrder,
  saveSampleOrderProduct,
  updateFormDetailsStatus,
  fetchOrderDetails,
  fetchOrderProducts
} from './SampleOrder';
import moment from 'moment';
import { trimQuery } from '../utils/utils';

jest.unmock('./SampleOrder');

const query = jest.spyOn(api, 'query');
const create = jest.spyOn(api, 'create');
const update = jest.spyOn(api, 'update');

describe('SampleOrder', () => {
  beforeEach(() => {
    query.mockClear();
    create.mockClear();
    update.mockClear();
  });

  it('fetchUserLocations', () => {
    // without params
    fetchUserLocations();
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = 'undefined' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC");

    // with params
    fetchUserLocations("0050k000004CineAAC");
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '0050k000004CineAAC' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC");
  });

  it('fetchSampleProducts', () => {
    const today = moment().format('YYYY-MM-DD');

    fetchSampleProducts();
    expect(trimQuery(query.mock.lastCall[0])).toEqual(`SELECT Id, Name, OCE__IsAvailableForAllocation__c, OCE__ParentProduct__r.Name, OCE__MaxOrder__c, OCE__MinOrder__c, OCE__SKU__c FROM OCE__Product__c WHERE RecordType.DeveloperName = 'Sample' AND OCE__PhysicalSampleDrop__c = true AND OCE__IsActive__c = true AND (OCE__StartDate__c = null OR OCE__StartDate__c <= ${today}) AND (OCE__EndDate__c = null OR OCE__EndDate__c >= ${today}) ORDER BY OCE__ParentProduct__r.Name, Name`);
  });

  it('fetchSampleOrderConfig', () => {
    fetchSampleOrderConfig();
    expect(query).toHaveBeenCalledWith("SELECT SetupOwnerId, OCE__SOEnableProductAllocation__c, OCE__SOFinalStatus__c, OCE__SOIsApprovalRequired__c, OCE__SOLockedStatus__c, OCE__SOProductQuantityLimit__c, OCE__SOShowProductAllocationRemaining__c FROM OCE__SamplesManagemenConfig__c");
  });

  it('fetchUserProfile', () => {
    // without params
    fetchUserProfile();
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__ProfileId__c FROM User WHERE Id = 'undefined'");

    // without params
    fetchUserProfile("0050k000004CineAAC");
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__ProfileId__c FROM User WHERE Id = '0050k000004CineAAC'");
  });

  it('fetchProductTerritoryAllocationRecords', () => {
    fetchProductTerritoryAllocationRecords();
    expect(trimQuery(query.mock.lastCall[0])).toEqual("Select Id, Name, OCE__PlanCycle__r.OCE__Territory__c, OCE__Product__c, OCE__Product__r.Name, OCE__PlanCycle__r.OCE__Active__c, OCE__AllocationsRemaining__c From OCE__ProductTerritoryAllocation__c Where OCE__Product__r.RecordType.DeveloperName = 'Sample' AND OCE__Product__r.OCE__PhysicalSampleDrop__c = true AND OCE__PlanCycle__r.OCE__Active__c = true AND OCE__Product__r.OCE__IsActive__c = true AND OCE__Product__r.OCE__IsAvailableForAllocation__c = true AND (RecordType.DeveloperName = 'PhysicalDrop' OR RecordType.DeveloperName = NULL)");
  });

  it('saveSampleOrder', () => {
    const fields = {
      fields: {
        status: 'status',
        user: { Id: '1' },
        territory: {},
        shipTo: {},
      },
    };
    // without params
    saveSampleOrder();
    expect(create).toHaveBeenCalledWith("OCE__SampleOrder__c", undefined);

    // with fields
    saveSampleOrder(fields);
    expect(create).toHaveBeenCalledWith("OCE__SampleOrder__c", fields);

    // with fields and id
    saveSampleOrder(fields, "0050k000004CineARC");
    expect(update).toHaveBeenCalledWith("OCE__SampleOrder__c", "0050k000004CineARC", fields);
  });

  it('updateFormDetailsStatus', () => {
    const item = { fields: { user: {}, territory: {} } };

    // without params
    updateFormDetailsStatus(undefined, item);
    expect(update).toHaveBeenCalledWith("OCE__SampleOrder__c", undefined, {"OCE__Status__c": undefined });
    expect(item.fields.status).toEqual(undefined);

    // with params
    updateFormDetailsStatus('0050k000004CineARC', item, "Submitted");
    expect(update).toHaveBeenCalledWith("OCE__SampleOrder__c", "0050k000004CineARC", {"OCE__Status__c": "Submitted" });
    expect(item.fields.status).toEqual("Submitted");
  });

  it('saveSampleOrderProduct', () => {
    const product = {
      Name: "Product_Name",
      Quantity__c: 10,
      Comments__c: "Comment"
    };

    // create
    saveSampleOrderProduct(product);
    expect(create).toHaveBeenCalledWith("OCE__SampleOrderDetail__c", product);

    // update
    const productWithId = {...product, Id: "0050k000004CineFRC", "OCE__SampleOrder__c": "Order"};
    saveSampleOrderProduct(productWithId);
    expect(update).toHaveBeenCalledWith("OCE__SampleOrderDetail__c", "0050k000004CineFRC", product);
  });

  it('fetchOrderDetails', () => {
    // without orderId
    const response = fetchOrderDetails();
    expect(response).resolves.toEqual([]);
    expect(query).not.toHaveBeenCalled();

    // with orderId
    fetchOrderDetails("0050k000004CineFRC");
    expect(query).toHaveBeenCalledWith("SELECT Id, LastModifiedDate, Name, OCE__Comments__c, OCE__ShipToID__c, OCE__ShipToText__c, OCE__IsUrgent__c, OCE__Status__c, OCE__RecipientTerritory__c FROM OCE__SampleOrder__c WHERE Id = '0050k000004CineFRC'");
  });

  it('fetchOrderProducts', () => {
    // without orderId
    const response = fetchOrderProducts();
    expect(response).resolves.toEqual([]);
    expect(query).not.toHaveBeenCalled();

    // with orderId
    fetchOrderProducts("0050k000004CineFRC");
    expect(query).toHaveBeenCalledWith("Select Id, Name, OCE__Product__c, OCE__Product__r.Name, OCE__Quantity__c, OCE__SampleOrder__c , OCE__Comments__c from OCE__SampleOrderDetail__c where OCE__SampleOrder__c = '0050k000004CineFRC'");
  });
});
