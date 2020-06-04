import moment from 'moment';

export const normalizeProductsList = (
  products,
  recordType,
  selectedProductIds
) => {
  if (products == null) return { byId: {}, allIds: [] };

  return products.reduce(
    (acc, el) => {
      const selectedId = selectedProductIds.find(id => id == el.Id);
      const selected = selectedId ? true : false;

      acc.allIds = [...acc.allIds, el.Id];
      acc.byId[el.Id] =
        recordType == 'Return' ||
        recordType == 'Adjustment' ||
        recordType == 'TransferOut'
          ? mapSampleLotAllocationProduct(el, selected)
          : mapLotProduct(el, selected);

      return acc;
    },
    { byId: {}, allIds: [] }
  );
};

const mapLotProduct = (product, selected) => ({
  ...product,
  name: product.Name,
  productName: product.OCE__Product__r.Name,
  selected,
});

const mapSampleLotAllocationProduct = (product, selected) => ({
  ...product,
  name: product.OCE__LotNumber__c,
  productName: product.OCE__Lot__r.OCE__Product__r.Name,
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

export const mapFormProducts = (product, transactionId, recordTypeDevName) => {
  switch (recordTypeDevName) {
    case 'AcknowledgementOfShipment':
      return mapAOSFormProducts(product, transactionId);
    case 'Adjustment':
      return mapAdjustmentFormProducts(product, transactionId);
    case 'Return':
      return mapReturnFormProducts(product, transactionId);
    case 'TransferIn':
      return mapTransferInFormProducts(product, transactionId);
    case 'TransferOut':
      return mapTransferOutFormProducts(product, transactionId);
    default:
      return null;
  }
};

const mapAOSFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(
    values.fields.transactionDateTime
  ).format(),
  OCE__ReceivedDate__c: moment(values.fields.receivedDate).format(),
  OCE__TransactionRep__c: values.fields.transactionRep.Id,
  OCE__TransactionRepTerritory__c: values.fields.territory.name,
  OCE__ConditionOfPackage__c: values.fields.conditionOfPackage.label,
  OCE__FromSalesRep__c: values.fields.transactionRep.Id,
  OCE__Comments__c: values.fields.comments,
  RecordTypeId: values.recordType.Id,
});

const mapAdjustmentFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(
    values.fields.transactionDateTime
  ).format(),
  OCE__TransactionRep__c: values.fields.transactionRep.Id,
  OCE__TransactionRepTerritory__c: values.fields.territory.name,
  OCE__Comments__c: values.fields.comments,
  RecordTypeId: values.recordType.Id,
});

const mapReturnFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(
    values.fields.transactionDateTime
  ).format(),
  OCE__ShipmentDate__c: values.fields.shipmentDate
    ? moment(values.fields.shipmentDate).format()
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
  OCE__TransactionDateTime__c: moment(
    values.fields.transactionDateTime
  ).format(),
  OCE__ToSalesRep__c: values.fields.user.Id,
  OCE__ToSalesRepTerritory__c: values.fields.territory.name,
  OCE__FromSalesRep__c: values.fields.fromSalesRep.value,
  OCE__FromSalesRepTerritory__c: values.fields.fromSalesRepTerritory,
  OCE__ShipToID__c: values.fields.shipTo.id,
  OCE__ConditionOfPackage__c: values.fields.conditionOfPackage.label,
  OCE__ReceivedDate__c: moment(values.fields.receivedDate).format(),
  OCE__Comments__c: values.fields.comments,
  OCE__FullAddress__c: values.fields.shipTo.label,
  RecordTypeId: values.recordType.Id,
});

const mapTransferOutFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__TransactionDateTime__c: moment(
    values.fields.transactionDateTime
  ).format(),
  OCE__FromSalesRep__c: values.fields.user.Id,
  OCE__FromSalesRepTerritory__c: values.fields.territory.name,
  OCE__ToSalesRep__c: values.fields.toSalesRep.value,
  OCE__ToSalesRepTerritory__c: values.fields.toSalesRepTerritory,
  OCE__ShipToID__c: values.fields.shipTo.id,
  OCE__ShipmentDate__c: moment(values.fields.shipmentDate).format(),
  OCE__TrackingNumber__c: values.fields.trackingNumber,
  OCE__ShipmentCarrier__c: values.fields.shipmentCarrier,
  OCE__Comments__c: values.fields.comments,
  OCE__FullAddress__c: values.fields.shipTo.label,
  RecordTypeId: values.recordType.Id,
});

const mapAOSFormProducts = (product, transactionId) => ({
  OCE__Comments__c: product.comments,
  OCE__Product__c: product.OCE__Product__c,
  OCE__Quantity__c: product.quantity,
  OCE__SampleTransaction__c: transactionId,
  OCE__LotNumber__c: product.Id,
});

const mapAdjustmentFormProducts = (product, transactionId) => ({
  OCE__Comments__c: product.comments,
  OCE__Product__c: product.OCE__LotProductId__c,
  OCE__Quantity__c: product.quantity,
  OCE__SampleTransaction__c: transactionId,
  OCE__LotNumber__c: product.OCE__Lot__c,
  OCE__Reason__c: product.reason.label,
});

const mapReturnFormProducts = (product, transactionId) => ({
  OCE__Comments__c: product.comments,
  OCE__Product__c: product.OCE__LotProductId__c,
  OCE__Quantity__c: product.quantity,
  OCE__SampleTransaction__c: transactionId,
  OCE__LotNumber__c: product.OCE__Lot__c,
});

const mapTransferInFormProducts = (product, transactionId) => ({
  OCE__Comments__c: product.comments,
  OCE__Product__c: product.OCE__Product__c,
  OCE__Quantity__c: product.quantity,
  OCE__SampleTransaction__c: transactionId,
  OCE__LotNumber__c: product.Id,
});

const mapTransferOutFormProducts = (product, transactionId) => ({
  OCE__Comments__c: product.comments,
  OCE__Product__c: product.OCE__LotProductId__c,
  OCE__Quantity__c: product.quantity,
  OCE__SampleTransaction__c: transactionId,
  OCE__LotNumber__c: product.OCE__Lot__c,
});

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
