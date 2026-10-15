import { environment, databaseManager, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { DateTime } from 'luxon';
import { Platform } from 'react-native';

const NAMESPACE = environment.namespace();

export const fetchParentProductIds = (queryLocator) => {
  if (queryLocator) {
    return databaseManager.fetch(queryLocator);
  }
  return databaseManager.fetch(
    `SELECT ${NAMESPACE}ParentBrandProductId__c FROM ${NAMESPACE}Product__c where ${NAMESPACE}ParentBrandProductId__c != null`
  );
};

export const fetchBrands = (parentProductIds = null, queryLocator) => {
  if (queryLocator) {
    return databaseManager.fetch(queryLocator);
  }
  return databaseManager.fetch(
    `SELECT Name, Id FROM ${NAMESPACE}Product__c WHERE Id IN ('${parentProductIds}')`
  );
};

export const fetchAccount = (accountId) => {
  return databaseManager.fetch(
    `SELECT Name FROM Account WHERE Id = '${accountId}'`
  );
};

export const fetchAccounts = (value) => {
  const nameFilter = value ? `AND Name LIKE '%${value}%'` : '';

  return databaseManager.fetch(
    `SELECT Id, Name FROM Account WHERE Name != null ${nameFilter} ORDER BY Name ASC NULLS FIRST Limit 50`
  );
};

export const fetchAccountIdByOrderId = (orderId) => {
  return databaseManager.fetch(
    `SELECT ${NAMESPACE}Account__c FROM ${NAMESPACE}Order2__c WHERE Id = '${orderId}'`
  );
};

export const fetchOrders = (values, recordId) => {
  const {
    orderName,
    productName,
    orderStartDate,
    orderEndDate,
    deliveryStartDate,
    deliveryEndDate,
    orderStatus,
    deliveryStatus,
    brands,
  } = values;

  const orderNameFilter = orderName
    ? `${NAMESPACE}Order2__r.Name LIKE '%${orderName}%'`
    : '';
  const productNameFilter = productName
    ? `${NAMESPACE}Order2__c IN (
		SELECT
			${NAMESPACE}Order2__c
		FROM
			${NAMESPACE}OrderLineItem2__c
		WHERE
			${NAMESPACE}ProductName__c LIKE '%${productName}%'
	)`
    : '';
  const orderStartDateFilter = orderStartDate
    ? `${NAMESPACE}Order2__r.${NAMESPACE}OrderDate__c >= ${DateTime.fromISO(
        orderStartDate
      ).toFormat('yyyy-LL-dd')}`
    : '';
  const orderEndDateFilter = orderEndDate
    ? `${NAMESPACE}Order2__r.${NAMESPACE}OrderDate__c <= ${DateTime.fromISO(
        orderEndDate
      ).toFormat('yyyy-LL-dd')}`
    : '';

  const deliveryStartDateFilter = deliveryStartDate
    ? `${NAMESPACE}DeliveryDate__c >= ${DateTime.fromISO(
        deliveryStartDate
      ).toFormat('yyyy-LL-dd')}`
    : '';
  const deliveryEndDateFilter = deliveryEndDate
    ? `${NAMESPACE}DeliveryDate__c <= ${DateTime.fromISO(
        deliveryEndDate
      ).toFormat('yyyy-LL-dd')}`
    : '';

  const orderStatusFormQuery = () => {
    if (orderStatus.length) {
      let startQuery = '(';
      orderStatus.forEach((item, index) => {
        if (index === 0) {
          startQuery = `${startQuery}${NAMESPACE}Order2__r.${NAMESPACE}Status__c = '${item.value}'`;
        } else {
          startQuery = `${startQuery} OR ${NAMESPACE}Order2__r.${NAMESPACE}Status__c = '${item.value}'`;
        }
      });
      return `${startQuery})`;
    }
    return '';
  };
  const deliveryStatusFormQuery = () => {
    if (deliveryStatus.length) {
      let startQuery = '(';
      deliveryStatus.forEach((item, index) => {
        if (index === 0) {
          startQuery = `${startQuery}${NAMESPACE}Status__c = '${item.value}'`;
        } else {
          startQuery = `${startQuery} OR ${NAMESPACE}Status__c = '${item.value}'`;
        }
      });
      return `${startQuery})`;
    }
    return '';
  };

  const brandsFormQuery = () => {
    if (brands.length) {
      let startQuery = `${NAMESPACE}Order2__c IN (
        SELECT
            ${NAMESPACE}Order2__c
        FROM
            ${NAMESPACE}OrderLineItem2__c
        WHERE  `;
      brands.forEach((item, index) => {
        if (index === 0) {
          startQuery = `${startQuery} ${NAMESPACE}Product__r.${NAMESPACE}ParentBrandProductId__r.Id = '${item.value}'`;
        } else {
          startQuery = `${startQuery} OR ${NAMESPACE}Product__r.${NAMESPACE}ParentBrandProductId__r.Id = '${item.value}'`;
        }
      });
      return `${startQuery})`;
    }
    return '';
  };

  const orderStatusFilter = orderStatusFormQuery();
  const deliveryStatusFilter = deliveryStatusFormQuery();
  const brandsFilter = brandsFormQuery();

  const recordIdFilter = recordId
    ? `${NAMESPACE}Account__c = '${recordId}'`
    : '';

  const filtersArray = [
    orderNameFilter,
    productNameFilter,
    orderStartDateFilter,
    orderEndDateFilter,
    deliveryStartDateFilter,
    deliveryEndDateFilter,
    orderStatusFilter,
    deliveryStatusFilter,
    recordIdFilter,
    brandsFilter,
  ].filter((item) => item);

  let filters = '';
  if (filtersArray.length) {
    filters = `WHERE `;
    filtersArray.forEach((item, i) => {
      if (i === 0) {
        filters = `${filters} ${item}`;
        return;
      }
      filters = `${filters} AND ${item}`;
    });
  }

  let filterOnEmptyDelivery = `${NAMESPACE}Order2__r.${NAMESPACE}NetAmount__c != null AND ${NAMESPACE}Order2__r.${NAMESPACE}Quantity__c != null`;
  if (filters.length) {
    filters = `${filters} AND ${filterOnEmptyDelivery}`;
  } else {
    filters = `WHERE ${filterOnEmptyDelivery}`;
  }

  return databaseManager.fetch(`
    SELECT
        MAX(${NAMESPACE}Order2__r.Id) Id,
        MAX(${NAMESPACE}Order2__r.Name) Order_Name,
        MAX(${NAMESPACE}Order2__r.${NAMESPACE}Account__r.Name) Order_Account_Name,
        MAX(${NAMESPACE}Order2__r.${NAMESPACE}OrderDate__c) Order_Date,
        MAX(${NAMESPACE}Order2__r.${NAMESPACE}Pricelist2__r.Name) Price_List_Name,
        MAX(${NAMESPACE}Order2__r.${NAMESPACE}NetAmount__c) Net_Amount,
        MAX(${NAMESPACE}Order2__r.${NAMESPACE}Quantity__c) Order_Quantity,
        MAX(${NAMESPACE}Order2__r.${NAMESPACE}Status__c) Order_Status,
        MAX(${NAMESPACE}Order2__r.${NAMESPACE}Account__c) ${NAMESPACE}Account__c
    FROM
	    ${NAMESPACE}OrderDelivery2__c
        ${filters}
    GROUP BY
	    ${NAMESPACE}Order2__c`);
};

export const fetchAllOrders = async (values, recordId, queryLocator = null) => {
  try {
    let response;

    if (queryLocator) {
      response = await databaseManager.fetch(queryLocator);
    } else {
      response = await fetchOrders(values, recordId);
    }
    let { records } = response;
    const { done } = response;

    const nextQueryLocator = response.queryLocator;

    if (!done && nextQueryLocator) {
      const extraData = await fetchAllOrders(
        values,
        recordId,
        nextQueryLocator
      );
      records = records.concat(extraData);
    }

    return Promise.resolve(records);
  } catch (err) {
    return Promise.reject(err);
  }
};

