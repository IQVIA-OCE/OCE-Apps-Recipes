import { NAMESPACE } from '../../../constants/constants';

export const mapTransactions = transactionsData => {
  return transactionsData.map(sampleTransaction => {
    const detailsCount = sampleTransaction[`${NAMESPACE}SampleTransactionItems__r`]
      ? sampleTransaction[`${NAMESPACE}SampleTransactionItems__r`].totalSize
      : null;

    return {
      id: sampleTransaction.Id,
      conditionOfPackage: sampleTransaction[`${NAMESPACE}ConditionOfPackage__c`],
      fromSalesRepId: sampleTransaction[`${NAMESPACE}FromSalesRep__c`],
      fromSalesRepName: sampleTransaction[`${NAMESPACE}FromSalesRep__c`]
        ? sampleTransaction[`${NAMESPACE}FromSalesRep__r`].Name
        : null,
      lastModifiedDate: sampleTransaction.LastModifiedDate,
      receivedDate: sampleTransaction[`${NAMESPACE}ReceivedDate__c`],
      recordTypeName: sampleTransaction.RecordType.Name,
      recordTypeDevName: sampleTransaction.RecordType.DeveloperName,
      shipmentDate: sampleTransaction[`${NAMESPACE}ShipmentDate__c`],
      status: sampleTransaction[`${NAMESPACE}Status__c`],
      toSalesRepId: sampleTransaction[`${NAMESPACE}ToSalesRep__c`],
      toSalesRepName: sampleTransaction[`${NAMESPACE}ToSalesRep__r`]
        ? sampleTransaction[`${NAMESPACE}ToSalesRep__r`].Name
        : null,
      transactionDateTime: sampleTransaction[`${NAMESPACE}TransactionDateTime__c`],
      transactionRepId: sampleTransaction[`${NAMESPACE}TransactionRep__c`],
      transactionRepName: sampleTransaction[`${NAMESPACE}TransactionRep__r`]
        ? sampleTransaction[`${NAMESPACE}TransactionRep__r`].Name
        : null,
      accountId: sampleTransaction[`${NAMESPACE}Call__r`]
        ? sampleTransaction[`${NAMESPACE}Call__r`][`${NAMESPACE}Account__c`]
        : null,
      recordTypeId: sampleTransaction.RecordTypeId,
      accountName:
        sampleTransaction[`${NAMESPACE}Call__r`] &&
        sampleTransaction[`${NAMESPACE}Call__r`][`${NAMESPACE}Account__r`]
          ? sampleTransaction[`${NAMESPACE}Call__r`][`${NAMESPACE}Account__r`].Name
          : null,
      address: sampleTransaction[`${NAMESPACE}FullAddress__c`],
      detailsCount,
    };
  });
};

export const mapOrders = ordersData => {
  return ordersData.map(sampleOrder => {
    const detailsCount =
      sampleOrder[`${NAMESPACE}SampleOrderDetails__r`] != null
        ? sampleOrder[`${NAMESPACE}SampleOrderDetails__r`].totalSize
        : null;

    return {
      id: sampleOrder.Id,
      isUrgent: sampleOrder[`${NAMESPACE}IsUrgent__c`],
      status: sampleOrder[`${NAMESPACE}Status__c`],
      lastModifiedDate: sampleOrder.LastModifiedDate,
      recordTypeName: 'Order',
      recordTypeDevName: 'Order',
      detailsCount,
    };
  });
};
