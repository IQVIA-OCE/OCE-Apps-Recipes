import { NAMESPACE } from '../../constants/constants';

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
    detailLabel: product[`${NAMESPACE}ParentProduct__r`]?.Name,
    label: product.Name,
    sampleProductId: product.Id,
    selected,
  };
};

export const normalizeLocations = (data = []) => {
  return data.map(location => ({
    id: location.Id,
    label: location[`${NAMESPACE}FullAddress__c`],
  }));
};

export const normalizeProductTerritoryAllocationRecords = (data = []) => {
  return data.map(product => ({
    id: product[`${NAMESPACE}Product__c`],
    remainingAllocation: product[`${NAMESPACE}AllocationsRemaining__c`],
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
  [`${NAMESPACE}Status__c`]: values.fields.status,
  [`${NAMESPACE}OrderRecipient__c`]: values.fields.user.Id,
  [`${NAMESPACE}RecipientTerritory__c`]: values.fields.territory.name,
  [`${NAMESPACE}SubmittedDateTime__c`]: null,
  [`${NAMESPACE}IsUrgent__c`]: values.fields.isUrgent,
  [`${NAMESPACE}ShipToID__c`]: values.fields.shipTo.id,
  [`${NAMESPACE}ShipToText__c`]: values.fields.shipTo.label,
  [`${NAMESPACE}Comments__c`]: values.fields.comments,
  [`${NAMESPACE}ProductType__c`]: 'Sample',
});

export const mapFormProducts = (product, orderId) => ({
  Id: product.id,
  [`${NAMESPACE}Comments__c`]: product.comments,
  [`${NAMESPACE}Product__c`]: product.sampleProductId,
  [`${NAMESPACE}Quantity__c`]: product.quantity,
  [`${NAMESPACE}SampleOrder__c`]: orderId,
});

export const getSampleOrderConfigById = (configData, id) => {
  const config = configData.find(c => c.SetupOwnerId == id);

  if (config) {
    return {
      lockedStatus: config[`${NAMESPACE}SOLockedStatus__c`],
      finalStatus: config[`${NAMESPACE}SOFinalStatus__c`],
      orderCheck: config[`${NAMESPACE}SOProductQuantityLimit__c`],
      isApprovalRequired: config[`${NAMESPACE}SOIsApprovalRequired__c`],
      enableProductAllocation: config[`${NAMESPACE}SOEnableProductAllocation__c`],
      showProductAllocationRemaining:
        config[`${NAMESPACE}SOShowProductAllocationRemaining__c`],
    };
  } else {
    return null;
  }
};

export const mapOrderDetails = orderData => {
  const orderDetails = orderData.map(order => {
    return {
      id: order.Id,
      comments: order[`${NAMESPACE}Comments__c`],
      lastModifiedDate: order.LastModifiedDate,
      status: order[`${NAMESPACE}Status__c`],
      isUrgent: order[`${NAMESPACE}IsUrgent__c`],
      name: order.Name,
      territory: { name: order[`${NAMESPACE}RecipientTerritory__c`] },
      shipTo: {
        id: order[`${NAMESPACE}ShipToID__c`],
        label: order[`${NAMESPACE}ShipToText__c`],
      },
    };
  });

  return orderDetails[0];
};

export const mapOrderProducts = orderProducts => {
  return orderProducts.map(orderProduct => {
    return {
      id: orderProduct.Id,
      label: orderProduct[`${NAMESPACE}Product__r`]
        ? orderProduct[`${NAMESPACE}Product__r`].Name
        : '',
      detailLabel: orderProduct.Name,
      sampleProductId: orderProduct[`${NAMESPACE}Product__c`],
      orderId: orderProduct[`${NAMESPACE}SampleOrder__c`],
      quantity: orderProduct[`${NAMESPACE}Quantity__c`],
      comments: orderProduct[`${NAMESPACE}Comments__c`],
    };
  });
};

const NAMESPACE_LOWER_CASE = NAMESPACE ? NAMESPACE.toLowerCase() : '';

export const configKeys = {
  [`${NAMESPACE_LOWER_CASE}sishowsystemcalculatedfields__c`]: 'showCalculatedFields',
  [`${NAMESPACE_LOWER_CASE}sishowsystemcount__c`]: 'showSystemCount',
  setupownerid: 'ownerId',
  [`${NAMESPACE_LOWER_CASE}sishowloggedinuserrecords__c`]: 'record',
  [`${NAMESPACE_LOWER_CASE}stfinalstatus__c`]: 'status',
  [`${NAMESPACE_LOWER_CASE}sihistorylisthidden__c`]: 'historyHidden',
  [`${NAMESPACE_LOWER_CASE}soenableproductallocation__c`]: 'enableProductAllocation',
  [`${NAMESPACE_LOWER_CASE}soproductquantitylimit__c`]: 'orderCheck',
  [`${NAMESPACE_LOWER_CASE}sofinalstatus__c`]: 'finalStatus',
  [`${NAMESPACE_LOWER_CASE}soshowproductallocationremaining__c`]: 'showProductAllocationRemaining'
};
