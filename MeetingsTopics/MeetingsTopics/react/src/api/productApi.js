import { api } from '../utils';
import { databaseManager } from '@oce-apps/oce-apps-bridges';
import { NAMESPACE } from '../constants';

/**
 *
 * @param {string} topicId
 */
export const fetchTopicsProducts =  topicId => {
  const query = `SELECT Id, ${NAMESPACE}Product__c, ${NAMESPACE}Topic__c FROM ${NAMESPACE}TopicProduct__c WHERE ${NAMESPACE}Topic__c = '${topicId}'`;

  return api.queryOffline(query);
};

export const createMeetingProducts = (products) => {
  try {
    const productsWithSObjectField = products.map((p) => ({
      ...p,
      sobject: `${NAMESPACE}MeetingProduct__c`,
    }));

    return databaseManager.upsert(productsWithSObjectField);
  } catch (error) {
    throw error;
  }
};

export const deleteMeetingProducts = productIds => databaseManager.delete(productIds);

/**
 *
 * @param {string} topicId
 * @param {string} meetingId
 */
export const fetchMeetingProduct = (meetingId, topicId) => {
  const query = `SELECT Id FROM ${NAMESPACE}MeetingProduct__c WHERE ${NAMESPACE}Meeting__c = '${meetingId}' AND ${NAMESPACE}Topic__c = '${topicId}'`;

  return api.queryOffline(query);
};
