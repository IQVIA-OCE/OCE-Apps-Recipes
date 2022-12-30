import api from '../utils/api';

export const fetchReceivedSamplesData = (limit, recordTypeDevName) =>
  api.query(`select (select Id, Name from OCE__SampleTransactionItems__r), OCE__ConditionOfPackage__c,\
                        OCE__FromSalesRep__c, OCE__FromSalesRep__r.Name, Id, LastModifiedDate, OCE__ReceivedDate__c,\
                        RecordType.Name, RecordType.DeveloperName, OCE__ShipmentDate__c, OCE__Status__c,\
                        OCE__ToSalesRep__c, OCE__ToSalesRep__r.Name, OCE__TransactionDateTime__c, OCE__TransactionRep__c,\
                        OCE__TransactionRep__r.Name, OCE__FullAddress__c, OCE__Call__r.OCE__Account__c, OCE__Call__r.OCE__Account__r.Name\
                        from OCE__SampleTransaction__c\
                        Where RecordType.DeveloperName = '${recordTypeDevName}' and OCE__Status__c = 'In Progress'\
                        order by LastModifiedDate Desc Limit ${limit}`);

export const fetchReceivedSamplesListId = () =>
  api.query(
    `SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = 'OCE__SampleTransaction__c' AND (DeveloperName = 'ReceivedSamples')`
  );
