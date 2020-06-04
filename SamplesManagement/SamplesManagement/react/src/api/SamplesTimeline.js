import api from '../utils/api';

export const fetchTransactionsData = limit =>
  api.query(`select (select Id, Name from OCE__SampleTransactionItems__r), OCE__ConditionOfPackage__c,\
                        OCE__FromSalesRep__c, OCE__FromSalesRep__r.Name, Id, LastModifiedDate, OCE__ReceivedDate__c,\
                        RecordType.Name, RecordType.DeveloperName, OCE__ShipmentDate__c, OCE__Status__c,\
                        OCE__ToSalesRep__c, OCE__ToSalesRep__r.Name, OCE__TransactionDateTime__c, OCE__TransactionRep__c,\
                        OCE__TransactionRep__r.Name, OCE__FullAddress__c\
                        from OCE__SampleTransaction__c\
                        order by LastModifiedDate Desc Limit ${limit}`);

export const fetchOrdersData = limit =>
  api.query(
    `select (select OCE__Product__c, OCE__Quantity__c from OCE__SampleOrderDetails__r), Id, OCE__IsUrgent__c, LastModifiedDate, OCE__Status__c from OCE__SampleOrder__c order by LastModifiedDate Desc Limit ${limit}`
  );

export const fetchTransactionsListId = () =>
  api.query(
    `SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = 'OCE__SampleTransaction__c' AND DeveloperName = 'All'`
  );

export const fetchOrdersListId = () =>
  api.query(
    `SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = 'OCE__SampleOrder__c' AND DeveloperName = 'All'`
  );
