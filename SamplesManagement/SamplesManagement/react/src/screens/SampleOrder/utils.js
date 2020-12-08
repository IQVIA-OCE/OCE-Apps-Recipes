export const normalizeProductsList = (
  products,
  selectedProducts,
  productTerritoryAllocationRecords = []
) => {
  if (products == null) return [];

  const productsList = products.map(product => {
    return mapSampleOrderProduct(product, false);
  });

  return productsList.map(el => {
    const selected = selectedProducts.find(selectedProduct => {
      return el.sampleProductId === selectedProduct.sampleProductId;
    });
    const allocationRecord = productTerritoryAllocationRecords
      ? productTerritoryAllocationRecords.find(
          prodAllocation => prodAllocation.id == el.sampleProductId
        )
      : null;
    const remainingAllocation = allocationRecord
      ? allocationRecord.remainingAllocation
      : null;

    return {
      ...el,
      selected: selected && selected.sampleProductId ? true : false,
      remainingAllocation:
        remainingAllocation != null ? remainingAllocation : 'NA',
    };
  });
};

const mapSampleOrderProduct = (product, selected) => {
  return {
    detailLabel: product.OCE__ParentProduct__r.Name,
    label: product.Name,
    sampleProductId: product.Id,
    selected,
  };
};

export const normalizeLocations = (data = []) => {
  return data.map(location => ({
    id: location.Id,
    label: location.OCE__FullAddress__c,
  }));
};

export const normalizeProductTerritoryAllocationRecords = (data = []) => {
  return data.map(product => ({
    id: product.OCE__Product__c,
    remainingAllocation: product.OCE__AllocationsRemaining__c,
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
  Id: product.id,
  OCE__Comments__c: product.comments,
  OCE__Product__c: product.sampleProductId,
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

export const mapOrderDetails = orderData => {
  const orderDetails = orderData.map(order => {
    return {
      id: order.Id,
      comments: order.OCE__Comments__c,
      lastModifiedDate: order.LastModifiedDate,
      status: order.OCE__Status__c,
      isUrgent: order.OCE__IsUrgent__c,
      name: order.Name,
      territory: { name: order.OCE__RecipientTerritory__c },
      shipTo: {
        id: order.OCE__ShipToID__c,
        label: order.OCE__ShipToText__c,
      },
    };
  });

  return orderDetails[0];
};

export const mapOrderProducts = orderProducts => {
  return orderProducts.map(orderProduct => {
    return {
      id: orderProduct.Id,
      label: orderProduct.OCE__Product__r
        ? orderProduct.OCE__Product__r.Name
        : '',
      detailLabel: orderProduct.Name,
      sampleProductId: orderProduct.OCE__Product__c,
      orderId: orderProduct.OCE__SampleOrder__c,
      quantity: `${orderProduct.OCE__Quantity__c}`,
      comments: orderProduct.OCE__Comments__c,
    };
  });
};
