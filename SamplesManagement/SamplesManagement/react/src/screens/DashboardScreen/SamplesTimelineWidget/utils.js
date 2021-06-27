export const mapTransactions = transactionsData => {
  return transactionsData.map(sampleTransaction => {
    const detailsCount = sampleTransaction.OCE__SampleTransactionItems__r
      ? sampleTransaction.OCE__SampleTransactionItems__r.totalSize
      : null;

    return {
      id: sampleTransaction.Id,
      conditionOfPackage: sampleTransaction.OCE__ConditionOfPackage__c,
      fromSalesRepId: sampleTransaction.OCE__FromSalesRep__c,
      fromSalesRepName: sampleTransaction.OCE__FromSalesRep__c
        ? sampleTransaction.OCE__FromSalesRep__r.Name
        : null,
      lastModifiedDate: sampleTransaction.LastModifiedDate,
      receivedDate: sampleTransaction.OCE__ReceivedDate__c,
      recordTypeName: sampleTransaction.RecordType.Name,
      recordTypeDevName: sampleTransaction.RecordType.DeveloperName,
      shipmentDate: sampleTransaction.OCE__ShipmentDate__c,
      status: sampleTransaction.OCE__Status__c,
      toSalesRepId: sampleTransaction.OCE__ToSalesRep__c,
      toSalesRepName: sampleTransaction.OCE__ToSalesRep__r
        ? sampleTransaction.OCE__ToSalesRep__r.Name
        : null,
      transactionDateTime: sampleTransaction.OCE__TransactionDateTime__c,
      transactionRepId: sampleTransaction.OCE__TransactionRep__c,
      transactionRepName: sampleTransaction.OCE__TransactionRep__r
        ? sampleTransaction.OCE__TransactionRep__r.Name
        : null,
      accountId: sampleTransaction.OCE__Call__r
        ? sampleTransaction.OCE__Call__r.OCE__Account__c
        : null,
      recordTypeId: sampleTransaction.RecordTypeId,
      accountName:
        sampleTransaction.OCE__Call__r &&
        sampleTransaction.OCE__Call__r.OCE__Account__r
          ? sampleTransaction.OCE__Call__r.OCE__Account__r.Name
          : null,
      address: sampleTransaction.OCE__FullAddress__c,
      detailsCount,
    };
  });
};

export const mapOrders = ordersData => {
  return ordersData.map(sampleOrder => {
    const detailsCount =
      sampleOrder.OCE__SampleOrderDetails__r != null
        ? sampleOrder.OCE__SampleOrderDetails__r.totalSize
        : null;

    return {
      id: sampleOrder.Id,
      isUrgent: sampleOrder.OCE__IsUrgent__c,
      status: sampleOrder.OCE__Status__c,
      lastModifiedDate: sampleOrder.LastModifiedDate,
      recordTypeName: 'Order',
      recordTypeDevName: 'Order',
      detailsCount,
    };
  });
};
