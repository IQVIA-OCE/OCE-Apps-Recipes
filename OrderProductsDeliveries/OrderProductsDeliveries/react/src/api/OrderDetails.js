import { DateTime } from 'luxon';
import { environment, databaseManager } from 'oce-apps-bridges';

const NAMESPACE = environment.namespace();

export const fetchOrderDetails = (
  id,
  days,
  searchProductValue,
  brandFilterValueId
) => {
  let idFilter;

  if (id) {
    idFilter = `AND ${NAMESPACE}Account__c = '${id}'`;
  }

  const fromDateTime = DateTime.local()
    .setZone(environment.timeZone())
    .minus({ days })
    .toString();

  let productNameFilter =
    searchProductValue && searchProductValue.length
      ? `AND (${NAMESPACE}Product__r.Name LIKE '%${searchProductValue}%' OR ${NAMESPACE}Product__r.${NAMESPACE}ProductCode__c LIKE '%${searchProductValue}%')`
      : '';

  const fromDateTimeUtc = DateTime.fromISO(fromDateTime, {
    zone: 'utc',
  }).toFormat(`yyyy-MM-dd`);

  const brandFilter =
    brandFilterValueId && brandFilterValueId.length
      ? `AND ${NAMESPACE}Product__r.${NAMESPACE}ParentBrandProductId__c = '${brandFilterValueId}'`
      : '';

  return databaseManager.fetch(
    `SELECT Id, Name, ${NAMESPACE}Account__c, ${NAMESPACE}Free__c, ${NAMESPACE}OrderDelivery2__c, ${NAMESPACE}OrderDelivery2__r.${NAMESPACE}DeliveryDate__c,\
                ${NAMESPACE}OrderLineItem2__c, ${NAMESPACE}ProductName__c, ${NAMESPACE}Product__c, ${NAMESPACE}Product__r.${NAMESPACE}ProductCode__c, ${NAMESPACE}Product__r.Name, ${NAMESPACE}Quantity__c,\
                ${NAMESPACE}Product__r.${NAMESPACE}ParentBrandProductId__r.Name, ${NAMESPACE}Product__r.${NAMESPACE}ParentBrandProductId__c\
        FROM ${NAMESPACE}OrderDetail2__c\
        WHERE ${NAMESPACE}OrderDelivery2__r.${NAMESPACE}DeliveryDate__c >= ${fromDateTimeUtc} AND ${NAMESPACE}OrderDelivery2__r.${NAMESPACE}Status__c NOT IN ('Cancelled') AND ${NAMESPACE}OrderDelivery2__r.${NAMESPACE}Order2__r.${NAMESPACE}Status__c = 'Submitted' ${idFilter} ${productNameFilter} ${brandFilter}\
        ORDER BY ${NAMESPACE}Product__r.Name ASC NULLS FIRST`
  );
};

export const fetchAccounts = (value) => {
  const nameFilter = value ? `AND Name LIKE '%${value}%'` : '';

  return databaseManager.fetch(
    `SELECT Id, Name FROM Account WHERE Name != null ${nameFilter} ORDER BY Name ASC NULLS FIRST Limit 50`
  );
};

export const fetchAccountById = (id) => {
  return databaseManager.fetch(
    `SELECT Id, Name FROM Account WHERE Id = '${id}'`
  );
};

export const fetchOrderById = (id) => {
  return databaseManager.fetch(
    `SELECT Id, Name, ${NAMESPACE}Account__c FROM ${NAMESPACE}Order2__c WHERE Id = '${id}'`
  );
};

export const fetchAllOrderDetailsRecords = async (
  id,
  days,
  searchProductValue,
  brandFilter,
  queryLocator = null
) => {
  try {
    let response;

    if (queryLocator) {
      // Fetch data by queryLocator
      response = await databaseManager.fetch(queryLocator);
    } else {
      // Fetch data by soql query
      response = await fetchOrderDetails(
        id,
        days,
        searchProductValue,
        brandFilter
      );
    }

    // Extract records list from response
    let { records } = response;

    // Is fetch is done or there are other records to fetch
    const { done } = response;

    const nextQueryLocator = response.queryLocator;

    // If fetch is not done, fetch data by queryLocator and merge its output into the records array recursively

    // ToDo: Should check done field instead queryLocator
    // Related to totalSize: 0 issue
    if (nextQueryLocator) {
      const extraData = await fetchAllOrderDetailsRecords(
        id,
        days,
        searchProductValue,
        brandFilter,
        nextQueryLocator
      );
      records = records.concat(extraData);
    }
    // Else return the complete array of records
    return records;
  } catch (err) {
    return console.log(err);
  }
};
