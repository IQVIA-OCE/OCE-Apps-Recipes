import moment from 'moment';
import { packageConditions } from './constants';

export const normalizeProductsList = (
  products,
  recordType,
  selectedProducts
) => {
  if (products == null) return [];

  const productsList = products.map(product =>
    recordType == 'Return' ||
    recordType == 'Adjustment' ||
    recordType == 'TransferOut'
      ? mapSampleLotAllocationProduct(product, false)
      : mapLotProduct(product, false)
  );

  return productsList.map(el => {
    const selected = selectedProducts.find(selectedProduct => {
      return el.id === selectedProduct.id && el.lotId === selectedProduct.lotId;
    });

    return {
      ...el,
      selected: selected && selected.id ? true : false,
    };
  });
};

const mapLotProduct = (product, selected) => ({
  label: product.OCE__Product__r ? product.OCE__Product__r.Name : '',
  detailLabel: product.Name,
  id: product.OCE__Product__c,
  lotId: product.Id,
  selected,
});

const mapSampleLotAllocationProduct = (product, selected) => ({
  label: product.OCE__Lot__r.OCE__Product__r.Name,
  detailLabel: product.OCE__LotNumber__c,
  id: product.OCE__LotProductId__c,
  lotId: product.OCE__Lot__c,
  selected,
});

export const mapFormDetails = values => {
  const recordTypeDevName = values.recordType.DeveloperName;

  switch (recordTypeDevName) {
    case 'AcknowledgementOfShipment':
      return mapAOSFormDetails(values);
    case 'Adjustment':
      return mapAdjustmentFormDetails(values);
    case 'Return':
      return mapReturnFormDetails(values);
    case 'TransferIn':
      return mapTransferInFormDetails(values);
    case 'TransferOut':
      return mapTransferOutFormDetails(values);
    default:
      return null;
  }
};

const mapAOSFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(values.fields.transactionDateTime).format(
    'YYYY-MM-DDThh:mm:ss'
  ),
  OCE__ReceivedDate__c: moment(values.fields.receivedDate).format('YYYY-MM-DD'),
  OCE__TransactionRep__c: values.fields.transactionRep.Id,
  OCE__TransactionRepTerritory__c: values.fields.territory.name,
  OCE__ConditionOfPackage__c: values.fields.conditionOfPackage.label,
  OCE__FromSalesRep__c: values.fields.transactionRep.Id,
  OCE__Comments__c: values.fields.comments,
  RecordTypeId: values.recordType.Id,
});

const mapAdjustmentFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(values.fields.transactionDateTime).format(
    'YYYY-MM-DDThh:mm:ss'
  ),
  OCE__TransactionRep__c: values.fields.transactionRep.Id,
  OCE__TransactionRepTerritory__c: values.fields.territory.name,
  OCE__Comments__c: values.fields.comments,
  RecordTypeId: values.recordType.Id,
});

export const mapReturnFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(values.fields.transactionDateTime).format(
    'YYYY-MM-DDThh:mm:ss'
  ),
  OCE__ShipmentDate__c: values.fields.shipmentDate
    ? moment(values.fields.shipmentDate).format('YYYY-MM-DD')
    : null,
  OCE__ShipmentCarrier__c: values.fields.shipmentCarrier,
  OCE__FromSalesRep__c: values.fields.transactionRep.Id,
  OCE__TransactionRep__c: values.fields.transactionRep.Id,
  OCE__TransactionRepTerritory__c: values.fields.territory.name,
  OCE__TrackingNumber__c: values.fields.trackingNumber,
  OCE__Comments__c: values.fields.comments,
  RecordTypeId: values.recordType.Id,
});

const mapTransferInFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(values.fields.transactionDateTime).format(
    'YYYY-MM-DDThh:mm:ss'
  ),
  OCE__ToSalesRep__c: values.fields.user.Id,
  OCE__ToSalesRepTerritory__c: values.fields.territory.name,
  OCE__FromSalesRep__c: values.fields.fromSalesRep.value,
  OCE__FromSalesRepTerritory__c: values.fields.fromSalesRepTerritory,
  OCE__ShipToID__c: values.fields.shipTo.id,
  OCE__ConditionOfPackage__c: values.fields.conditionOfPackage.label,
  OCE__ReceivedDate__c: values.fields.receivedDate
    ? moment(values.fields.receivedDate).format('YYYY-MM-DD')
    : null,
  OCE__Comments__c: values.fields.comments,
  OCE__FullAddress__c: values.fields.shipTo.label,
  RecordTypeId: values.recordType.Id,
});

const mapTransferOutFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(values.fields.transactionDateTime).format(
    'YYYY-MM-DDThh:mm:ss'
  ),
  OCE__FromSalesRep__c: values.fields.user.Id,
  OCE__FromSalesRepTerritory__c: values.fields.territory.name,
  OCE__ToSalesRep__c: values.fields.toSalesRep.value,
  OCE__ToSalesRepTerritory__c: values.fields.toSalesRepTerritory,
  OCE__ShipToID__c: values.fields.shipTo.id,
  OCE__ShipmentDate__c: moment(values.fields.shipmentDate).format('YYYY-MM-DD'),
  OCE__TrackingNumber__c: values.fields.trackingNumber,
  OCE__ShipmentCarrier__c: values.fields.shipmentCarrier,
  OCE__Comments__c: values.fields.comments,
  OCE__FullAddress__c: values.fields.shipTo.label,
  RecordTypeId: values.recordType.Id,
});

export const mapFormProducts = (product, transactionId) => {
  if (product == null) return null;
  if (product.id) {
    return {
      OCE__Comments__c: product.comments,
      OCE__Product__c: product.sampleProductId,
      OCE__Quantity__c: product.quantity,
      OCE__LotNumber__c: product.lotNumberId,
      OCE__Reason__c: product.reason ? product.reason.label : null,
      OCE__IsSystemCreated__c: product.isSystemCreated ? true : false,
    };
  }

  return {
    OCE__Comments__c: product.comments,
    OCE__Product__c: product.sampleProductId,
    OCE__Quantity__c: product.quantity,
    OCE__SampleTransaction__c: transactionId,
    OCE__LotNumber__c: product.lotNumberId,
    OCE__Reason__c: product.reason ? product.reason.label : null,
    OCE__IsSystemCreated__c: product.isSystemCreated ? true : false,
  };
};

export const normalizeUsers = (data = []) => {
  return data.map(user => ({
    value: user.Id,
    label: user.Name,
  }));
};

export const normalizeLocations = (data = []) => {
  return data.map(location => ({
    id: location.Id,
    label: location.OCE__FullAddress__c,
  }));
};

export const getFieldError = (fieldName, errors, touched) => {
  return (
    errors.fields &&
    errors.fields[fieldName] &&
    touched.fields &&
    touched.fields[fieldName]
  );
};

export const getFieldHelperText = (fieldName, errors, touched) => {
  return getFieldError(fieldName, errors, touched)
    ? errors.fields[fieldName]
    : null;
};

export const mapTransactionDetails = transactionsData => {
  const transactionDetails = transactionsData.map(sampleTransaction => {
    const detailsCount = sampleTransaction.OCE__SampleTransactionItems__r
      ? sampleTransaction.OCE__SampleTransactionItems__r.totalSize
      : null;

    return {
      id: sampleTransaction.Id,
      conditionOfPackage: packageConditions.find(
        cond => cond.label == sampleTransaction.OCE__ConditionOfPackage__c
      ),
      fromSalesRepId: sampleTransaction.OCE__FromSalesRep__c,
      fromSalesRepName: sampleTransaction.OCE__FromSalesRep__r
        ? sampleTransaction.OCE__FromSalesRep__r.Name
        : null,
      fromSalesRep: {
        value: sampleTransaction.OCE__FromSalesRep__c,
        label: sampleTransaction.OCE__FromSalesRep__r
          ? sampleTransaction.OCE__FromSalesRep__r.Name
          : null,
      },
      lastModifiedDate: sampleTransaction.LastModifiedDate,
      receivedDate: sampleTransaction.OCE__ReceivedDate__c,
      recordTypeName: sampleTransaction.RecordType
        ? sampleTransaction.RecordType.Name
        : null,
      recordTypeDevName: sampleTransaction.RecordType
        ? sampleTransaction.RecordType.DeveloperName
        : null,
      shipmentDate: sampleTransaction.OCE__ShipmentDate__c,
      status: sampleTransaction.OCE__Status__c,
      toSalesRepId: sampleTransaction.OCE__ToSalesRep__c,
      toSalesRepName: sampleTransaction.OCE__ToSalesRep__r
        ? sampleTransaction.OCE__ToSalesRep__r.Name
        : null,
      toSalesRep: {
        value: sampleTransaction.OCE__ToSalesRep__c,
        label: sampleTransaction.OCE__ToSalesRep__r
          ? sampleTransaction.OCE__ToSalesRep__r.Name
          : null,
      },
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
      comments: sampleTransaction.OCE__Comments__c,
      territory: {
        name: 'TM - SPC - Aurora 20A02T06',
      },
      shipTo: {
        id: sampleTransaction.OCE__ShipToID__c,
        label: sampleTransaction.OCE__FullAddress__c,
      },
      name: sampleTransaction.Name,
      relatedTransactionName: sampleTransaction.OCE__RelatedTransactionName__c,
      isSystemCreated: sampleTransaction.OCE__IsSystemCreated__c,
      trackingNumber: sampleTransaction.OCE__TrackingNumber__c,
      shipmentCarrier: sampleTransaction.OCE__ShipmentCarrier__c,
    };
  });

  return transactionDetails[0];
};

