import { databaseManager } from '@oce-apps/oce-apps-bridges';

export const queryWithSOQL = async (soql, queryLocator = null) => {
  let response;

  if (queryLocator) {
    // Fetch data by queryLocator
    response = await databaseManager.fetch(queryLocator);
  } else {
    // Fetch data by soql query
    
    response = await databaseManager.fetch(soql);
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
    const extraData = await queryWithSOQL(
      soql,
      nextQueryLocator
    );

    records = records.concat(extraData);
  }
  // Else return the complete array of records
  return records;
};
