import api from '../utils/api';
import { NAMESPACE, ADDITIONAL_SEARCH_FIELDS_MAP } from '../constants';
import { environment, databaseManager } from 'oce-apps-bridges';
import { isJapaneseLocale } from '../utils';

const userProfileID = environment.profileId();

/**
 *
 * @param {number} limit
 * @param {number} offset
 * @param {string|undefined} searchQuery
 * @param {string[]|undefined} userPreferredCountries
 */

export const fetchSpeakers = async ({ limit = 15, offset = 0, searchQuery = '', userPreferredCountries = [] }) => {
  const dbSearchFields = searchQuery ? await getDbSearchFields() : [];

  const searchQueryConditions = `(Name LIKE '%${searchQuery}%'
     ${
       dbSearchFields.includes(ADDITIONAL_SEARCH_FIELDS_MAP.specialty)
         ? ` OR ${NAMESPACE}Specialty__c INCLUDES ('${searchQuery}')`
         : ''
     }
     ${
       dbSearchFields.includes(ADDITIONAL_SEARCH_FIELDS_MAP.professionalDesignation)
         ? ` OR ${NAMESPACE}ProfessionalDesignation__c INCLUDES ('${searchQuery}')`
         : ''
     }
     ${
       dbSearchFields.includes(ADDITIONAL_SEARCH_FIELDS_MAP.status)
         ? ` OR ${NAMESPACE}Status__c LIKE '%${searchQuery}%'`
         : ''
     }
     ${dbSearchFields.includes(`${NAMESPACE}kananame__c`) ? ` OR ${NAMESPACE}kananame__c LIKE '%${searchQuery}%'` : ''})
     `;

  const countriesCondition = `${NAMESPACE}Country__c IN (${userPreferredCountries.map(c => `'${c}'`).join(', ')})`;

  const whereClause =
    searchQuery || userPreferredCountries.length > 0
      ? `WHERE
           ${searchQuery ? searchQueryConditions : ''}
           ${searchQuery && userPreferredCountries.length > 0 ? ' AND ' : ''}
           ${userPreferredCountries.length > 0 ? countriesCondition : ''}
        `
      : '';

  const fields = [
    'Id',
    'Name',
    `${NAMESPACE}Account__c`,
    `${NAMESPACE}Account__r.${NAMESPACE}AllowRestrictedProducts__c`,
    `${NAMESPACE}Account__r.Id`,
    `${NAMESPACE}Specialty__c`,
    `${NAMESPACE}ProfessionalDesignation__c`,
    `${NAMESPACE}Status__c`,
    `${NAMESPACE}User__c`,
  ];

  const query = `SELECT ${fields.join(', ')}\
   FROM ${NAMESPACE}Speaker__c ${whereClause}\
   ORDER BY Name ASC\
   LIMIT ${limit} OFFSET ${offset}`;

  return api.queryOffline(prettifyQuery(query));
};

const prettifyQuery = q =>
  q
    .replace(/\n/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(' )', ')');

/**
 *
 * @param {string} meetingId
 */
export const fetchMeeting = meetingId => {
  const query = `SELECT Id, ${NAMESPACE}Status__c, RecordType.DeveloperName, ${NAMESPACE}ContextUserRole__c FROM ${NAMESPACE}Meeting__c WHERE Id = '${meetingId}'`;

  return api.queryOffline(query);
};

/**
 *
 * @param {string} recordTypeId
 */
export const fetchRecordType = recordTypeId => {
  const query = `SELECT Id FROM RecordType WHERE Id = '${recordTypeId}'`;

  return api.queryOffline(query);
};

/**
 *
 * @param {string} meetingId
 * @param {string} recordTypeId
 */
export const fetchMeetingMembers = (meetingId, recordTypeId) => {
  return api.queryOffline(`
    SELECT Id, Name, RecordType.DeveloperName, ${NAMESPACE}Speaker__c, CreatedDate, CurrencyIsoCode FROM ${NAMESPACE}MeetingMember__c\
    WHERE ${NAMESPACE}Meeting__c = '${meetingId}' AND RecordTypeId = '${recordTypeId}'
    `);
};

export const fetchUserPreferredCountries = userId => {
  const query = `SELECT user.QIDC__MDM_Preferred_Country_ims__c FROM user WHERE uid = '${userId}'`;

  return api.queryOffline(query);
};

export const createMeetingMembers = members => {
  const membersWithSObjectField = members.map(m => ({
    ...m,
    sobject: `${NAMESPACE}meetingmember__c`,
  }));

  return databaseManager.upsert(membersWithSObjectField);
};

export const deleteMeetingMembers = memberIds => databaseManager.delete(memberIds);

export const getDbSearchFields = async () => {
  const dbSearchFields = ['Name'];
  if (isJapaneseLocale()) dbSearchFields.push(`${NAMESPACE}kananame__c`);

  const isAdvancedSearchEnabled = await getIsAdvancedSearchEnabled(userProfileID);

  if (isAdvancedSearchEnabled) {
    const keys = Object.keys(ADDITIONAL_SEARCH_FIELDS_MAP);
    const promises = keys.map(k => doesFieldExist(ADDITIONAL_SEARCH_FIELDS_MAP[k], `${NAMESPACE}Speaker__c`));

    const existFlags = await Promise.all(promises);

    keys.forEach((k, idx) => {
      const flag = existFlags[idx];
      if (flag) dbSearchFields.push(ADDITIONAL_SEARCH_FIELDS_MAP[k]);
    });
  }

  return dbSearchFields;
};

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
 * @param {string} setupOwnerId
 * @returns {Promise<boolean>}
 */
export const getIsAdvancedSearchEnabled = async setupOwnerId => {
  const [[response]] = await api.queryOffline(
    `SELECT ${NAMESPACE}EnableAdvancedSearch__c FROM ${NAMESPACE}ApplicationSettings__c WHERE SetupOwnerId = '${setupOwnerId}'`
  );

  if (typeof response?.[`${NAMESPACE}EnableAdvancedSearch__c`] !== 'undefined') {
    return Boolean(response[`${NAMESPACE}EnableAdvancedSearch__c`]);
  }

  return false;
};
