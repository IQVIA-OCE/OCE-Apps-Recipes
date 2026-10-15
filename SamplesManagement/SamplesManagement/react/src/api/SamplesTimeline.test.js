import api from '../utils/api';
import {
  fetchOrdersData,
  fetchOrdersListId,
  fetchTransactionsData,
  fetchTransactionsListId,
} from './SamplesTimeline';
import { trimQuery } from '../utils/utils';

jest.unmock('./SamplesTimeline');

const spy = jest.spyOn(api, 'query');

describe('SamplesTimeline', () => {
  beforeEach(() => {
    spy.mockClear();
  })

  it('fetchTransactionsData', () => {
    // without limit
    fetchTransactionsData();
    expect(trimQuery(spy.mock.lastCall[0])).toEqual("select (select Id, Name from OCE__SampleTransactionItems__r), OCE__ConditionOfPackage__c, OCE__FromSalesRep__c, OCE__FromSalesRep__r.Name, Id, LastModifiedDate, OCE__ReceivedDate__c, RecordType.Name, RecordType.DeveloperName, OCE__ShipmentDate__c, OCE__Status__c, OCE__ToSalesRep__c, OCE__ToSalesRep__r.Name, OCE__TransactionDateTime__c, OCE__TransactionRep__c, OCE__TransactionRep__r.Name, OCE__FullAddress__c, OCE__Call__r.OCE__Account__c, OCE__Call__r.OCE__Account__r.Name from OCE__SampleTransaction__c order by LastModifiedDate Desc Limit undefined");

    // with limit
    fetchTransactionsData(6);
    expect(trimQuery(spy.mock.lastCall[0])).toEqual("select (select Id, Name from OCE__SampleTransactionItems__r), OCE__ConditionOfPackage__c, OCE__FromSalesRep__c, OCE__FromSalesRep__r.Name, Id, LastModifiedDate, OCE__ReceivedDate__c, RecordType.Name, RecordType.DeveloperName, OCE__ShipmentDate__c, OCE__Status__c, OCE__ToSalesRep__c, OCE__ToSalesRep__r.Name, OCE__TransactionDateTime__c, OCE__TransactionRep__c, OCE__TransactionRep__r.Name, OCE__FullAddress__c, OCE__Call__r.OCE__Account__c, OCE__Call__r.OCE__Account__r.Name from OCE__SampleTransaction__c order by LastModifiedDate Desc Limit 6");
  });

  it('fetchOrdersData', () => {
    // without limit
    fetchOrdersData();
    expect(spy).toHaveBeenCalledWith("select (select OCE__Product__c, OCE__Quantity__c from OCE__SampleOrderDetails__r), Id, OCE__IsUrgent__c, LastModifiedDate, OCE__Status__c from OCE__SampleOrder__c order by LastModifiedDate Desc Limit undefined");

    // with limit
    fetchOrdersData(4)
    expect(spy).toHaveBeenCalledWith("select (select OCE__Product__c, OCE__Quantity__c from OCE__SampleOrderDetails__r), Id, OCE__IsUrgent__c, LastModifiedDate, OCE__Status__c from OCE__SampleOrder__c order by LastModifiedDate Desc Limit 4");
  });

  it('fetchTransactionsListId', () => {
    fetchTransactionsListId();
    expect(spy).toHaveBeenCalledWith("SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = 'OCE__SampleTransaction__c' AND DeveloperName = 'All'");
  });

  it('fetchOrdersListId', () => {
    fetchOrdersListId();
    expect(spy).toHaveBeenCalledWith("SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = 'OCE__SampleOrder__c' AND DeveloperName = 'All'");
  });
});
