import { databaseManager } from "../../bridge/Database/DatabaseManager.native";
import { fetchOrderDetails, fetchAccounts, fetchAccountById, fetchOrderById, fetchAllOrderDetailsRecords } from "./OrderDetails";

const records = [
  {
    Id: 'a3v6g000000Pv0xAAC',
    Name: 'ODTL-1300',
    OCE__Account__c: '0016g00000awb1yAAA',
    OCE__Free__c: 48,
    OCE__OrderDelivery2__c: 'a3u6g0000006JSoAAM',
    'OCE__OrderDelivery2__r.OCE__DeliveryDate__c': '2020-09-03',
    OCE__OrderLineItem2__c: 'a3y6g000000HVefAAG',
    OCE__ProductName__c: null,
    'OCE__Product__r.Name': null,
    OCE__Product__c: 'a4J6g000000gHEaEAM',
    'OCE__Product__r.OCE__ProductCode__c': 'SOR00005',
    OCE__Quantity__c: null,
    uid: 'a3v6g000000Pv0xAAC',
    'OCE__Product__r.OCE__ParentBrandProductId__c': null,
    'OCE__Product__r.OCE__ParentBrandProductId__r.Name': null
  },
  {
    Id: 'a3v6g000000Pv0wAAC',
    Name: 'ODTL-1299',
    OCE__Account__c: '0016g00000awb1yAAA',
    OCE__Free__c: 48,
    OCE__OrderDelivery2__c: 'a3u6g0000006JSoAAM',
    'OCE__OrderDelivery2__r.OCE__DeliveryDate__c': '2020-09-03',
    OCE__OrderLineItem2__c: 'a3y6g000000HVehAAG',
    OCE__ProductName__c: null,
    'OCE__Product__r.Name': null,
    OCE__Product__c: 'a4J6g000000gHE9EAM',
    'OCE__Product__r.OCE__ProductCode__c': '1244',
    OCE__Quantity__c: null,
    uid: 'a3v6g000000Pv0wAAC',
    'OCE__Product__r.OCE__ParentBrandProductId__c': null,
    'OCE__Product__r.OCE__ParentBrandProductId__r.Name': null
  },
  {
    Id: 'a3v6g000000Pv0vAAC',
    Name: 'ODTL-1298',
    OCE__Account__c: '0016g00000awb1yAAA',
    OCE__Free__c: 48,
    OCE__OrderDelivery2__c: 'a3u6g0000006JSoAAM',
    'OCE__OrderDelivery2__r.OCE__DeliveryDate__c': '2020-09-03',
    OCE__OrderLineItem2__c: 'a3y6g000000HVedAAG',
    OCE__ProductName__c: null,
    'OCE__Product__r.Name': null,
    OCE__Product__c: 'a4J6g000000gHEcEAM',
    'OCE__Product__r.OCE__ProductCode__c': 'SOR00007',
    OCE__Quantity__c: null,
    uid: 'a3v6g000000Pv0vAAC',
    'OCE__Product__r.OCE__ParentBrandProductId__c': null,
    'OCE__Product__r.OCE__ParentBrandProductId__r.Name': null
  },
];

describe("OrderDetails api", () => {
  beforeAll(() => {
    jest.mock('./OrderDetails', () => ({
      fetchAllOrderDetailsRecords: jest.fn(),
    }));
  })
  it("should fetchOrderDetails with orders", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchOrderDetails('123', 'Order', 360, '123', null);
    expect(spy).toHaveBeenCalled();
  });
  it("should fetchOrderDetails with account", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchOrderDetails('123', 'Account', 360, null, '123');

    expect(spy).toHaveBeenCalled();
  });
  it("should fetchAccounts with value", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchAccounts('test');
    expect(spy).toHaveBeenCalled();
  });
  it("should fetchAccounts without value", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchAccounts();
    expect(spy).toHaveBeenCalled();
  });
  it("should fetchAccountById with value", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchAccountById('123');
    expect(spy).toHaveBeenCalled();
  });
  it("should fetchOrderById with value", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    fetchOrderById('123');
    expect(spy).toHaveBeenCalled();
  });
  it("should fetchAllOrderDetailsRecords", async () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve({ 
      records, nextQueryLocator: '123' 
    }));
    const data = await fetchAllOrderDetailsRecords('123', 'Account', 360, null, '123', null);
    expect(data).toEqual(records);
    expect(spy).toHaveBeenCalled();
  });
  it("should fetchAllOrderDetailsRecords with queryLocator", async () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementationOnce(() => Promise.resolve({ 
      records, nextQueryLocator: '123' 
    }));
    const data = await fetchAllOrderDetailsRecords('123', 'Account', 360, null, '123', 'test');
    expect(data).toEqual(records);
    expect(spy).toHaveBeenCalled();
  });
  
  // it("should fetchAllOrderDetailsRecords with queryLocator", async () => {
  //   const spy = jest.spyOn(databaseManager, "fetch").mockImplementation(() => Promise.resolve({
  //     records: [], nextQueryLocator: '123'
  //   }));
  //   fetchAllOrderDetailsRecords.mockImplementation(() => Promise.resolve({
  //     records: [], nextQueryLocator: '123'
  //   }));
  //   await fetchAllOrderDetailsRecords('123', 'Account', 360, null, '123', 'test');
  //   expect(spy).toHaveBeenCalled();
  // });
});