export const mapTransactionProducts = transactionProducts => {
  return transactionProducts.map(transactionProduct => {
    return {
      id: transactionProduct.Id,
      label: transactionProduct.OCE__Product__r
        ? transactionProduct.OCE__Product__r.Name
        : '',
      detailLabel: transactionProduct.OCE__LotNumber__r.Name,
      lotNumber: transactionProduct.OCE__LotNumber__r.Name,
      lotNumberId: transactionProduct.OCE__LotNumber__c,
      sampleProductId: transactionProduct.OCE__Product__c,
      transactionId: transactionProduct.OCE__SampleTransaction__c,
      quantity: `${transactionProduct.OCE__Quantity__c}`,
      comments: transactionProduct.OCE__Comments__c,
      reason: {
        id: transactionProduct.OCE__Reason__c,
        label: transactionProduct.OCE__Reason__c,
      },
      deleted: false,
    };
  });
};

export const createTransactionProduct = product => {
  return {
    label: product.label,
    detailLabel: product.detailLabel,
    lotNumber: product.detailLabel,
    lotNumberId: product.lotId,
    sampleProductId: product.id,
    deleted: false,
  };
};

export const createTransferInDetailsForReturn = (values, returnValues) => {
  return {
    OCE__TransactionDateTime__c: moment().format('YYYY-MM-DDThh:mm:ss'),
    OCE__ShipmentDate__c: moment(values.shipmentDate).format('YYYY-MM-DD'),
    OCE__ShipmentCarrier__c: values.shipmentCarrier,
    OCE__TrackingNumber__c: values.trackingNumber,
    OCE__ShipToID__c: values.shipTo.id,
    OCE__Comments__c: values.comments,
    OCE__ToSalesRep__c: returnValues.fields.fromSalesRep.value,
    OCE__ToSalesRepTerritory__c: returnValues.fields.fromSalesRepTerritory,
    OCE__FromSalesRepTerritory__c: returnValues.fields.territory.name,
    OCE__FromSalesRep__c: returnValues.fields.toSalesRepId,
    OwnerId: returnValues.fields.fromSalesRep.value,
    OCE__RelatedTransactionId__c: returnValues.fields.id,
    OCE__IsSystemCreated__c: true,
    OCE__TransactionRep__c: returnValues.fields.fromSalesRep.value,
    RecordTypeId: returnValues.fields.recordTypeId,
    OCE__FullAddress__c: values.shipTo.label,
  };
};

export const createTransferInDetailsForTransferOut = (
  values,
  relatedTransactionId
) => {
  return {
    OCE__FromSalesRep__c: values.fields.user.Id,
    OCE__FromSalesRepTerritory__c: values.fields.territory.name,
    OCE__ToSalesRep__c: values.fields.toSalesRep.value,
    OCE__ToSalesRepTerritory__c: values.fields.toSalesRepTerritory,
    OCE__Status__c: 'In Progress',
    OwnerId: values.fields.toSalesRep.value,
    OCE__RelatedTransactionId__c: relatedTransactionId,
    RecordTypeId: values.recordType.Id,
    OCE__ShipToID__c: values.fields.shipTo.id,
    OCE__ShipmentCarrier__c: values.fields.shipmentCarrier,
    OCE__TrackingNumber__c: values.fields.trackingNumber,
    OCE__Comments__c: values.fields.comments,
    OCE__ShipmentDate__c: moment(values.fields.shipmentDate).format(
      'YYYY-MM-DD'
    ),
    OCE__TransactionDateTime__c: moment(
      values.fields.transactionDateTime
    ).format('YYYY-MM-DDThh:mm:ss'),
    OCE__FullAddress__c: values.fields.shipTo.label,
    OCE__IsSystemCreated__c: true,
    OCE__TransactionRep__c: values.fields.toSalesRep.value,
  };
};
