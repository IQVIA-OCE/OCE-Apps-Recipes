import { NAMESPACE, ADDITIONAL_FIELDS } from '../constants';
import { api, getDbSearchFields } from '../utils';
import { databaseManager } from '@oce-apps/oce-apps-bridges';

/**
 *
 * @param {number} limit
 * @param {number} offset
 * @param {string|undefined} searchQuery
 * @param {object} meeting
 * @param {boolean } isSystemGeneratedFilterEnabled
 */
export const fetchTopics = async ({
  limit = 15,
  offset = 0,
  searchQuery = '',
  meeting,
  isSystemGeneratedFilterEnabled,
}) => {
  try {
    const dbSearchFields = await getDbSearchFields(
      [`${NAMESPACE}Topic__c.Name`],
      ADDITIONAL_FIELDS,
      `${NAMESPACE}Topic__c`
    );

    const systemGeneratedFilters = isSystemGeneratedFilterEnabled
      ? `AND ${NAMESPACE}Status__c = 'Approved'
       AND (${NAMESPACE}StartDate__c <= '${meeting.startDate}' OR ${NAMESPACE}StartDate__c = null)
       AND (${NAMESPACE}EndDate__c >= '${meeting.endDate}' OR ${NAMESPACE}EndDate__c = null)
       AND (${NAMESPACE}MeetingRecordTypes__c LIKE '%${meeting.recordTypeDevName}%' OR ${NAMESPACE}MeetingType__c LIKE '%${meeting.recordTypeDevName}%' )
    `
      : '';

    const searchWhereClause = searchQuery
      ? `AND (Name LIKE '%${searchQuery}%'
    ${
      dbSearchFields.includes(ADDITIONAL_FIELDS.status)
        ? `OR ${NAMESPACE}Status__c LIKE '%${searchQuery}%'`
        : ''
    }
    ${
      dbSearchFields.includes(ADDITIONAL_FIELDS.meetingRecordTypes)
        ? `OR ${NAMESPACE}MeetingRecordTypes__c LIKE '%${searchQuery}%'`
        : ''
    }
    ${
      dbSearchFields.includes(ADDITIONAL_FIELDS.meetingType)
        ? `OR ${NAMESPACE}MeetingType__c LIKE '%${searchQuery}%'`
        : ''
    }
    )`
      : '';

    const fields = [
      'Id',
      'Name',
      `${NAMESPACE}MeetingType__c`,
      `${NAMESPACE}MeetingRecordTypes__c`,
      `${NAMESPACE}Status__c`,
      `${NAMESPACE}StartDate__c`,
      `${NAMESPACE}EndDate__c`,
      'CurrencyIsoCode',
    ];

    const query = `SELECT ${fields.join(', ')}\
    FROM ${NAMESPACE}Topic__c\
    WHERE RecordType.DeveloperName = 'Meeting' ${searchWhereClause} ${systemGeneratedFilters}\
    ORDER BY Name ASC NULLS FIRST\
    LIMIT ${limit} OFFSET ${offset}`;

    return api.queryOffline(query);
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {string} meetingId
 */
export const fetchMeetingTopics = meetingId => {
  try {
    const fields = [
      'Id',
      'CurrencyIsoCode',
      'Name',
      `${NAMESPACE}IsHostTopic__c`,
      `${NAMESPACE}Meeting__c`,
      `${NAMESPACE}Topic__c`,
    ];
    const query = `SELECT ${fields.join(', ')} FROM ${NAMESPACE}MeetingTopic__c WHERE ${NAMESPACE}Meeting__c = '${meetingId}'`;

    return api.queryOffline(query);
  } catch (error) {
    throw error;
  }
};

export const createMeetingTopics = topics => {
  try {
    const topicsWithSObjectField = topics.map(t => ({
      ...t,
      sobject: `${NAMESPACE}MeetingTopic__c`,
    }));

    return databaseManager.upsert(topicsWithSObjectField);
  } catch (error) {
    throw error;
  }
};

export const deleteMeetingTopic = topicIds => databaseManager.delete(topicIds);
