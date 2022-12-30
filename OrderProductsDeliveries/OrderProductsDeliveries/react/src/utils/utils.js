import { sfNetAPI, environment } from 'oce-apps-bridges'

export const normalizeOrderDeliveries = (productDetails) => {
  const NAMESPACE = environment.namespace();

  const productIds = productDetails
    .map((pDet) => pDet[`${NAMESPACE}Product__c`])
    .filter((v, i, a) => a.indexOf(v) === i);

  return productIds.map((id) => {
    const deliveries = productDetails
      .filter((productDetail) => productDetail[`${NAMESPACE}Product__c`] === id)
      .map((pDetail) => {
        return {
          id: pDetail[`${NAMESPACE}OrderDelivery2__c`],
          date: pDetail[
            `${NAMESPACE}OrderDelivery2__r.${NAMESPACE}DeliveryDate__c`
          ],
          quantity:
            pDetail[`${NAMESPACE}Quantity__c`] + pDetail[`${NAMESPACE}Free__c`],
        };
      });
      
    const totalProductQuantity = deliveries.reduce((acc, cVal) => {
      return Number(acc) + Number(cVal.quantity);
    }, 0);
    const firstProductDetail = productDetails.filter(
      (productDetail) => productDetail[`${NAMESPACE}Product__c`] === id
    )[0];
    const brandDetail = productDetails.find(item => item[`${NAMESPACE}Product__c`] === id);

    const productName = firstProductDetail[`${NAMESPACE}Product__r.Name`] ? firstProductDetail[`${NAMESPACE}Product__r.Name`] :
      firstProductDetail[`${NAMESPACE}ProductName__c`];
      
    return {
      productdId: id,
      productName,
      productCode:
        firstProductDetail[`${NAMESPACE}Product__r.${NAMESPACE}ProductCode__c`],
      deliveries,
      totalProductQuantity,
      parentBrandProduct: brandDetail ? {
        id: brandDetail[`${NAMESPACE}Product__r.${NAMESPACE}ParentBrandProductId__c`],
        label: brandDetail[`${NAMESPACE}Product__r.${NAMESPACE}ParentBrandProductId__r.Name`]
      } : null
    };
  });
};

export const extractBrandsOptions = (orderDeliveriesByProduct) => {
  return orderDeliveriesByProduct.reduce((unique, { parentBrandProduct }) => {
    const isBrandExist = parentBrandProduct.id && parentBrandProduct.label;
    if (!unique.some(obj => obj.value === parentBrandProduct.id) && isBrandExist) {
      unique.push({
        label: parentBrandProduct.label,
        value: parentBrandProduct.id
      });
    }
    return unique;
  }, []);
};