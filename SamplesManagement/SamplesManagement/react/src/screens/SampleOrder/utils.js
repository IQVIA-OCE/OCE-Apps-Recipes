export const normalizeProductsList = (
  products,
  selectedProductIds,
  productTerritoryAllocationRecords = []
) => {
  if (products == null) return { byId: {}, allIds: [] };

  return products.reduce(
    (acc, el) => {
      const selectedId = selectedProductIds.find(id => id == el.Id);
      const selected = selectedId ? true : false;
      const allocationRecord = productTerritoryAllocationRecords
        ? productTerritoryAllocationRecords.find(rec => rec.id == el.Id)
        : null;
      const remainingAllocation = allocationRecord
        ? allocationRecord.remainingAllocation
        : null;

      acc.allIds = [...acc.allIds, el.Id];
      acc.byId[el.Id] = mapSampleOrderProduct(
        el,
        selected,
        remainingAllocation
      );

      return acc;
    },
    { byId: {}, allIds: [] }
  );
};

const mapSampleOrderProduct = (product, selected, remainingAllocation) => ({
  ...product,
  name: product.OCE__ParentProduct__r.Name,
  productName: product.Name,
  remainingAllocation: remainingAllocation != null ? remainingAllocation : 'NA',
  selected,
});

export const normalizeLocations = (data = []) => {
  return data.map(location => ({
    id: location.Id,
    label: location.OCE__FullAddress__c,
  }));
};

export const normalizeProductTerritoryAllocationRecords = (data = []) => {
  return data.map(rec => ({
    id: rec.OCE__Product__c,
    remainingAllocation: rec.OCE__AllocationsRemaining__c,
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

export const mapFormDetails = values => ({
  OCE__Status__c: values.fields.status,
  OCE__OrderRecipient__c: values.fields.user.Id,
  OCE__RecipientTerritory__c: values.fields.territory.name,
  OCE__SubmittedDateTime__c: null,
  OCE__IsUrgent__c: values.fields.isUrgent,
  OCE__ShipToID__c: values.fields.shipTo.id,
  OCE__ShipToText__c: values.fields.shipTo.label,
  OCE__Comments__c: values.fields.comments,
  OCE__ProductType__c: 'Sample',
});

export const mapFormProducts = (product, orderId) => ({
  OCE__Comments__c: product.comments,
  OCE__Product__c: product.Id,
  OCE__Quantity__c: product.quantity,
  OCE__SampleOrder__c: orderId,
});

export const getSampleOrderConfigById = (configData, id) => {
  const config = configData.find(c => c.SetupOwnerId == id);

  if (config) {
    return {
      lockedStatus: config.OCE__SOLockedStatus__c,
      finalStatus: config.OCE__SOFinalStatus__c,
      orderCheck: config.OCE__SOProductQuantityLimit__c,
      isApprovalRequired: config.OCE__SOIsApprovalRequired__c,
      enableProductAllocation: config.OCE__SOEnableProductAllocation__c,
      showProductAllocationRemaining:
        config.OCE__SOShowProductAllocationRemaining__c,
    };
  } else {
    return null;
  }
};
