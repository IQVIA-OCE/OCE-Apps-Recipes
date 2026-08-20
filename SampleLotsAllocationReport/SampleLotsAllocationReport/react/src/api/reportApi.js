import { sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { SEARCH_QUERY, NAMESPACE, USERID, TERRITORY, TRANSACTION_SEARCH_QUERY, DTP_SEARCH_QUERY, DTP_DETAIL_SEARCH_QUERY } from '../constants';

/**
 *
 * @param {number} limit
 * @param {number} offset
 * @param {boolean} isRecordCount
 * @param {string|undefined} searchQuery
 * @param {string|undefined} searchField
 */



export const fetchReportData = async ({
  limit = 25,
  offset = 0,
  isRecordCount = false,
  searchQuery = '',
  searchField = '',
  sortClause = '',
}) => {

  let searchClause = '';

  if (searchQuery.trim()) {
    searchClause = `${SEARCH_QUERY[searchField]}  LIKE '%${searchQuery}%'`;
  }

  let sortClauseQuery = `${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name ASC`;
  if (sortClause) {
    sortClauseQuery = sortClause;
  }

  try {

    const fields = [
      'Id',
      `${NAMESPACE}Lot__c`,
      `${NAMESPACE}Lot__r.Name`,

      `${NAMESPACE}AllocatedQuantity__c`,
      `${NAMESPACE}RemainingQuantity__c`,


      `${NAMESPACE}LotProductId__c`,
      `${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name`,

      `${NAMESPACE}User__r.Name`,
    ];
    if (isRecordCount) {
      const query = `SELECT COUNT()\
      FROM ${NAMESPACE}SampleLotAllocation__c\
      WHERE ${NAMESPACE}User__c='${USERID}' ${searchClause}`;
      const response = await sfNetAPI.query(query);
      return response.totalSize;
    }

    const query = `SELECT ${fields.join(', ')}\
    FROM ${NAMESPACE}SampleLotAllocation__c\
    WHERE ${NAMESPACE}User__c='${USERID}' ${searchClause}\
    ORDER BY ${sortClauseQuery} NULLS FIRST\
    LIMIT ${limit} OFFSET ${offset} `;
    const response = await sfNetAPI.query(query);
    return response.records;

  } catch (error) {
    throw error;
  }
};


/**
 *
 * @param {string} reportId
 */


export const fetchLastInventoryCreatedDate = async ({ reportId }) => {
  const query = `SELECT MAX(${NAMESPACE}SampleInventory__r.CreatedDate) date\
  FROM ${NAMESPACE}SampleTransactionDetail__c\
  WHERE ${NAMESPACE}SampleLotAllocation__r.${NAMESPACE}User__c='${USERID}'\
  AND ${NAMESPACE}SampleLotAllocation__c='${reportId}'\
  AND ${NAMESPACE}SampleInventory__c != null`;
  const response = await sfNetAPI.query(query);
  const { records } = response
  return records[0];
}


/**
 *
 * @param {number} limit
 * @param {number} offset
 */


export const fetchTransactionReportData = async ({
  limit = 25,
  offset = 0,
  searchQuery = '',
  searchField = '',
  reportId = null,
  lastInventoryDate = null,
  sortClause = '',
}) => {
  try {
    let searchClause = '';
    let dateFilter = '';
    if (searchQuery.trim()) {
      searchClause = `${TRANSACTION_SEARCH_QUERY[searchField]}  LIKE '%${searchQuery}%'`;
    }
    if (lastInventoryDate) {
      dateFilter = `AND CreatedDate >= ${lastInventoryDate}`
    }
    let sortClauseQuery = `${NAMESPACE}Product__r.Name ASC`;
    if (sortClause) {
      sortClauseQuery = sortClause;
    }

    const fields = [
      'Id',
      `${NAMESPACE}CallSample__c`,
      `${NAMESPACE}CallSample__r.Name`,
      `${NAMESPACE}Product__c`,
      `${NAMESPACE}Product__r.Name`,
      `${NAMESPACE}Quantity__c`,

      `${NAMESPACE}SampleTransaction__r.RecordType.DeveloperName`,
      `${NAMESPACE}SampleTransaction__r.${NAMESPACE}TransactionDateTime__c`,
      `${NAMESPACE}SampleTransaction__r.${NAMESPACE}Status__c`,
      `${NAMESPACE}SampleTransaction__r.${NAMESPACE}Call__c`,
      `${NAMESPACE}SampleTransaction__r.${NAMESPACE}Call__r.Name`,
    ];

    const query = `SELECT ${fields.join(', ')} \
    FROM ${NAMESPACE}SampleTransactionDetail__c\
    WHERE ${NAMESPACE}SampleLotAllocation__r.${NAMESPACE}User__c='${USERID}'\
    AND ${NAMESPACE}SampleLotAllocation__c = '${reportId}' ${searchClause}\
    AND ${NAMESPACE}SampleInventory__c=null ${dateFilter}\
    ORDER BY ${sortClauseQuery} NULLS FIRST\
    LIMIT ${limit} OFFSET ${offset}`;
    const response = await sfNetAPI.query(query);
    return response.records;
  } catch (error) {
    throw error;
  }
};



export const fetchDTPReportData = async ({
  limit = 25,
  offset = 0,
  isRecordCount = false,
  searchQuery = '',
  searchField = '',
  sortClause = ''
}) => {
  let searchClause = ``;
  if (searchQuery.trim()) {
    searchClause = `${DTP_SEARCH_QUERY[searchField]}  LIKE '%${searchQuery}%'`
  }
  let sortClauseQuery = `${NAMESPACE}Product__r.Name ASC`;
  if (sortClause) {
    sortClauseQuery = sortClause;
  }

  try {
    const { name } = TERRITORY;
    const fields = [
      'Id',
      `${NAMESPACE}Product__c`,
      `${NAMESPACE}Product__r.Name`,
      `${NAMESPACE}Product__r.${NAMESPACE}ParentProduct__c`,
      `${NAMESPACE}Product__r.${NAMESPACE}ParentProduct__r.Name`,

      `${NAMESPACE}PlanCycle__c`,
      `${NAMESPACE}PlanCycle__r.Name`,
      `${NAMESPACE}PlanCycle__r.${NAMESPACE}Period__r.${NAMESPACE}StartDate__c`,
      `${NAMESPACE}PlanCycle__r.${NAMESPACE}Period__r.${NAMESPACE}EndDate__c`,

      `${NAMESPACE}MaxLimitPerCall__c`,

      `${NAMESPACE}AllocatedQuantity__c`,
      `${NAMESPACE}AllocationsUsed__c`,
      `${NAMESPACE}AllocationsRemaining__c`,
    ];
    if (isRecordCount) {
      const query = `SELECT COUNT() \
      FROM ${NAMESPACE}ProductTerritoryAllocation__c\
      WHERE RecordType.DeveloperName = 'DTP'\
      AND ${NAMESPACE}Territory__c = '${name}'\
      AND ${NAMESPACE}PlanCycle__r.${NAMESPACE}Active__c = true\
      ${searchClause}`;
      const response = await sfNetAPI.query(query);
      return response.totalSize;
    }

    const query = `SELECT ${fields.join(', ')} \
    FROM ${NAMESPACE}ProductTerritoryAllocation__c\
    WHERE RecordType.DeveloperName = 'DTP'\
    AND ${NAMESPACE}Territory__c = '${name}' ${searchClause}\
    AND ${NAMESPACE}PlanCycle__r.${NAMESPACE}Active__c = true\
    ORDER BY ${sortClauseQuery} NULLS FIRST\
    LIMIT ${limit} OFFSET ${offset} `;
    const response = await sfNetAPI.query(query);
    return response.records;

  } catch (error) {
    throw error;
  }
};





/**
 *
 * @param {number} limit
 * @param {number} offset
 * @param {datetime|null} startDate
 * @param {datetime|null} endDate
 */


export const fetchDTPDetailReportData = async ({
  limit = 25,
  offset = 0,
  searchQuery = '',
  searchField = '',
  startDate = null,
  endDate = null,
  productId = null,
  sortClause = ''
}) => {
  let dateSearchClause = '';
  if (startDate) {
    dateSearchClause = `AND ${NAMESPACE}Call__r.Date__c > ${startDate}`
  }
  if (endDate) {
    dateSearchClause = `${dateSearchClause} AND ${NAMESPACE}Call__r.Date__c < ${endDate}`
  }
  let searchClause = ``;
  if (searchQuery.trim()) {
    searchClause = `${DTP_DETAIL_SEARCH_QUERY[searchField]}  LIKE '%${searchQuery}%'`
  }
  let sortClauseQuery = `${NAMESPACE}Product__r.Name ASC`;

  if (sortClause) {
    sortClauseQuery = sortClause;
  }

  try {

    const { name } = TERRITORY;
    const fields = [
      'Id',
      `${NAMESPACE}Account__c`,
      `${NAMESPACE}Account__r.Name`,

      `${NAMESPACE}Product__c`,
      `${NAMESPACE}Product__r.Name`,

      `${NAMESPACE}Sample__c`,
      `${NAMESPACE}Sample__r.Name`,

      `${NAMESPACE}Quantity__c`,
      `${NAMESPACE}QuantityShipped__c`,
      `${NAMESPACE}DateShipped__c`,
      `${NAMESPACE}FinalQuantity__c`,

      `${NAMESPACE}Call__r.${NAMESPACE}Account__c`,
      `${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name`,
      `${NAMESPACE}Call__r.${NAMESPACE}Date__c`,
      `${NAMESPACE}Call__r.${NAMESPACE}Status__c`
    ];
    const query = `SELECT ${fields.join(', ')} \
    FROM ${NAMESPACE}CallSampleOrder__c\
    WHERE ${NAMESPACE}Call__r.${NAMESPACE}Territory__c = '${name}' ${searchClause}\
    AND ${NAMESPACE}Sample__c='${productId}'\
    AND ${NAMESPACE}IsCalculatedForDtp__c = true\ ${dateSearchClause}\
    ORDER BY ${sortClauseQuery} NULLS FIRST\
    LIMIT ${limit} OFFSET ${offset} `;
    const response = await sfNetAPI.query(query);
    return response.records;
  } catch (error) {
    throw error;
  }
};




