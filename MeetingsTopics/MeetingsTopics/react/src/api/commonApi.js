import api from '../utils/api';
import { NAMESPACE } from '../constants';

/**
 *
 * @param {string} fieldName
 * @param {string} tableName
 *
 * @returns {Promise<boolean>}
 */
export const doesFieldExist = async (fieldName, tableName) => {
  try {
    await api.queryOffline(`SELECT ${fieldName} from ${tableName} LIMIT 1`);

    return true;
  } catch (e) {
    return false;
  }
};

/**
 *
 * @returns {Promise<boolean>}
 */
export const getIsAdvancedSearchEnabled = async () => {
  try {
    const [[response]] = await api.queryOffline(
      `SELECT ${NAMESPACE}EnableAdvancedSearch__c FROM ${NAMESPACE}ApplicationSettings__c`
    );

    return Boolean(response[`${NAMESPACE}EnableAdvancedSearch__c`]);
  } catch (e) {
    return false;
  }
};
