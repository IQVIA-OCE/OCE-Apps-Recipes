import { DateTime } from 'luxon';
import { databaseManager, environment } from '@oce-apps/oce-apps-bridges';

const locale = (environment.locale() || '').replace('_', '-');

export const formatDate = (date) => {
  const dt = DateTime.fromISO(date, { zone: 'utc' });
  return dt.isValid
    ? dt.setLocale(locale).toLocaleString(DateTime.DATE_SHORT)
    : null;
};

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

//export const NAMESPACE = environment.namespace();

export const userId = () => {
  return environment.userId();
};

//export const profileId = environment.profileId();

//export const organizationId = environment.organizationId();

/*export const queryWithSOQLDatabase = async (soql = '') => {
  let p = new Promise((resolve, reject) => {
    databaseManager.fetch(soql).then(
      (data) => {
        if (data.records.length > 0) {
          resolve(data.records);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
  p.then((res) => {
    return res;
  }).catch((error) => {});
};
*/