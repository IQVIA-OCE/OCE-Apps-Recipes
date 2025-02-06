import api from '../utils/api';
import { NAMESPACE } from '../constants/constants';

export const fetchTransactionsData = limit =>
  api.query(`select (select Id, Name from ${NAMESPACE}SampleTransactionItems__r), ${NAMESPACE}ConditionOfPackage__c,\
                        ${NAMESPACE}FromSalesRep__c, ${NAMESPACE}FromSalesRep__r.Name, Id, LastModifiedDate, ${NAMESPACE}ReceivedDate__c,\
                        RecordType.Name, RecordType.DeveloperName, ${NAMESPACE}ShipmentDate__c, ${NAMESPACE}Status__c,\
                        ${NAMESPACE}ToSalesRep__c, ${NAMESPACE}ToSalesRep__r.Name, ${NAMESPACE}TransactionDateTime__c, ${NAMESPACE}TransactionRep__c,\
                        ${NAMESPACE}TransactionRep__r.Name, ${NAMESPACE}FullAddress__c, ${NAMESPACE}Call__r.${NAMESPACE}Account__c, ${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name\
                        from ${NAMESPACE}SampleTransaction__c\
                        order by LastModifiedDate Desc Limit ${limit}`);

export const fetchOrdersData = limit =>
  api.query(
    `select (select ${NAMESPACE}Product__c, ${NAMESPACE}Quantity__c from ${NAMESPACE}SampleOrderDetails__r), Id, ${NAMESPACE}IsUrgent__c, LastModifiedDate, ${NAMESPACE}Status__c from ${NAMESPACE}SampleOrder__c order by LastModifiedDate Desc Limit ${limit}`
  );

export const fetchTransactionsListId = () =>
  api.query(
    `SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = '${NAMESPACE}SampleTransaction__c' AND DeveloperName = 'All'`
  );

export const fetchOrdersListId = () =>
  api.query(
    `SELECT Id, Name, DeveloperName FROM ListView WHERE SobjectType = '${NAMESPACE}SampleOrder__c' AND DeveloperName = 'All'`
  );
