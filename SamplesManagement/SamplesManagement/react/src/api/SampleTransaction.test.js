import moment from 'moment';
import api from '../utils/api';
import {
  fetchAllUsers,
  fetchSampleProducts,
  fetchTransactionRecordTypes,
  fetchUserLocations,
  fetchUserTerritory,
  saveFormDetails,
  saveTransactionProduct,
  saveTransferInDetails,
  deleteFormProduct,
  deleteTransaction,
  fetchTransactionDetails,
  saveTransactionAsDuplicate,
  fetchTransactionProducts,
  saveTransactionAsReturnToSender,
  saveTransaction
} from './SampleTransaction';
import { trimQuery } from '../utils/utils';

jest.unmock('./SampleTransaction');

const query = jest.spyOn(api, 'query');
const del = jest.spyOn(api, 'del');
const create = jest.spyOn(api, 'create');
const update = jest.spyOn(api, 'update');
const today = moment().format('YYYY-MM-DD');

describe('SampleTransaction', () => {
  beforeAll(() => {
    query.mockClear();
    del.mockClear();
    create.mockClear();
    update.mockClear();
  });

  it('fetchTransactionRecordTypes', () => {
    fetchTransactionRecordTypes();
    expect(query).toHaveBeenCalledWith("SELECT Description, DeveloperName, Id, Name FROM RecordType WHERE SobjectType = 'OCE__SampleTransaction__c'");
  });

  it('fetchSampleProducts: TransferOut or Adjustment', () => {
    const sqlQuery = trimQuery(`SELECT Id, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name,\
              OCE__Lot__r.OCE__Product__r.OCE__SKU__c, OCE__LotExpirationDate__c, OCE__LotIsActive__c,\
              OCE__LotNumber__c, OCE__LotProductId__c, Name, OwnerId, SystemModstamp, OCE__User__c\
              FROM OCE__SampleLotAllocation__c WHERE OCE__IsActive__c = true AND OCE__Lot__r.OCE__product__r.RecordType.Name In ('Sample')\
              AND OCE__Lot__r.OCE__product__r.OCE__PhysicalSampleDrop__c = true\
              AND (OCE__Lot__r.OCE__Product__r.OCE__StartDate__c = null OR OCE__Lot__r.OCE__Product__r.OCE__StartDate__c <= ${today})\
              AND (OCE__Lot__r.OCE__Product__r.OCE__EndDate__c = null OR OCE__Lot__r.OCE__Product__r.OCE__EndDate__c >= ${today})\
              ORDER BY OCE__Lot__r.OCE__Product__r.Name, OCE__Lot__c`);

    fetchSampleProducts('TransferOut');
    expect(trimQuery(query.mock.lastCall[0])).toEqual(sqlQuery);

    fetchSampleProducts('Adjustment');
    expect(trimQuery(query.mock.lastCall[0])).toEqual(sqlQuery);
  });

  it('fetchSampleProducts: Return', () => {
    fetchSampleProducts('Return');
    expect(trimQuery(query.mock.lastCall[0])).toEqual("SELECT Id, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name, OCE__Lot__r.OCE__Product__r.OCE__SKU__c, OCE__LotExpirationDate__c, OCE__LotIsActive__c, OCE__LotNumber__c, OCE__LotProductId__c, Name, OwnerId, SystemModstamp, OCE__User__c FROM OCE__SampleLotAllocation__c WHERE OCE__IsActive__c = true AND OCE__Lot__r.OCE__Product__r.RecordType.Name In ('Sample') AND OCE__Lot__r.OCE__Product__r.OCE__PhysicalSampleDrop__c = true ORDER BY OCE__Lot__r.OCE__Product__r.Name, OCE__Lot__c");
  });

  it('fetchSampleProducts', () => {
    fetchSampleProducts();
    expect(trimQuery(query.mock.lastCall[0])).toEqual(`SELECT Id, Name, OCE__Product__r.Name, OCE__Product__r.OCE__SKU__c, OCE__Product__c, OCE__ExpirationDate__c, OCE__IsActive__c FROM OCE__Lot__c WHERE OCE__Product__r.RecordType.Name In ('Sample') AND OCE__Product__r.OCE__PhysicalSampleDrop__c = true AND OCE__IsActive__c = true AND (OCE__Product__r.OCE__StartDate__c = null OR OCE__Product__r.OCE__StartDate__c <= ${today}) AND (OCE__Product__r.OCE__EndDate__c = null OR OCE__Product__r.OCE__EndDate__c >= ${today}) ORDER BY OCE__Product__r.OCE__ParentProduct__r.Name, OCE__Product__r.name, Name`);
  });

  it('fetchAllUsers', () => {
    fetchAllUsers();
    expect(query).toHaveBeenCalledWith("SELECT ID, Name from USER ORDER BY Name");
  });

  it('fetchUserLocations', () => {
    // with id
    fetchUserLocations('0050k000004CineAAC');
    expect(query).toHaveBeenCalledWith("SELECT Id, OCE__IsDefaultStorageLocation__c, OCE__FullAddress__c FROM OCE__SamplesManagementAddress__c WHERE OwnerId = '0050k000004CineAAC' ORDER BY OCE__IsDefaultStorageLocation__c DESC, Name ASC");

    // without id
    expect(fetchUserLocations()).resolves.toStrictEqual([]);
  });

  it('fetchUserTerritory', () => {
    // with id
    fetchUserTerritory('0050k000004CineAAC');
    expect(query).toHaveBeenCalledWith("SELECT Id,OCE__Territory__c FROM OCE__UserSettings__c WHERE SetupOwnerId = '0050k000004CineAAC'");

    // without id
    expect(fetchUserTerritory()).resolves.toStrictEqual([]);
  });

  it('saveFormDetails', () => {
    const fields = {
      Name: 'Name',
      OCE__Quantity__c: 123,
      OCE__City__c: "City"
    }
    // create
    saveFormDetails(fields, 'create');
    expect(create).toHaveBeenCalledWith("OCE__SampleTransaction__c", fields);

    // submit
    saveFormDetails(fields, 'submit');
    expect(fields.OCE__Status__c).toBe('Submitted');
    expect(create).toHaveBeenCalledWith('OCE__SampleTransaction__c', {...fields, OCE__Status__c: "Submitted"});
  });

  it('saveFormDetails with id', () => {
    const fields = {
      Name: 'Name',
      OCE__Quantity__c: 123,
      OCE__City__c: "City"
    }
    // save
    saveFormDetails(fields, 'save', '0050k000004CineAAC');
    expect(update).toHaveBeenCalledWith("OCE__SampleTransaction__c", "0050k000004CineAAC", fields);

    // submit
    saveFormDetails(fields, 'submit', '0050k000004CineAAC');
    expect(fields.OCE__Status__c).toBe('Submitted');
    expect(update).toHaveBeenCalledWith("OCE__SampleTransaction__c", "0050k000004CineAAC", {...fields, OCE__Status__c: "Submitted"});
  });

  it('saveTransferInDetails', () => {
    saveTransferInDetails({ value: '1' });
    expect(create).toHaveBeenCalledWith("OCE__SampleTransaction__c", { value: '1' });
  });

  it('saveTransactionProduct', () => {
    const product = {
      Name: 'Product 1',
      OCE__Status__c: 'Draft',
      OCE__Quantity__c: 123,
    }
    // create
    saveTransactionProduct(product);
    expect(create).toHaveBeenCalledWith("OCE__SampleTransactionDetail__c", product);

    // update
    saveTransactionProduct(product, "0050k000004CineAAC");
    expect(update).toHaveBeenCalledWith("OCE__SampleTransactionDetail__c", "0050k000004CineAAC", product);
  });

  it('deleteFormProduct', () => {
    //without id
    deleteFormProduct();
    expect(del).toHaveBeenCalledWith("OCE__SampleTransactionDetail__c", undefined);

    //with id
    deleteFormProduct("0050k000004CineAAC");
    expect(del).toHaveBeenCalledWith("OCE__SampleTransactionDetail__c", "0050k000004CineAAC");
  });

  it('deleteTransaction', () => {
    //without id
    deleteTransaction();
    expect(del).toHaveBeenCalledWith("OCE__SampleTransaction__c", undefined);

    //with id
    deleteTransaction("0050k000004CineAAC");
    expect(del).toHaveBeenCalledWith("OCE__SampleTransaction__c", "0050k000004CineAAC");
  });

  it('fetchTransactionDetails', () => {
    //without id
    expect(fetchTransactionDetails()).resolves.toStrictEqual([]);

    //with id
    fetchTransactionDetails("0050k000004CineAAC");
    expect(trimQuery(query.mock.lastCall[0])).toStrictEqual("SELECT Id,LastModifiedDate,Name,OCE__AddressLine1__c,OCE__Call__c,OCE__City__c,OCE__Comments__c,OCE__ConditionOfPackage__c,OCE__Country__c,OCE__Duplicate__c,OCE__FromSalesRepTerritory__c,OCE__FromSalesRep__c, OCE__FromSalesRep__r.Name, OCE__FullAddress__c,OCE__IntegrationID__c,OCE__IsException__c,OCE__IsSystemCreated__c,OCE__Reason__c,OCE__ReceivedDate__c,OCE__RelatedTransactionId__c,OCE__RelatedTransactionName__c,OCE__ReturnToSender__c,OCE__SampleOrderName__c, OCE__SampleOrder__c,OCE__ShipmentCarrier__c,OCE__ShipmentDate__c,OCE__ShipToID__c, OCE__State__c,OCE__Status__c,OCE__ToSalesRepTerritory__c,OCE__ToSalesRep__c, OCE__ToSalesRep__r.Name,OCE__TrackingNumber__c,OCE__TransactionDateTime__c,OCE__TransactionRepTerritory__c, OCE__TransactionRep__c, OCE__TransactionRep__r.Name, OCE__Zip__c,OwnerId,RecordTypeId,RecordType.Name, RecordType.DeveloperName FROM OCE__SampleTransaction__c WHERE Id = '0050k000004CineAAC'");
  });

  it('fetchTransactionProducts', () => {
    //without id
    expect(fetchTransactionProducts()).resolves.toStrictEqual([]);

    //with id
    fetchTransactionProducts("0050k000004CineAAC");
    expect(trimQuery(query.mock.lastCall[0])).toStrictEqual("Select Id, OCE__LotNumber__c, Name, OCE__Product__c, OCE__Product__r.Name, OCE__LotNumber__r.Name, OCE__Quantity__c, OCE__Reason__c, OCE__SampleTransaction__c , OCE__Comments__c, OCE__ShippedQuantity__c, OCE__IsSystemCreated__c from OCE__SampleTransactionDetail__c where OCE__SampleTransaction__c = '0050k000004CineAAC'");
  });

  it('saveTransactionAsDuplicate', () => {
    const fields = {
      fields: {
        comments: 'Comment'
      }
    };
    const payload = {
      [`OCE__Comments__c`]: 'Comment',
      [`OCE__Duplicate__c`]: true,
      [`OCE__Status__c`]: 'Duplicate',
    };
    //without id
    saveTransactionAsDuplicate(undefined, fields);
    expect(update).toHaveBeenCalledWith("OCE__SampleTransaction__c", undefined, payload);

    //with id
    saveTransactionAsDuplicate("0050k000004CineAAC", fields);
    expect(update).toHaveBeenCalledWith("OCE__SampleTransaction__c", "0050k000004CineAAC", payload);
  });

  it('saveTransactionAsReturnToSender', () => {
    const payload = {
      [`OCE__ReturnToSender__c`]: true,
      [`OCE__Status__c`]: 'Returned',
    };
    //without params
    saveTransactionAsReturnToSender();
    expect(update).toHaveBeenCalledWith("OCE__SampleTransaction__c", undefined, payload);

    //with params
    saveTransactionAsReturnToSender("0050k000004CineAAC");
    expect(update).toHaveBeenCalledWith("OCE__SampleTransaction__c", "0050k000004CineAAC", payload);
  });

  it('saveTransaction', () => {
    const spy = jest.spyOn(api, 'apexRest');
    const transaction = {
      [`OCE__Comments__c`]: 'Comment',
      [`OCE__Duplicate__c`]: true,
      [`OCE__Status__c`]: 'Duplicate',
    };
    //without params
    saveTransaction();
    expect(spy).toHaveBeenCalledWith('POST', 'sampletransactionservice', 'OCE', undefined);

    //with params
    saveTransaction(transaction);
    expect(spy).toHaveBeenCalledWith('POST', 'sampletransactionservice', 'OCE', transaction);
  });
});
